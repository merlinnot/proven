/**
 * @typedef {import('ts-jest')}
 * @type {import('@jest/types').Config.InitialOptions}
 */
export default {
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageProvider: 'v8',
  coverageReporters: ['lcov', 'text', 'text-summary'],
  globals: {
    'ts-jest': {
      diagnostics: false,
      experimentalEsm: true,
      isolatedModules: true,
    },
  },
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
};
