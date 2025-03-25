export default {
  rootDir: '.',
  resetModules: true,
  clearMocks: true,
  silent: false,
  watchPathIgnorePatterns: ['globalConfig'],
  testMatch: ['**/test/**/*.test.js'],
  reporters: ['default', ['github-actions', { silent: false }], 'summary'],
  collectCoverageFrom: ['src/**/*.js'],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.server',
    'index.js'
  ],
  testEnvironment: 'node',
  coverageDirectory: '<rootDir>/coverage',
  verbose: true,
  transform: {}
}
