module.exports = {
  extends: ['../../.eslintrc.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['src/__tests__/**/*'],
  rules: {
    // Service-specific rules can be added here
  },
};