#!/bin/bash

git fetch
git checkout gh-pages

git rebase develop

npm run build

git add -f js/bundle.js
git commit -m 'Automatic Build'

git push origin gh-pages
git checkout -
