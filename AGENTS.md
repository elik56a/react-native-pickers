# AGENTS.md

Guidance for AI coding agents working in this repository. To *use* the library in an app, read the API docs instead: [llms-full.txt](https://elik56a.github.io/react-native-pickers/llms-full.txt).

## Project

`@elik56a/react-native-pickers`: pure-JavaScript wheel, time, date, date-time, select and emoji pickers plus bottom sheets for React Native, Expo and React Native Web. **No native code and no runtime dependencies**: only React Native core APIs (`Animated` with the native driver, `PanResponder`, `FlatList`, `Modal`). Don't add a dependency or native module.

pnpm workspace:

- `src/`: the library
- `example/`: Expo app that renders the library source
- `website/`: Docusaurus docs with live examples that run the library source

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
- `index.ts`: the folder's public API

## Code style

- Arrow functions everywhere: `export const fn = () =>`, not `export function`. Generic components in `.tsx` need `<T,>`.
- A returned object with two or more properties goes one property per line. A Biome plugin enforces this, and `pnpm format` fixes it.
- Three import blocks separated by a blank line: React and React Native, other packages, then our own code.
- Tests sit next to the file they test. New utils and hooks come with tests.
- Dates are local time. Compare and serialize calendar days with `toDateKey`, never `toISOString()`.
- `onChange` fires for user changes only. Changing `value` programmatically must not call it.

## Commits and releases

- Use Conventional Commits (`feat(select): …`, `fix(time): …`, `docs: …`). PRs are squash-merged, so the PR title becomes the commit on `master`.
- Don't bump `version` or edit `CHANGELOG.md`. release-please does both in its release PR.
- `/docs` on the site is built from the latest release tag. Doc edits show under `/docs/next` until the next release.
