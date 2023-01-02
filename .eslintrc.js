module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["standard", "prettier"],
  ignorePatterns: ["bin/**"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {},
};
