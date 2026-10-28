import { type ReactNode, useState } from 'react';

import BrowserOnly from '@docusaurus/BrowserOnly';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import { ErrorBoundaryErrorMessageFallback } from '@docusaurus/theme-common';
import useIsBrowser from '@docusaurus/useIsBrowser';
import clsx from 'clsx';
import { Editor, LiveEditor, LiveError, LivePreview } from 'react-live';

import { PlatformRow, PlatformSwitch } from '../../components/PlatformSwitch';
import { ControlRow, type Option } from '../../components/PropPlayground';
import { Device } from '../../home/device/Device';
import { PLATFORM } from '../../home/device/device.constants';
import type { Platform } from '../../home/device/device.types';
import { useCopyToClipboard } from '../../home/hooks/useCopyToClipboard';
import { toCodePreview, withCodePreview } from '../../live/codePreview';
import { findControls, readControl, writeControl } from '../../live/controls';
import { SANDBOXES } from '../../live/openSandbox';
import { canOpenInSandbox, toSourceUrl } from '../../live/sandbox';
import { CheckIcon, CodeIcon, CopyIcon, GitHubIcon, ResetIcon, SANDBOX_ICONS } from './components/icons';
import PlaygroundProvider from './Provider';
import { CODE_THEME } from './playground.constants';
import styles from './styles.module.css';

interface PlaygroundProps {
  children: string;
  scope?: Record<string, unknown>;
  /**
   * The code fence's words after the language: `wide` widens the preview on the Web tab, `noplatforms` hides the iOS / Android / Web
   * switch, and `device` runs the example full screen in the home page's phone and browser mocks.
   */
  metastring?: string;
}

interface ToolbarProps {
  code: string;
  edited: boolean;
  onReset: () => void;
  /** Absent when there's no shorter view of the code to collapse to */
  expanded?: boolean;
  onToggleExpanded: () => void;
}

interface IconButtonProps {
  label: string;
  onClick: () => void;
  children: ReactNode;
}

const Preview = ({ className = styles.stage }: { className?: string }) => (
  <BrowserOnly fallback={<div className={styles.loading}>Loading…</div>}>
    {() => (
      <ErrorBoundary fallback={(params) => <ErrorBoundaryErrorMessageFallback {...params} />}>
        <LivePreview className={className} />
        <LiveError className={styles.error} />
      </ErrorBoundary>
    )}
  </BrowserOnly>
);

/** An icon-only button, named for screen readers and shown as a tooltip on hover and keyboard focus. */
const IconButton = ({ label, onClick, children }: IconButtonProps) => (
  <button type="button" className={styles.iconButton} aria-label={label} data-tooltip={label} onClick={onClick}>
    {children}
  </button>
);

const Toolbar = ({ code, edited, onReset, expanded, onToggleExpanded }: ToolbarProps) => {
  const { copied, copy } = useCopyToClipboard(code);
  const sourceUrl = toSourceUrl(code);
  return (
    <div className={styles.toolbar}>
      {expanded === undefined ? (
        <span />
      ) : (
        <button type="button" className={styles.expand} aria-expanded={expanded} onClick={onToggleExpanded}>
          <CodeIcon />
          {expanded ? 'Collapse code' : 'Expand code'}
        </button>
      )}
      <div className={styles.actions}>
        {sourceUrl ? (
          <a
            className={styles.iconButton}
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            data-tooltip="View source on GitHub"
          >
            <GitHubIcon />
          </a>
        ) : null}
        {canOpenInSandbox(code)
          ? SANDBOXES.map(({ label, open }) => (
              <IconButton key={label} label={`Open in ${label}`} onClick={() => open(code)}>
                {SANDBOX_ICONS[label]}
              </IconButton>
            ))
          : null}
        <span className={styles.divider} aria-hidden="true" />
        <IconButton label={copied ? 'Copied' : 'Copy code'} onClick={copy}>
          {copied ? <CheckIcon /> : <CopyIcon />}
        </IconButton>
        {edited ? (
          <IconButton label="Reset code" onClick={onReset}>
            <ResetIcon />
          </IconButton>
        ) : null}
      </div>
    </div>
  );
};

/** A live example: the result, a panel for the props of the components it renders, a toolbar, and the editable code (collapsed to its JSX until expanded). */
export default function Playground({ children, scope, metastring }: PlaygroundProps) {
  const words = metastring?.split(' ') ?? [];
  const wide = words.includes('wide');
  const platforms = !words.includes('noplatforms');
  const device = words.includes('device');
  const initialCode = children.replace(/\n$/, '');
  const [code, setCode] = useState(initialCode);
  const [expanded, setExpanded] = useState(false);
  // The browser is the web, so iOS and Android are emulated: sheets instead of dropdowns, native insets and dragging.
  const [platform, setPlatform] = useState<Platform>(device ? PLATFORM.ios : PLATFORM.web);
  const isBrowser = useIsBrowser();
  const controls = findControls(code);
  const preview = toCodePreview(code);
  // With a props panel, the switch is its first row; without one, it floats over the preview.
  const platformRow = platforms && !device && controls.length > 0;
  const floatingPlatforms = platforms && !device && !platformRow;

  const choose = (prop: string, option: Option) => {
    const control = controls.find((c) => c.prop === prop);
    if (control && (typeof option === 'string' || typeof option === 'boolean')) setCode(writeControl(code, control, option));
  };

  return (
    <div className={styles.playground}>
      <PlaygroundProvider code={code} scope={scope} platform={platform}>
        <div className={clsx(styles.body, controls.length > 0 && styles.withPanel)}>
          <div
            className={styles.preview}
            data-wide={(wide && platform === PLATFORM.web) || undefined}
            data-platforms={floatingPlatforms || undefined}
            data-device={device ? platform : undefined}
          >
            {device ? (
              <Device platform={platform} onPlatformChange={setPlatform}>
                {() => <Preview className={styles.deviceScreen} />}
              </Device>
            ) : (
              <>
                {floatingPlatforms ? <PlatformSwitch platform={platform} onChange={setPlatform} /> : null}
                <Preview />
              </>
            )}
          </div>
          {controls.length > 0 ? (
            <aside className={styles.panel} aria-label="Props">
              {platformRow ? <PlatformRow platform={platform} onChange={setPlatform} /> : null}
              <div className={styles.panelTitle}>Props</div>
              {controls.map((control) => (
                <ControlRow key={control.prop} control={control} selected={readControl(code, control)} onChoose={choose} />
              ))}
            </aside>
          ) : null}
        </div>
        <Toolbar
          code={code}
          edited={code !== initialCode}
          onReset={() => setCode(initialCode)}
          expanded={preview === null ? undefined : expanded}
          onToggleExpanded={() => setExpanded(!expanded)}
        />
        <div className={styles.code}>
          {/* Remounted on hydration, or the theme isn't applied */}
          {expanded || preview === null ? (
            <LiveEditor key={String(isBrowser)} className={styles.editor} onChange={setCode} />
          ) : (
            <Editor
              key={String(isBrowser)}
              className={styles.editor}
              code={preview}
              language="tsx"
              theme={CODE_THEME}
              onChange={(jsx) => setCode((current) => withCodePreview(current, jsx))}
            />
          )}
        </div>
      </PlaygroundProvider>
    </div>
  );
}
