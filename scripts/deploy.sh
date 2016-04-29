#!/bin/bash
set -e

git fetch

git checkout develop

#exists=`git show-ref refs/heads/gh-pages`
#if [ -n "$exists" ]; then
#  git branch -D gh-pages
#fi

ORIGINAL_NAME="$(git config user.name)"
ORIGINAL_EMAIL="$(git config user.email)"

./ghpages-logic.sh

git push --force --quiet origin gh-pages:gh-pages

git config user.name $ORIGINAL_NAME
git config user.email $ORIGINAL_EMAIL

git checkout develop
