#!/bin/bash
set -e

git fetch

exists=`git show-ref refs/heads/gh-pages`
if [ -n "$exists" ]; then
  git branch -D gh-pages
fi
git checkout -b gh-pages

git rebase develop

git config user.name "Travis CI"
git config user.email "adam.mulligan@vizzuality.com"

grunt dist

git add -f js/bundle.js
git add -f js/countries_bundle.js
git add -f js/compare_bundle.js
git add -f js/indicators_bundle.js
git add -f js/welcome_bundle.js
git commit -m 'Automatic Travis Build'

git push --force --quiet origin gh-pages:gh-pages

git checkout -
