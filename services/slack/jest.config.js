module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: ".*\\.(test|spec)?\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      statements: 67.58,
      branches: 47.22,
      lines: 67.1,
      functions: 48.11,
    },
  },
};
