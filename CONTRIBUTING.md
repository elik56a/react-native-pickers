# Contributing

Thanks for helping out! The full guide, with the project structure and every script, is on the docs site: **[Contributing](https://elik56a.github.io/react-native-pickers/docs/resources/contributing)**.

## Quick start

```sh
git clone https://github.com/elik56a/react-native-pickers.git
cd react-native-pickers
pnpm install   # also installs the git hooks
pnpm web       # example app in the browser (or pnpm ios / pnpm android)
pnpm docs      # docs site at localhost:3001
```

Before opening a pull request, run `pnpm lint && pnpm typecheck && pnpm test`. CI runs the same checks.

## Pull requests

- Pull requests are squash-merged, so the **PR title** becomes the commit message on `master`. It must be a [Conventional Commit](https://www.conventionalcommits.org): `fix(select): …`, `feat(date): …`, `docs: …`.
- `fix:` and `feat:` titles end up in the changelog and trigger a release. `docs:`, `refactor:`, `test:`, `ci:` and `chore:` don't.
- New logic comes with a unit test next to it.

## Releases

You don't need to bump versions or edit `CHANGELOG.md`. [release-please](https://github.com/googleapis/release-please) does both in a release PR, and merging that PR publishes to npm.

## Bugs and ideas

Open an [issue](https://github.com/elik56a/react-native-pickers/issues) with the platform (iOS, Android, web), React Native or Expo version, and a minimal example.
