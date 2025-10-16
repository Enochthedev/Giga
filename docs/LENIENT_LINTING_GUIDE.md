# Lenient Linting Configuration Guide

## Overview

Our linting setup is configured to be development-friendly while maintaining code quality. The
configuration allows warnings but prevents critical errors from being committed.

## Philosophy: Warn but Don't Block

### ✅ What Gets Blocked (Critical Errors)

- **TypeScript compilation errors** - Code that won't run
- **Syntax errors** - Broken JavaScript/TypeScript
- **Import/export errors** - Missing dependencies
- **Type check failures** - Critical type mismatches

### ⚠️ What Shows Warnings (But Allows Commits)

- **Unused variables** - Shows warning but doesn't block
- **`any` type usage** - Warns but allows for rapid prototyping
- **Function complexity** - Warns when functions get too complex (limit: 15)
- **Import ordering** - Suggests better organization
- **Security patterns** - Warns about potential issues
- **Code style** - Suggests improvements

## Available Commands

```bash
# Development linting (allows up to 2000 warnings)
pnpm lint

# Check linting without fixing
pnpm lint:check

# Strict linting (zero warnings allowed - for releases)
pnpm lint:strict

# Format code
pnpm format

# Check formatting
pnpm format:check

# Type checking
pnpm type-check
```

## Git Hooks Behavior

### Pre-commit Hook

- Runs `lint-staged` on changed files
- Allows up to 1000 warnings per batch
- Formats code automatically
- Only blocks on critical errors

### Pre-push Hook

- Runs project-wide linting with 2000 warning limit
- Shows warning messages but continues push
- Runs type checking (blocks on type errors)
- Skips tests to speed up workflow

## Configuration Details

### ESLint Rules Changed to Warnings

- `no-unused-vars` → `warn`
- `@typescript-eslint/no-unused-vars` → `warn`
- `import/order` → `warn`
- `security/detect-unsafe-regex` → `warn`
- `prefer-const` → `warn`
- `no-return-await` → `warn`
- `require-await` → `warn`

### Increased Limits

- **Complexity**: 10 → 15 (more realistic for business logic)
- **Max depth**: 4 → 6 (allows more nested logic)
- **Max params**: 5 → 7 (accommodates complex functions)
- **Line length**: 100 → 120 characters

## When to Use Strict Mode

Use `pnpm lint:strict` before:

- **Production releases**
- **Code reviews**
- **Major feature completion**
- **Refactoring sessions**

## Bypassing Hooks (Emergency Only)

If you absolutely need to bypass hooks:

```bash
# Skip pre-commit hook
git commit --no-verify -m "emergency fix"

# Skip pre-push hook
git push --no-verify origin main
```

## Benefits

### For Development

- **Faster iteration** - No blocked commits for minor issues
- **Better focus** - See warnings but stay in flow
- **Gradual improvement** - Address warnings when convenient
- **Team friendly** - Less friction for different coding styles

### For Code Quality

- **Critical errors still blocked** - Code must compile and run
- **Visibility of issues** - Warnings guide improvement
- **Flexible enforcement** - Strict mode available when needed
- **Consistent formatting** - Prettier still enforces style

## Best Practices

1. **Address critical errors immediately** - Don't let them accumulate
2. **Review warnings periodically** - Use `pnpm lint:strict` weekly
3. **Use meaningful names** - Reduces unused variable warnings
4. **Prefix unused params with `_`** - `_req`, `_res`, etc.
5. **Keep functions focused** - Reduces complexity warnings
6. **Run strict mode before releases** - Ensure clean production code

## Team Workflow

### Daily Development

```bash
# Start work
git pull origin main
pnpm install

# During development - warnings visible but don't block
git add .
git commit -m "feature: add new functionality"
git push origin feature-branch

# Warnings show but commits/pushes succeed
```

### Weekly Cleanup

```bash
# Review all issues
pnpm lint:strict

# Fix high-priority warnings
# Refactor complex functions
# Clean up unused code
```

### Pre-Release

```bash
# Ensure zero warnings
pnpm lint:strict
pnpm format
pnpm type-check
pnpm test

# All must pass before release
```

This configuration balances development velocity with code quality, allowing teams to move fast
while maintaining reasonable standards.
