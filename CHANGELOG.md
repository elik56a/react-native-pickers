# Changelog

## [0.13.0](https://github.com/elik56a/react-native-pickers/compare/v0.12.0...v0.13.0) (2026-10-28)


### ⚠ BREAKING CHANGES

* **emoji:** on iOS and Android the emoji category bar moves to the bottom. Set categoryBarPosition="top" to keep it on top.

### ✨ Features

* **emoji:** follow the iOS, Material and web designs in EmojiPicker and search fields ([#33](https://github.com/elik56a/react-native-pickers/issues/33)) ([7986db8](https://github.com/elik56a/react-native-pickers/commit/7986db8e8b9e4749d34d5e167fd1082c6ba1b442))

## [0.12.0](https://github.com/elik56a/react-native-pickers/compare/v0.11.1...v0.12.0) (2026-10-28)


### ✨ Features

* **list:** place HorizontalList icons on any side, colored like their label ([#31](https://github.com/elik56a/react-native-pickers/issues/31)) ([1217b1e](https://github.com/elik56a/react-native-pickers/commit/1217b1eed1e611147f3e8db3b664deb6c318f44b))

## [0.11.1](https://github.com/elik56a/react-native-pickers/compare/v0.11.0...v0.11.1) (2026-10-28)


### 🐛 Bug Fixes

* **date:** reset the draft when the mode changes while the sheet is closed ([#26](https://github.com/elik56a/react-native-pickers/issues/26)) ([62e5e0e](https://github.com/elik56a/react-native-pickers/commit/62e5e0eb2f266735c9051423355952b57c64ac5f))

## [0.11.0](https://github.com/elik56a/react-native-pickers/compare/v0.10.0...v0.11.0) (2026-10-28)


### ⚠ BREAKING CHANGES

* Android and web apps get the Material and web designs by default. Set `<PickersProvider design="ios">` to keep the previous look everywhere.

### ✨ Features

* give each platform its own design: iOS, Material or web ([#24](https://github.com/elik56a/react-native-pickers/issues/24)) ([850ff9f](https://github.com/elik56a/react-native-pickers/commit/850ff9f74682734d2f9ef7ac99b45a4361e169cf))

## [0.10.0](https://github.com/elik56a/react-native-pickers/compare/v0.9.0...v0.10.0) (2026-10-27)


### ✨ Features

* **core:** add a platform prop to PickersProvider to preview iOS or Android behavior ([601c14d](https://github.com/elik56a/react-native-pickers/commit/601c14d9fa301a26bc8bd99f9a787657c1fa8edb))
* **list:** add HorizontalList, a segmented control or chips that scroll sideways ([601c14d](https://github.com/elik56a/react-native-pickers/commit/601c14d9fa301a26bc8bd99f9a787657c1fa8edb))
* **select:** search a server with loadOptions, and show a loader while options load ([601c14d](https://github.com/elik56a/react-native-pickers/commit/601c14d9fa301a26bc8bd99f9a787657c1fa8edb))

## [0.9.0](https://github.com/elik56a/react-native-pickers/compare/v0.8.0...v0.9.0) (2026-10-27)


### ✨ Features

* **sheet:** open picker fields in a dropdown on the web, and redesign the docs playground ([#20](https://github.com/elik56a/react-native-pickers/issues/20)) ([3f0c841](https://github.com/elik56a/react-native-pickers/commit/3f0c841030d37fbc54ac4adb70433dedd9525fd2))

## [0.8.0](https://github.com/elik56a/react-native-pickers/compare/v0.7.0...v0.8.0) (2026-10-26)


### ✨ Features

* **calendar:** add ranges mode for selecting multiple date ranges ([7dc2731](https://github.com/elik56a/react-native-pickers/commit/7dc2731b35fa0c01346b95a34a4b3117c948abf6))

## [0.7.0](https://github.com/elik56a/react-native-pickers/compare/v0.6.0...v0.7.0) (2026-10-26)


### ✨ Features

* add picker fields that open a sheet from a form field ([21b28c9](https://github.com/elik56a/react-native-pickers/commit/21b28c9726ae4173475721c130079538ad31f4da))

## [0.6.0](https://github.com/elik56a/react-native-pickers/compare/v0.5.0...v0.6.0) (2026-10-26)


### ✨ Features

* **core:** add Locale type for locale props ([0819580](https://github.com/elik56a/react-native-pickers/commit/0819580467e4d747eb8ba9ba816b8e7f2b212e49))

## [0.5.0](https://github.com/elik56a/react-native-pickers/compare/v0.4.1...v0.5.0) (2026-10-26)


### ✨ Features

* add per-feature subpath exports and ship llms-full.txt in the package ([c42928b](https://github.com/elik56a/react-native-pickers/commit/c42928b85ee37124afdc5db4a219701a5070edbf))

## [0.4.1](https://github.com/elik56a/react-native-pickers/compare/v0.4.0...v0.4.1) (2026-10-26)


### 🐛 Bug Fixes

* **time:** time sheets confirm the time shown on the wheels ([#7](https://github.com/elik56a/react-native-pickers/issues/7)) ([1757a47](https://github.com/elik56a/react-native-pickers/commit/1757a47966cdfbc8f7d2b5765bd2184388b632db))

## [0.4.0](https://github.com/elik56a/react-native-pickers/compare/v0.3.0...v0.4.0) (2026-10-26)


### ✨ Features

* **datetime:** add DateTimePicker and DateTimePickerSheet ([a2dfe27](https://github.com/elik56a/react-native-pickers/commit/a2dfe272cb11401a3657f65d65fe0374dc2da171))

## [0.3.0](https://github.com/elik56a/react-native-pickers/compare/v0.2.0...v0.3.0) (2026-10-25)

### ✨ Features

* every picker comes inline, as a bottom sheet, a centered modal or a dropdown via `presentation` ([#2](https://github.com/elik56a/react-native-pickers/issues/2)) ([f6484f9](https://github.com/elik56a/react-native-pickers/commit/f6484f9))
* hover tint and press ripple on everything pressable ([a853cce](https://github.com/elik56a/react-native-pickers/commit/a853cce))
* shared animation helpers, instant select and search hover ([dbb57cf](https://github.com/elik56a/react-native-pickers/commit/dbb57cf))
* **select:** drawn chevron that rotates on open, `renderChevron` prop ([ac055ce](https://github.com/elik56a/react-native-pickers/commit/ac055ce))
* **select:** type in the field to filter a dropdown ([3738de8](https://github.com/elik56a/react-native-pickers/commit/3738de8))
* **sheet:** drag or wheel the bottom sheet to full screen ([f5b5edb](https://github.com/elik56a/react-native-pickers/commit/f5b5edb))

### 🐛 Bug Fixes

* **sheet:** give `useSheetResize` an explicit return type ([c3b984e](https://github.com/elik56a/react-native-pickers/commit/c3b984e))
* **sheet:** the handle always drags, also on the web ([88d9926](https://github.com/elik56a/react-native-pickers/commit/88d9926))

## [0.2.0](https://github.com/elik56a/react-native-pickers/compare/v0.1.1...v0.2.0) (2026-10-25)

### ✨ Features

* "Dial" palette for the default theme ([bef2275](https://github.com/elik56a/react-native-pickers/commit/bef2275))

## [0.1.1](https://github.com/elik56a/react-native-pickers/compare/v0.1.0...v0.1.1) (2026-10-25)

### ✨ Features

* **wheel:** tap-to-type keyboard input on `WheelPicker` ([823d667](https://github.com/elik56a/react-native-pickers/commit/823d667))

### 🐛 Bug Fixes

* **calendar:** year grid ([3abbbc8](https://github.com/elik56a/react-native-pickers/commit/3abbbc8))
* **select:** `SelectPicker` setter typing ([3abbbc8](https://github.com/elik56a/react-native-pickers/commit/3abbbc8))
* **wheel:** looping wheels rendered blank on iOS until touched ([cc81f4a](https://github.com/elik56a/react-native-pickers/commit/cc81f4a))
* silence the nested-list warning ([823d667](https://github.com/elik56a/react-native-pickers/commit/823d667))

## 0.1.0 (2026-10-25)

### ✨ Features

* wheel, time, date, select and emoji pickers ([e8084c2](https://github.com/elik56a/react-native-pickers/commit/e8084c2))
