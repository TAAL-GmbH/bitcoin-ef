import {Transaction} from 'bsv';
import {StandardToExtended} from "../standard-to-extended";
import {PreviousOutputs} from "../interface";

declare module "bsv" {
  interface Transaction {
    toExtended(format: string): string | Buffer;
  }
}

Transaction.prototype.toExtended = function (format: string = "buffer") {
  if (this.inputs.length === 0) {
    throw new Error("transaction must have inputs to use toExtended");
  }

  const previousOuts: PreviousOutputs = [];
  this.inputs.map((input) => {
    if (!input.output || !input.output.script || !input.output.satoshis) {
      throw new Error("input must have the previous output script and satoshis set to use toExtended");
    }
    previousOuts.push({
      satoshis: input.output.satoshis as number,
      lockingScript: input.output.script.toBuffer() as Buffer,
    });
  });
  const extended = StandardToExtended(this.toBuffer(), previousOuts) as Buffer;

  if (format === "hex") {
    return extended.toString('hex');
  }
  return extended;
}

export const BSVToExtended = (tx: Transaction, format: string = "buffer") => {
  return tx.toExtended(format);
}
