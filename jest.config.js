module.exports = {
  verbose: true,
  // Clear mocks and instances between tests
  clearMocks: true,
  // Automatically restore mock state between every test
  restoreMocks: true,
  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js}", "!index.js", "!src/**/*.mock.{js}"],
  coverageReporters: ["json", "text", "html"],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
