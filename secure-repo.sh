#!/bin/bash

# Script to secure a Git repository by removing sensitive files

echo "🔒 Securing repository: $(pwd)"

# Files to check for and remove
SENSITIVE_FILES=(".env" ".env.local" ".env.production" "credentials.json" "secrets.json")

# Check if .gitignore exists
if [ ! -f .gitignore ]; then
    echo "Creating .gitignore..."
    touch .gitignore
fi

# Check each sensitive file
for file in "${SENSITIVE_FILES[@]}"; do
    # Check if file exists and is tracked
    if git ls-files --error-unmatch "$file" > /dev/null 2>&1; then
        echo "⚠️  Found tracked sensitive file: $file"
        read -p "Remove $file from git? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git rm --cached "$file"
            echo "✅ Removed $file from git tracking"
            
            # Add to .gitignore if not already there
            if ! grep -q "^$file$" .gitignore; then
                echo "$file" >> .gitignore
                echo "✅ Added $file to .gitignore"
            fi
        fi
    fi
done

# Check for common secrets in tracked files
echo ""
echo "🔍 Checking for common secrets in tracked files..."
if git grep -q "password.*=.*[a-zA-Z0-9]" --ignore-case; then
    echo "⚠️  WARNING: Found 'password=' patterns in tracked files"
    git grep "password.*=" --ignore-case
fi

if git grep -q "api.*key.*=.*[a-zA-Z0-9]" --ignore-case; then
    echo "⚠️  WARNING: Found 'api.*key=' patterns in tracked files"
    git grep "api.*key.*=" --ignore-case
fi

if git grep -q "secret.*=.*[a-zA-Z0-9]" --ignore-case; then
    echo "⚠️  WARNING: Found 'secret=' patterns in tracked files"
    git grep "secret.*=" --ignore-case
fi

echo ""
echo "✅ Repository scan complete!"
echo ""
echo "📝 If you removed files, commit with:"
echo "   git commit -m 'Remove sensitive files for security'"
echo "   git push origin main"

