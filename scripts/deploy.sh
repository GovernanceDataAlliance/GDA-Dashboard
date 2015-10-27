#!/bin/bash

git fetch

git branch -D gh-pages
git checkout gh-pages

git rebase develop

npm run build

git add -f js/bundle.js
git commit -m 'Automatic Build'

git push -f origin gh-pages
git checkout -
