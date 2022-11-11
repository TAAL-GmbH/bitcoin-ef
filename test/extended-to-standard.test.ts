import {describe, expect, test} from '@jest/globals'
import { ExtendedToStandard, PreviousOutputs, PreviousOutput } from "../src";
import { invalidTx, data } from "./data";

describe('Extended to Standard', () => {
  test('empty tx', () => {
    expect(() => {
      const standardTx = ExtendedToStandard("");
    }).toThrow("too small to be a valid transaction");
  });

  test('invalid tx string', () => {
    expect(() => {
      const standardTx = ExtendedToStandard("abcdefghijklmnopsergesrgser");
    }).toThrow("too small to be a valid transaction");
  });

  test('invalid tx', () => {
    expect(() => {
      const standardTx = ExtendedToStandard(invalidTx);
    }).toThrow("not an extended format transaction");
  });

  test('valid tx vectors', () => {
    data.forEach((d: any) => {
      const standardTx = ExtendedToStandard(d.validExtendedTx);
      expect(standardTx).toBe(d.validTx)
    });
  });

  test('valid tx vector buffers', () => {
    data.forEach((d: any) => {
      const standardTx = ExtendedToStandard(Buffer.from(d.validExtendedTx, 'hex'));
      expect(standardTx).toStrictEqual(Buffer.from(d.validTx, 'hex')); // must return a buffer
    });
  });
});
