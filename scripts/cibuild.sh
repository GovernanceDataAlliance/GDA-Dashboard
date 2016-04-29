#!/bin/bash
set -e

if [[ $TRAVIS_PULL_REQUEST == "false" ]]; then

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
$DIR/ghpages-logic.sh

echo "Pushing to gh-pages branch"
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" gh-pages:gh-pages > /dev/null 2>&1

fi
