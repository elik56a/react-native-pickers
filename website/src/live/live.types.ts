/** A value a live example's prop control can set: a string attribute, or a boolean one (`prop` / `prop={false}`). */
export type LiveOption = string | boolean;

/** A prop the side panel offers for any example that renders one of `components`. */
export interface LiveControl {
  prop: string;
  options: readonly LiveOption[];
  /** The components' own default, shown while the code doesn't set the prop */
  default: LiveOption;
  components: readonly string[];
  /** Offered only when the code matches, e.g. `clearable` needs an `onClear` to reset the value */
  requires?: RegExp;
}

/** An opening JSX tag: `start` at `<`, `attributes` from after the name to `end`, just past `>`. */
export interface JsxTag {
  attributes: number;
  end: number;
}

/** Project files by path, as text. */
export type ProjectFiles = Record<string, string>;
