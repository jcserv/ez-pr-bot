module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: "src/.*\\.(test|spec)?\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  coveragePathIgnorePatterns: [
    "src/app.ts",
    "src/cmd/index.ts",
    "src/errors/markdown.ts",
    "src/ezpr/index.ts",
    "src/help/index.ts",
    "src/types/index.ts",
    "src/metrics",
    "src/logger.ts",
    "src/constants.ts",
  ],
  coverageThreshold: {
    global: {
      statements: 72.2,
      branches: 60.62,
      lines: 72.3,
      functions: 62.5,
    },
  },
};
