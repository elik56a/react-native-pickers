import type { ElementType, ReactNode } from 'react';

import type { ValueOf } from '../home/home.types';
import type { PLAYGROUND } from './catalog.constants';

export type PlaygroundKey = ValueOf<typeof PLAYGROUND>;

export type PlaygroundOption = string | number | boolean | readonly string[];

export type PlaygroundSelection = Record<string, PlaygroundOption>;

export interface PlaygroundControl {
  prop: string;
  options: readonly PlaygroundOption[];
  /** The component's own default, left out of the code. `null` when it has none of these (always shown). Defaults to the first option. */
  default?: PlaygroundOption | null;
  /** The option selected at first. Defaults to `default`, then the first option. */
  initial?: PlaygroundOption;
  /** An option that leaves the prop out, so the component picks (e.g. 'auto': the design's default). Make it the first option. */
  unset?: string;
}

export interface PlaygroundConfig {
  /** A desktop-wide preview on the Web tab, for a picker that spreads out there (DateTimePicker's time beside its calendar). */
  wide?: boolean;
  /** Shows the iOS / Android / Web switch. Off for a component that looks and works the same everywhere, like the wheels. */
  platforms?: boolean;
  /** Component name used in the generated code. */
  name: string;
  component: ElementType;
  controls: readonly PlaygroundControl[];
  /** Props that never change, passed as-is. */
  props?: Record<string, unknown>;
  /** The fixed attributes as they should read in the code, e.g. `items={sizes} value={size} onChange={setSize}`. */
  code?: string;
  /** Makes the demo controlled. A function of the selection is re-run when a control changes (e.g. `mode` changes the value's type). */
  value?: unknown;
  /** The callback that receives the new value. */
  changeProp?: string;
  /** A callback that resets the value, e.g. `onClear`. */
  resetProp?: string;
  /** Renders a button that opens the component, which gets `visible` and `onClose`. */
  opener?: string;
  children?: ReactNode;
}

/** A component page in the docs sidebar and the example app's drawer. */
export interface CatalogPage {
  /** The docs page id, e.g. `components/date-picker` */
  doc: string;
  label: string;
  playgrounds: readonly PlaygroundKey[];
  /** Pages nested under this one, like date ranges under DatePicker */
  pages?: readonly CatalogPage[];
}

export interface CatalogGroup {
  label: string;
  pages: readonly CatalogPage[];
}

export type CatalogEntry = CatalogGroup | CatalogPage;
