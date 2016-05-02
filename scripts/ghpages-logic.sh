#!/bin/bash

git config user.name "Travis CI"
git config user.email "${GH_USER}"

if [ -z ${GH_TOKEN+x} ]; then
  echo "Removing local gh-pages branch"
  git branch -D gh-pages
else
  echo "Fetching existing gh-pages branch"
  git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"
  git fetch origin --unshallow
fi

echo "Switching to gh-pages branch"
git checkout gh-pages

echo "Rebasing"
git rebase origin/develop

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
git push --force "https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git" gh-pages:gh-pages
