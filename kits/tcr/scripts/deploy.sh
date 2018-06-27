#!/bin/bash

set -e

cd node_modules/@aragon/os
#printf "\nInstalling aragonOS dependencies...\n"
#npm install
printf "\nDeploying test ENS instance...\n"
export ENS=$(npm run deploy:devnet:ens | tail -n 1) # get last line of output
printf "Using ENS ${ENS}"
printf "\nDeploying test APM instance...\n"
npm run deploy:devnet:apm
# extract and set ENS
cd -
