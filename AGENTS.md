# AGENTS.md

Guidance for AI coding agents working in this repository. To *use* the library in an app, read the API docs instead: [llms-full.txt](https://react-native-pickers.dev/llms-full.txt).

## Project

`@elik56a/react-native-pickers`: pure-JavaScript wheel, time, date, date-time, select and emoji pickers plus bottom sheets for React Native, Expo and React Native Web. **No native code and no runtime dependencies**: only React Native core APIs (`Animated` with the native driver, `PanResponder`, `FlatList`, `Modal`). Don't add a dependency or native module.

pnpm workspace:

- `src/`: the library
- `example/`: Expo app that renders the library source
- `website/`: Docusaurus docs with live examples that run the library source

## Concept: per-platform, design-driven

Every component looks native in each design (`'ios'`, `'material'`, `'web'`), which follows the platform unless the `design` prop or `PickersProvider` picks one. Before building or restyling a component, look at how that platform's own apps do it (iOS Calendar and Clock, Google Calendar and Material 3 specs, the web's Google Calendar and native inputs) and give each design that platform's pattern, not one generic look for all three. A design-neutral control is the exception, used only when no platform has its own pattern.

## Commands

| Command | Use |
|---|---|
| `pnpm install` | Install everything, including the git hooks |
| `pnpm test` | Jest + React Native Testing Library |
| `pnpm lint` | Biome: lint, format and import order |
| `pnpm format` | Autofix lint and formatting |
| `pnpm typecheck` | TypeScript, including tests |
| `pnpm build` | Compile to `lib/` |
| `pnpm docs` | Docs site at `localhost:3001` |
| `pnpm web` | Example app in the browser |

Run `pnpm lint && pnpm typecheck && pnpm test` before you finish.

## Structure

Each feature has a folder under `src/` (`wheel`, `time`, `calendar`, `date`, `datetime`, `select`, `emoji`) built on `sheet` (bottom sheets) and `core` (theme, shared hooks and utils). Imports flow one way: feature → `sheet` → `core`.

Every feature folder has the same layout:

- `<Component>.tsx` and `components/`: render only, no inline logic
- `hooks/`: state and event handling
- `<feature>.utils.ts`: pure logic, with `<feature>.utils.test.ts` next to it
- `<feature>.types.ts`, `<feature>.constants.ts`, `<feature>.styles.ts`
- `index.ts`: the folder's public API, also published as the `@elik56a/react-native-pickers/<folder>` subpath, so renaming a folder is a breaking change

## Code style

- Arrow functions everywhere: `export const fn = () =>`, not `export function`. Generic components in `.tsx` need `<T,>`.
- A returned object with two or more properties goes one property per line. A Biome plugin enforces this, and `pnpm format` fixes it.
- Three import blocks separated by a blank line: React and React Native, other packages, then our own code.
- Tests sit next to the file they test. New utils and hooks come with tests.
- Dates are local time. Compare and serialize calendar days with `toDateKey`, never `toISOString()`.
- `onChange` fires for user changes only. Changing `value` programmatically must not call it.

## Components

- Resolve the theme with `const { theme, themeOverride } = useComponentTheme(theme, design)`. Draw with `theme`, and pass `themeOverride` to child pickers and sheets.
- Draw text with `PickerText` (`size`, `weight` and a theme `color`), not `<Text style={textStyle(...)}>`. Only TextInputs and animated text call `textStyle` directly.
- Before writing a style, setup or handler, look for one that already exists: `useDayCalendar` sets up a calendar, `getFieldBoxStyle` draws a field's box, and `adjustableProps` handles a stepper's keys and screen-reader actions. If two components need the same code, move it into a util or hook.
- In JSX, `cond && <X/>` only when `cond` is a boolean. A `''` or `0` renders as raw text, which crashes native, so keep the ternary for strings and numbers. Also keep it when the receiving component checks the value with `??` or `!= null`, as `FieldTrigger` does with `children`.
- A `renderX` prop goes inside the default component as an early return (`if (renderX) return renderX(info)`), not as a ternary at the call site.
- Change code for readability only if the result reads easier. If the cleaner version needs a new abstraction, props passed through extra layers, or a file the reader has to jump to, keep the original.

## Docs stay in sync

When a change affects what users see or call (a new component, prop, default, behavior or design), update in the same PR:

- `website/docs/components/<page>.mdx`: the prose, a live example and the props table. New pages and their prop playgrounds go in `website/src/catalog/`, which builds the docs sidebar, each page's playground and the example app's drawer.
- `website/docs/api/reference.mdx` for new exports, and every guide or recipe that mentions what changed (`guides/designs.mdx`, `guides/theming.mdx`, `guides/platforms.mdx`…).
- `website/docs/resources/ai.mdx`: the cheat sheet AI assistants read. `llms.txt` and `llms-full.txt` are generated from the docs, so they follow.
- `README.md`.
- Home page: `website/src/home/home.constants.ts` (component grid, comparison table, anatomy examples, stats), `website/src/home/hero/hero.constants.ts` (the hero's words and each word's per-platform patterns), `website/src/home/faq.constants.tsx`, and `website/src/home/playground/playground.constants.ts` if a picker the playground shows changes.
- SEO: the `description` front matter of each page you touched, `DESCRIPTION` and the keywords in `website/docusaurus.config.ts`, `description` and `keywords` in `package.json`, and `context7.json`.

Claude Code runs `.claude/hooks/docs-check.sh` before it finishes, as a reminder of this list.

## Commits and releases

- Use Conventional Commits (`feat(select): …`, `fix(time): …`, `docs: …`). PRs are squash-merged, so the PR title becomes the commit on `master`.
- Don't bump `version` or edit `CHANGELOG.md`. release-please does both in its release PR.
- `/docs` on the site is built from the latest release tag. Doc edits show under `/docs/next` until the next release.
