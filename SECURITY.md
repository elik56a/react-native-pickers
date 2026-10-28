# Security policy

## Supported versions

Fixes land on the latest release only. Upgrade to the newest version before reporting.

## Reporting a vulnerability

Please don't open a public issue. Report it privately through [GitHub's private vulnerability reporting](https://github.com/elik56a/react-native-pickers/security/advisories/new) instead.

Include the version, the platform (iOS, Android or web) and a minimal reproduction. You'll get an answer within 7 days. Once a fix is released, the advisory is published with credit to you, unless you'd rather stay anonymous.

## Scope

The package is pure JavaScript with no runtime dependencies and no network access of its own. The most likely issues are in how it renders data you pass to it. The docs site (`website/`) and the example app (`example/`) are not published to npm, but reports about them are welcome too.
