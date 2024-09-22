module.exports = {
    verbose: true,
    // Clear mocks and instances between tests
    clearMocks: true,
    // Automatically restore mock state between every test
    restoreMocks: true,
    forceExit: true,
    // Coverage configuration
    collectCoverage: true,
    collectCoverageFrom: [
        './src/**',
        '!./src/config/**',
        '!./src/database/transactions/**',
    ],
    coverageReporters: ['json', 'text', 'html'],
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },
}
