import bsv from 'bsv';
import {describe, expect, test} from '@jest/globals'
import { BSVToExtended } from "../src/bsv";
import { invalidTx, data } from "./data";

// from https://github.com/moneybutton/bsv/blob/bsv-legacy/test/transaction/transaction.js
const fromAddress = 'mszYqVnqKoQx4jcTdJXxwKAissE3Jbrrc1'
const toAddress = 'mrU9pEmAx26HcbKVrABvgL7AwA5fjNFoDc'
const changeAddress = 'mgBCJAsvzgT2qNNeXsoECg2uPKrUsZ76up'
const simpleUtxoWith100000Satoshis = {
  address: fromAddress,
  txId: 'a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458',
  outputIndex: 0,
  script: bsv.Script.buildPublicKeyHashOut(fromAddress).toString(),
  satoshis: 100000
}
const privateKey = 'cSBnVM4xvxarwGQuAfQFwqDg9k5tErHUHzgWsEfD4zdwUasvqRVY'

describe('BSV to Extended', () => {
  test('empty tx', () => {
    expect(() => {
      const tx = new bsv.Transaction();
      const standardTx = BSVToExtended(tx);
    }).toThrow("transaction must have inputs to use toExtended");
  });

  test('invalid tx', () => {
    expect(() => {
      const tx = new bsv.Transaction(invalidTx);
      const standardTx = BSVToExtended(tx);
    }).toThrow("Invalid state: Invalid length while reading varlength buffer. Expected to read: 86 and read 82");
  });

  test('valid tx - no inputs', () => {
    expect(() => {
      const tx = new bsv.Transaction(data[0].validTx);
      const standardTx = BSVToExtended(tx);
    }).toThrow("input must have the previous outputs set to use toExtended");
  });

  test('valid tx vectors', () => {
    const tx = new bsv.Transaction()
      .from(simpleUtxoWith100000Satoshis)
      .to(toAddress, 50000)
      .fee(150)
      .change(changeAddress)
      .sign(privateKey)

    const standardTx = BSVToExtended(tx);
    // must return a buffer
    expect(standardTx).toBeInstanceOf(Buffer);
  });

  test('valid tx vector hex output', () => {
    const tx = new bsv.Transaction()
      .from(simpleUtxoWith100000Satoshis)
      .to(toAddress, 50000)
      .fee(150)
      .change(changeAddress)
      .sign(privateKey)

    const standardTx = BSVToExtended(tx, 'hex');
    // must return a string
    expect(typeof standardTx).toBe("string")
  });
});
