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
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 69,
      functions: 61,
      lines: 80,
    },
  },
};
