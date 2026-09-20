#!/bin/bash

# TRC Staff Journey - GitHub Setup Script
# This script helps set up GitHub + Azure deployment

set -e

echo "🚀 TRC Staff Journey - GitHub Setup"
echo "===================================="

# Check if git is configured
if [ -z "$(git config user.name)" ]; then
    echo "❌ Git not configured. Please run:"
    echo "   git config --global user.name 'Your Name'"
    echo "   git config --global user.email 'your@email.com'"
    exit 1
fi

echo "✅ Git configured as: $(git config user.name)"

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username required"
    exit 1
fi

echo ""
echo "📦 Setting up GitHub remote..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/$GITHUB_USERNAME/trc-staff-journey.git

echo "✅ Remote added: $(git remote -v | head -1)"

echo ""
echo "📤 Pushing code to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to: https://github.com/$GITHUB_USERNAME/trc-staff-journey/settings/secrets/actions"
echo "2. Add the following secrets:"
echo "   - AZURE_CREDENTIALS (from Azure CLI)"
echo "   - AZURE_API_URL (your API endpoint)"
echo "   - AZURE_STATIC_WEB_APPS_TOKEN"
echo "   - DATABASE_CONNECTION_STRING"
echo ""
echo "3. Read GITHUB_SETUP.md for detailed instructions"
echo "4. Push a change to trigger first deployment"
echo ""
echo "🎉 All set! Happy deploying!"
