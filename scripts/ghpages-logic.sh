#!/bin/bash

git config user.name "Travis CI"
git config user.email "adam.mulligan@vizzuality.com"

echo "Fetching existing gh-pages branch"
git remote add upstream "https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git"
git fetch upstream
git checkout -b gh-pages upstream/gh-pages

echo "Rebasing"
git rebase develop

echo "Installing dependencies"
grunt dist

git add -f js/*
git add -f css/main.css

CHANGED=$(git diff-index --name-only HEAD --)
if [ -n "$CHANGED" ]; then
  echo "Committing dependencies deltas"
  git commit -m 'Automatic Travis Build - Dependency update'
else
  echo "No dependency changes detected"
fi

echo "Pushing to gh-pages branch"
git push --force --quiet origin gh-pages:gh-pages
