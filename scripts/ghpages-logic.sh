#!/bin/bash

git config user.name "Travis CI"
git config user.email "adam.mulligan@vizzuality.com"

echo "Fetching existing gh-pages branch"
git remote add upstream "https://${GH_TOKEN}@${GH_REF}"
git fetch upstream
git checkout gh-pages

echo "Rebasing"
git rebase develop

echo "Installing dependencies"
grunt dist

git add -f js/*
git add -f css/main.css

CHANGED=$(git diff-index --name-only HEAD --)
if [ -n "$CHANGED" ]; then
  echo "Commiting dependecies deltas"
  git commit -m 'Automatic Travis Build - Dependency update'
else
  echo "No dependency changes detected"
fi
