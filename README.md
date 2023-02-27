# [Bitcoin Extend Format JavaScript Utils](https://www.npmjs.com/package/@TAAL-GmbH/bitcoin-ef)

[![last commit](https://img.shields.io/github/last-commit/TAAL-GmbH/bitcoin-ef.svg?style=flat&v=2)](https://github.com/TAAL-GmbH/bitcoin-ef/commits/master)
[![version](https://img.shields.io/github/release-pre/TAAL-GmbH/bitcoin-ef.svg?style=flat&v=2)](https://github.com/TAAL-GmbH/bitcoin-ef/releases)
[![Npm](https://img.shields.io/npm/v/@TAAL-GmbH/bitcoin-ef?style=flat&v=2)](https://www.npmjs.com/package/@TAAL-GmbH/bitcoin-ef)
[![license](https://img.shields.io/badge/license-Open%20BSV-brightgreen.svg?style=flat&v=2)](/LICENSE)
[![Mergify Status](https://img.shields.io/endpoint.svg?url=https://api.mergify.com/v1/badges/TAAL-GmbH/bitcoin-ef&style=flat&v=2)](https://mergify.io)
[![Sponsor](https://img.shields.io/badge/sponsor-TAAL-GmbH-181717.svg?logo=github&style=flat&v=2)](https://github.com/sponsors/TAAL-GmbH)

## Table of Contents
- [Bitcoin Extend Format JavaScript Utils](#bitcoin-extend-format-javascript-utils)
  - [Table of Contents](#table-of-contents)
  - [What is Bitcoin Extended Format?](#what-is-bitcoin-extended-format)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Usage with the BSV library](#usage-with-the-bsv-library)
    - [On the command line](#on-the-command-line)
  - [How can I help?](#how-can-i-help)
    - [Contributors ✨](#contributors-)
  - [License](#license)

<br />

## What is Bitcoin Extended Format?

The bitcoin transaction format is the most efficient way of sending the information that is needed for a Bitcoin node to
validate

## Installation

Install the Bitcoin Extended Format library into your project:
```bash
$ npm install bitcoin-ef
```

or, with yarn
```bash
$ yarn add bitcoin-ef
```

or, install as a global cli tool
```bash
$ npm install -g bitcoin-ef
```

## Usage
Here's the getting started with the Extended Format

```javascript
import { StandardToExtended, ExtendedToStandard } from '@TAAL-GmbH/bitcoin-ef';

// hex encoded standard transaction
const tx = "..."; // hex or buffer
// the missing information from the inputs, in the correct order (!)
const inputs = [
  {
    locking_script: "...", // hex or buffer
    satoshis: 1234
  },
  {
    locking_script: "...", // hex or buffer
    satoshis: 5423
  }
];
// The StandardToExtended function accepts both a hex string or a buffer, and will return the same format as was given
const extendTransaction = StandardToExtended(tx, inputs);

// The ExtendedToStandard function accepts both a hex string or a buffer, and will return the same format as was given
const standardTransaction = ExtendedToStandard(extendTransaction);
```

## Usage with the BSV library

```javascript
import bsv from 'bsv';
import 'bitcoin-ef/bsv';

const tx = new bsv.Transaction()
  .from(utxo)
  .to(toAddress, 50000)
  .fee(150)
  .change(changeAddress)
  .sign(privateKey)

const txBuffer = tx.toExtended();
const txHex = tx.toExtended('hex');
```

or if you have problems with the above:

```javascript
import bsv from 'bsv';
import { BSVToExtended } from 'bitcoin-ef/bsv';

const tx = new bsv.Transaction()
  .from(utxo)
  .to(toAddress, 50000)
  .fee(150)
  .change(changeAddress)
  .sign(privateKey)

const txBuffer = BSVToExtended(tx);
const txHex = BSVToExtended(tx, 'hex');
```

Or using common JS:

```javascript
const bsv = require('bsv')
require('bitcoin-ef/bsv')

/*
const utxo = {
  txId: '83c6307ba22838e469545db27a193934576e753ff4c0288537cece4a06ad3d87',
  outputIndex: 0,
  script: '76a914117af07edf84bcd40950f46a8254f7f78d85243088ac',
  satoshis: 836486
}

const child = bsv.HDPrivateKey('xprv....')
  .deriveChild('m/0/0')

const privateKey = child.privateKey
console.log(privateKey.toString())

const toAddress = privateKey.toAddress().toString()
console.log(toAddress)

const tx = new bsv.Transaction()
  .from(utxo)
  .change(toAddress)
  .sign(privateKey)
*/

// This is the hex of the signed transaction that does NOT contain the previous output script and satoshis.
const tx = bsv.Transaction('0100000001873dad064acece378528c0f43f756e573439197ab25d5469e43828a27b30c683000000006b483045022100ff923348df29deedf3c08fcb1bb898f7304344931ba131a03f86beae43f67af7022049fff7207c1f1ee0074de743066e4d3c5aa636d6d019187879327c9c9f6b3cbf412102e7cf3fce2bc6bf4b9e8ef59fd2e4df7f79b5fd8d84cc6b05b8cb9066fdd81575ffffffff0126c30c00000000001976a914117af07edf84bcd40950f46a8254f7f78d85243088ac00000000')

// The following code is not necessary if you have created and signed the transaction using the bsv library.
tx.inputs[0].output = {
  script: bsv.Script('76a914117af07edf84bcd40950f46a8254f7f78d85243088ac'),
  satoshis: 836486
}

console.log(tx.toExtended('hex'))

```

### On the command line
After installing the cli tool, you can use it like this:

```bash
$ bitcoin-ef --help
```

To convert an extended transaction to a standard transaction:

```bash
$ bitcoin-ef --to-standard <hex encoded extended transaction>
```

To convert a standard transaction to an extended transaction, you need to pass the missing information from the inputs, in the correct order (!):

```bash
$ bitcoin-ef --to-extended <hex encoded standard transaction> <json encoded inputs>
```

To automatically convert a standard transaction to an extended transaction, using the WhatsOnChain API for lookups.
This is the default behaviour of the cli tool:

```bash
$ bitcoin-ef --enrich-standard <hex encoded standard transaction>
or
$ bitcoin-ef <hex encoded standard transaction>
```

## How can I help?
All kinds of contributions are welcome :raised_hands:!
The most basic way to show your support is to star :star2: the project, or to raise issues :speech_balloon:.
You can also support this project by [becoming a sponsor on GitHub](https://github.com/sponsors/TAAL-GmbH) :clap:

[![Stars](https://img.shields.io/github/stars/TAAL-GmbH/bitcoin-ef?label=Please%20like%20us&style=social&v=2)](https://github.com/TAAL-GmbH/bitcoin-ef/stargazers)

<br/>

### Contributors ✨
Thank you to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/ordishs"><img src="https://avatars.githubusercontent.com/u/71426?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Simon Ordish</b></sub></a><br /><a href="#infra-ordishs" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/TAAL-GmbH/bitcoin-ef/commits?author=ordishs" title="Code">💻</a> <a href="#security-ordishs" title="Security">🛡️</a></td>
    <td align="center"><a href="https://github.com/icellan"><img src="https://avatars.githubusercontent.com/u/4411176?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Siggi</b></sub></a><br /><a href="#infra-icellan" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/TAAL-GmbH/bitcoin-ef/commits?author=icellan" title="Code">💻</a> <a href="#security-icellan" title="Security">🛡️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

> This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.


<br />

## License
[![License](https://img.shields.io/badge/license-Open%20BSV-brightgreen.svg?style=flat&v=2)](/LICENSE)
