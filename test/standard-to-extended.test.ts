import {describe, expect, test} from '@jest/globals'
import { StandardToExtended, PreviousOutputs, PreviousOutput } from "../src";
import { invalidTx, data } from "./data";

describe('Extended to Standard', () => {
  test('empty tx', () => {
    expect(() => {
      const standardTx = StandardToExtended("", []);
    }).toThrow("too small to be a valid transaction");
  });

  test('invalid tx string', () => {
    expect(() => {
      const standardTx = StandardToExtended("abcdefghijklmnopsergesrgser", []);
    }).toThrow("too small to be a valid transaction");
  });

  test('invalid tx', () => {
    expect(() => {
      const standardTx = StandardToExtended(invalidTx, data[0].validTxInputs);
    }).toThrow("previousOuts must be the same length as the number of inputs");
  });

  test('valid tx - no inputs', () => {
    expect(() => {
      const standardTx = StandardToExtended(data[0].validTx, []);
    }).toThrow("previousOuts must be the same length as the number of inputs");
  });

  test('valid tx vectors', () => {
    data.forEach((d: any) => {
      const standardTx = StandardToExtended(d.validTx, d.validTxInputs);
      expect(standardTx).toBe(d.validExtendedTx)
    });
  });

  test('valid tx vector buffers', () => {
    data.forEach((d: any) => {
      const previousOutputs: PreviousOutputs = [];
      d.validTxInputs.forEach((output: PreviousOutput) => {
        previousOutputs.push({
          satoshis: output.satoshis,
          lockingScript: Buffer.from(output.lockingScript as string, 'hex'),
        });
      });
      const standardTx = StandardToExtended(Buffer.from(d.validTx, 'hex'), previousOutputs);
      expect(standardTx).toStrictEqual(Buffer.from(d.validExtendedTx, 'hex')); // must return a buffer
    });
  });
});
