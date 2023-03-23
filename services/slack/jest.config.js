module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: ".*\\.(test|spec)?\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      statements: 67.36,
      branches: 47.22,
      lines: 66.88,
      functions: 48.11,
    },
  },
};
