module.exports = {
  preset: '@react-native/jest-preset',
  roots: ['<rootDir>/src', '<rootDir>/website/src/live', '<rootDir>/website/src/home', '<rootDir>/website/src/showcase'],
  // The website imports the library by its package name; Docusaurus aliases it to the source, so Jest does too.
  moduleNameMapper: { '^@elik56a/react-native-pickers$': '<rootDir>/src/index.ts' },
  // pnpm nests packages under node_modules/.pnpm/<id>/node_modules, which the preset's default pattern doesn't expect.
  transformIgnorePatterns: ['node_modules/(?!(\\.pnpm/[^/]+/node_modules/)?((jest-)?react-native|@react-native(-community)?)/)'],
  // A file's first test also pays for loading React Native, which can pass 5s on a busy CI runner.
  testTimeout: 30000,
};
