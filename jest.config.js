module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json', diagnostics: { ignoreCodes: [151001] } }] },
  moduleNameMapper: { '^react-native$': '<rootDir>/scripts/rn-stub.js' },
};
