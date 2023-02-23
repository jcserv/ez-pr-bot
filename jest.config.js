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
    "src/ezpr/index.ts",
    "src/help/index.ts",
    "src/metrics",
    "src/logger.ts",
    "src/constants.ts",
  ],
  coverageThreshold: {
    global: {
      statements: 81,
      branches: 66,
      functions: 65,
      lines: 81,
    },
  },
};
