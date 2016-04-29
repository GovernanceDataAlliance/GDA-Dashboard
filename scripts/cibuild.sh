#!/bin/bash
set -e

if [[ $TRAVIS_PULL_REQUEST == "false" ]]; then

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
$DIR/ghpages-logic.sh

fi
