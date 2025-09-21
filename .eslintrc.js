module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['import', 'security', '@typescript-eslint'],
  rules: {
    // Basic rules
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    // Import rules
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'never',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'off', // TypeScript handles this

    // Security rules
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-unsafe-regex': 'error',

    // General rules
    'no-console': 'off', // We use console for logging in services
    'no-debugger': 'error',
    'no-alert': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'no-unused-expressions': 'error',
    'no-duplicate-imports': 'error',
    'no-return-await': 'error',
    'require-await': 'error',

    // Code style (handled by Prettier, but good to have as warnings)
    'max-len': ['warn', { code: 100, ignoreUrls: true, ignoreStrings: true }],
    complexity: ['warn', 10],
    'max-depth': ['warn', 4],
    'max-params': ['warn', 5],
  },
  overrides: [
    {
      // TypeScript files
      files: ['**/*.ts'],
      extends: [
        'eslint:recommended',
        'prettier',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      plugins: ['@typescript-eslint', 'import', 'security'],
      rules: {
        // Disable base ESLint rules that are covered by TypeScript
        'no-unused-vars': 'off',
        'no-undef': 'off',
        'no-redeclare': 'off',
        'no-use-before-define': 'off',

        // Enable TypeScript-specific rules
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'warn',

        // Import rules for TypeScript
        'import/order': [
          'error',
          {
            groups: [
              'builtin',
              'external',
              'internal',
              'parent',
              'sibling',
              'index',
            ],
            'newlines-between': 'never',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
        'import/no-duplicates': 'error',
        'import/no-unresolved': 'off', // TypeScript handles this
      },
    },
    {
      // Test files
      files: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**/*.ts'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        'security/detect-object-injection': 'off',
      },
    },
    {
      // Configuration files
      files: ['*.config.js', '*.config.ts', '.eslintrc.js'],
      rules: {
        'no-undef': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      // Prisma schema files
      files: ['**/prisma/schema.prisma'],
      parser: null,
      rules: {},
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '*.js.map',
    'coverage/',
    '.next/',
    'prisma/migrations/',
    '**/*.d.ts',
  ],
};
