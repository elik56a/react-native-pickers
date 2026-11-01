import { useRef, useState } from 'react';

import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import clsx from 'clsx';

import { Device } from '../device/Device';
import { PLATFORM, PLATFORM_LABELS, PLATFORMS } from '../device/device.constants';
import type { Platform } from '../device/device.types';
import { BrowserHeroApp } from '../hero/components/BrowserHeroApp';
import { getWordSpec } from '../hero/hero.utils';
import { useHeroValues } from '../hero/hooks/useHeroValues';
import { ANATOMY_CYCLE_MS, ANATOMY_EXAMPLES, ANATOMY_SIDE, ANATOMY_SLIDE_MS, ANATOMY_SLIDES } from '../home.constants';
import shared from '../home.module.css';
import type { AnatomyCallout } from '../home.types';
import { useAnatomyCycle } from '../hooks/useAnatomyCycle';
import styles from './Anatomy.module.css';

const Callouts = ({ side, callouts }: { side: AnatomyCallout['side']; callouts: AnatomyCallout[] }) => (
  <ul className={clsx(styles.callouts, styles[side])}>
    {callouts
      .filter((c) => c.side === side)
      .map((c, i) => (
        <li key={c.title} className={styles.callout} style={{ '--y': `${c.y}%`, '--i': i } as React.CSSProperties}>
          <span className={styles.text}>
            <strong>{c.title}</strong>
            {c.body}
          </span>
          <span className={styles.line} aria-hidden />
        </li>
      ))}
  </ul>
);

/** Features as a technical drawing: live pickers sliding through a phone like a carousel, with leader lines to what each part gives you for free. */
export const Anatomy = () => {
  const { colorMode } = useColorMode();
  const deviceRef = useRef<HTMLDivElement>(null);
  const [platform, setPlatform] = useState<Platform>(PLATFORM.ios);
  const cycle = useAnatomyCycle(deviceRef, ANATOMY_EXAMPLES.length);
  const { values, set } = useHeroValues();
  const example = ANATOMY_EXAMPLES[cycle.index];
  return (
    <section className={styles.anatomy} aria-labelledby="anatomy-title">
      <div className="container">
        <p className={shared.eyebrow} data-reveal>
          Anatomy
        </p>
        <h2 id="anatomy-title" className={shared.h2} data-reveal>
          One picker, taken apart
        </h2>
        <p className={shared.lead} data-reveal>
          What every component gives you without a line of your own. Each screen is live, so try what the lines point at.
        </p>
        <p className={shared.sectionLink} data-reveal>
          <Link to="/docs/intro">Why this library →</Link>
        </p>
        <div className={clsx(styles.drawing, shared.devices)} data-platform={platform} data-visible={cycle.visible || undefined}>
          <div key={example.word} className={styles.set}>
            <Callouts side={ANATOMY_SIDE.left} callouts={example.callouts} />
            <Callouts side={ANATOMY_SIDE.right} callouts={example.callouts} />
          </div>
          <div ref={deviceRef} className={styles.device}>
            <Device platform={platform} rail={false}>
              {(shown, screenHeight) => (
                <div
                  className={styles.track}
                  data-instant={cycle.instant || undefined}
                  style={{ '--position': cycle.position, '--slide': `${ANATOMY_SLIDE_MS}ms` } as React.CSSProperties}
                >
                  {ANATOMY_SLIDES.map((slide, i) => (
                    <div key={slide.key} className={styles.slide} inert={i !== cycle.position}>
                      <BrowserHeroApp
                        spec={getWordSpec(slide.word)}
                        platform={shown}
                        colorMode={colorMode}
                        values={values}
                        set={set}
                        screenHeight={screenHeight}
                      />
                    </div>
                  ))}
                </div>
              )}
            </Device>
          </div>
          <div
            className={styles.tabs}
            data-running={cycle.running || undefined}
            style={{ '--cycle': `${ANATOMY_CYCLE_MS}ms` } as React.CSSProperties}
          >
            <fieldset className={styles.group}>
              <legend className={shared.srOnly}>Design</legend>
              {PLATFORMS.map((p) => (
                <button key={p} type="button" className={styles.tab} aria-pressed={p === platform} onClick={() => setPlatform(p)}>
                  {PLATFORM_LABELS[p]}
                </button>
              ))}
            </fieldset>
            <span className={styles.divider} aria-hidden />
            {ANATOMY_EXAMPLES.map((e, i) => (
              <button
                key={e.word}
                type="button"
                className={clsx(styles.tab, styles.screenTab)}
                aria-pressed={i === cycle.index}
                onClick={() => cycle.select(i)}
              >
                {getWordSpec(e.word).tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
