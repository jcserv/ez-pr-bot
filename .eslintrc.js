module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    "standard",
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  ignorePatterns: ["bin/**"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    camelcase: "off",
    semi: ["error", "always"],
    "@typescript-eslint/no-explicit-any": "off"
  },
};
