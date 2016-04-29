#!/bin/bash
set -e

if [[ $TRAVIS_PULL_REQUEST == "false" ]]; then

./ghpages-logic.sh

git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" gh-pages:gh-pages > /dev/null 2>&1

fi
