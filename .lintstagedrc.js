module.exports = {
  // TypeScript and JavaScript files - Allow warnings, only fail on errors
  '*.{ts,js}': ['eslint --fix --max-warnings 1000', 'prettier --write'],

  // JSON files
  '*.json': ['prettier --write'],

  // Markdown files
  '*.md': ['prettier --write'],

  // YAML files
  '*.{yml,yaml}': ['prettier --write'],

  // Prisma schema files
  '*.prisma': ['prettier --write'],

  // Package.json files
  'package.json': ['prettier --write'],
};
