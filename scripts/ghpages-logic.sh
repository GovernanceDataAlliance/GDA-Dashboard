#!/bin/bash

git config user.name "Travis CI"
git config user.email "${GH_USER}"

if [ -z ${GH_TOKEN+x} ]; then
  git remote add origin "https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git"
else
  echo "Removing local gh-pages branch"
  git branch -D gh-pages
fi

echo "Fetching existing gh-pages branch"
git fetch origin
git checkout -b gh-pages origin/gh-pages

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
