#!/bin/bash

curl --location --request GET https://api.whatsonchain.com/v1/bsv/test/tx/$1/hex > $1.hex

node dist/cli.cjs --enrich-standard --testnet @$1.hex 
