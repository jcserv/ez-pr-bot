module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "simple-import-sort", "prettier"],
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
  ignorePatterns: [
    "bin/**",
    ".build/**",
    ".serverless/**",
    ".warmup/**",
    "coverage/**",
    "webpack.config.js",
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    camelcase: "off",
    semi: ["error", "always"],
    "@typescript-eslint/no-explicit-any": "off",
    "no-console": "error",
    "prettier/prettier": ["error"],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
};
