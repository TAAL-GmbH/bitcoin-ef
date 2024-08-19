#!/bin/bash

curl --location --request GET https://api.whatsonchain.com/v1/bsv/main/tx/$1/hex > $1.hex

node dist/cli.cjs --enrich-standard @$1.hex 
