module.exports = {
  // TypeScript and JavaScript files - Allow warnings, only fail on errors
  '*.{ts,js}': [
    'eslint --fix --max-warnings 1000',
    'prettier --write',
    'git add',
  ],

  // JSON files
  '*.json': ['prettier --write', 'git add'],

  // Markdown files
  '*.md': ['prettier --write', 'git add'],

  // YAML files
  '*.{yml,yaml}': ['prettier --write', 'git add'],

  // Prisma schema files
  '*.prisma': ['prettier --write', 'git add'],

  // Package.json files
  'package.json': ['prettier --write', 'git add'],
};
