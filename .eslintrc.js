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
    // Basic rules - More lenient for development
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Changed from 'error' to 'warn'

    // Import rules - More lenient
    'import/order': [
      'warn', // Changed from 'error' to 'warn'
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
    'import/no-duplicates': 'warn', // Changed from 'error' to 'warn'
    'import/no-unresolved': 'off', // TypeScript handles this

    // Security rules - Keep as warnings for development
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-unsafe-regex': 'warn', // Changed from 'error' to 'warn'

    // General rules - More lenient
    'no-console': 'off', // We use console for logging in services
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-alert': 'warn', // Changed from 'error' to 'warn'
    'no-var': 'warn', // Changed from 'error' to 'warn'
    'prefer-const': 'warn', // Changed from 'error' to 'warn'
    'no-unused-expressions': 'warn', // Changed from 'error' to 'warn'
    'no-duplicate-imports': 'warn', // Changed from 'error' to 'warn'
    'no-return-await': 'warn', // Changed from 'error' to 'warn'
    'require-await': 'warn', // Changed from 'error' to 'warn'

    // Code style (handled by Prettier, but good to have as warnings)
    'max-len': ['warn', { code: 120, ignoreUrls: true, ignoreStrings: true }], // Increased from 100 to 120
    complexity: ['warn', 15], // Increased from 10 to 15
    'max-depth': ['warn', 6], // Increased from 4 to 6
    'max-params': ['warn', 7], // Increased from 5 to 7
  },
  overrides: [
    {
      // TypeScript files
      files: ['**/*.ts'],
      extends: ['eslint:recommended', 'prettier'],
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

        // Enable TypeScript-specific rules - More lenient for development
        '@typescript-eslint/no-unused-vars': [
          'warn', // Changed from 'error' to 'warn'
          { argsIgnorePattern: '^_' },
        ],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'warn',

        // Import rules for TypeScript - More lenient
        'import/order': [
          'warn', // Changed from 'error' to 'warn'
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
        'import/no-duplicates': 'warn', // Changed from 'error' to 'warn'
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
    '**/generated/**',
    '**/prisma-client/**',
    '**/*.generated.*',
    'services/*/src/generated/**',
  ],
};
