module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: ".*\\.(test|spec)?\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      statements: 72.91,
      branches: 52.41,
      lines: 72.48,
      functions: 53.76,
    },
  },
};
