import type { ValueOf } from '../home.types';
import type { CONTROLS, DEMO_TAB } from './playground.constants';

export type DemoTab = ValueOf<typeof DEMO_TAB>;

type ControlOf<T extends DemoTab> = (typeof CONTROLS)[T][number];

export type Control = ControlOf<DemoTab>;

export type ControlValue = Control['values'][number];

export type TabOptions<T extends DemoTab> = { -readonly [C in ControlOf<T> as C['key']]: C['values'][number] };

export type PlaygroundOptions = { [T in DemoTab]: TabOptions<T> };

export interface AccentColors {
  primary: string;
  primaryMuted: string;
}

export interface Accent {
  key: string;
  label: string;
  swatch: string;
  /** Undefined keeps the library's own theme. */
  theme?: { light: AccentColors; dark: AccentColors };
}

export interface Playground {
  /** The picker the phone shows open and the props panel edits */
  tab: DemoTab;
  options: PlaygroundOptions;
  accent: Accent;
  selectTab: (tab: DemoTab) => void;
  setOption: (tab: DemoTab, key: string, value: ControlValue) => void;
  setAccent: (accent: Accent) => void;
}
