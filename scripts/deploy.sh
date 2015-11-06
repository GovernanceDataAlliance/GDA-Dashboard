#!/bin/bash

git fetch

git branch -D gh-pages
git checkout -b gh-pages

git rebase develop

grunt dist

git add -f js/bundle.js
git commit -m 'Automatic Build'

git push -f origin gh-pages
git checkout -
