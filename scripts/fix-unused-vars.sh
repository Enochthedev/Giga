#!/bin/bash

echo "🔧 Fixing unused variables..."

# Get files with unused variable errors
files=$(npm run lint 2>&1 | grep "is assigned a value but never used" | grep -o "/[^:]*\.ts" | sort | uniq)

for file in $files; do
    if [ -f "$file" ]; then
        echo "Fixing unused variables in: $file"
        
        # Remove unused variable assignments or comment them out
        # For _key variables, we can remove the assignment
        sed -i '' '/const _key = /d' "$file"
        
        # For _sessionData, _stats, _totalErrors - comment them out
        sed -i '' 's/const _sessionData = /\/\/ const _sessionData = /g' "$file"
        sed -i '' 's/const _stats = /\/\/ const _stats = /g' "$file"
        sed -i '' 's/const _totalErrors = /\/\/ const _totalErrors = /g' "$file"
        
        # For unused parameters, we can use void to indicate they're intentionally unused
        sed -i '' 's/const _\([a-zA-Z][a-zA-Z0-9]*\) = /void(/g' "$file"
    fi
done

echo "✅ Fixed unused variables!"

# Check remaining errors
error_count=$(npm run lint 2>&1 | grep "error" | wc -l | tr -d ' ')
echo "Remaining errors: $error_count"