#!/bin/bash
set -e

git fetch

git checkout develop

ORIGINAL_NAME="$(git config user.name)"
ORIGINAL_EMAIL="$(git config user.email)"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
$DIR/ghpages-logic.sh

git config user.name $ORIGINAL_NAME
git config user.email $ORIGINAL_EMAIL

git checkout develop
