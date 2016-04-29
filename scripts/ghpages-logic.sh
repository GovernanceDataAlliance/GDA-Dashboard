#!/bin/bash

git config user.name "Travis CI"
git config user.email "adam.mulligan@vizzuality.com"

git fetch
git checkout gh-pages

git rebase develop

grunt dist

git add -f js/*
git add -f css/main.css

CHANGED=$(git diff-index --name-only HEAD --)
if [ -n "$CHANGED" ]; then
  git commit -m 'Automatic Travis Build - Dependency update'
fi
