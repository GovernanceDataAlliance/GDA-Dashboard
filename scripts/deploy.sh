#!/bin/bash
set -e

git fetch

git checkout develop

exists=`git show-ref refs/heads/gh-pages`
if [ -n "$exists" ]; then
  git branch -D gh-pages
fi
git checkout -b gh-pages

git rebase develop

ORIGINAL_NAME="$(git config user.name)"
ORIGINAL_EMAIL="$(git config user.email)"

git config user.name "Travis CI"
git config user.email "adam.mulligan@vizzuality.com"

grunt dist

git add -f js/countries_bundle.js
git add -f js/blog_bundle.js
git add -f js/compare_bundle.js
git add -f js/indicators_bundle.js
git add -f js/welcome_bundle.js
git add -f js/about_bundle.js
git add -f css/main.css

git commit -m 'Automatic Travis Build'

git push --force --quiet origin gh-pages:gh-pages

git config user.name $ORIGINAL_NAME
git config user.email $ORIGINAL_EMAIL

git checkout develop
