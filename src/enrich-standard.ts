import BN from "bn.js";
import fetch from 'cross-fetch';

import { initReaderWriter, writeOutputs } from "./helpers";

export const EnrichStandardWOC = async function(tx: Buffer | String): Promise<Buffer | String> {
  let { returnBuffer, reader, writer } = initReaderWriter(tx);

  const sizeTxIns = reader.readVarintNum();

  // write the Extended Format header
  writer.write(Buffer.from('0000000000EF', 'hex'))
  writer.writeVarintNum(sizeTxIns);

  for (let i = 0; i < sizeTxIns; i++) {
    // tx ID
    const txID = reader.read(32)

    writer.write(txID);
    // output index
    const outputIndex = reader.readUInt32LE()
    writer.writeUInt32LE(outputIndex);

    // input script
    const scriptBuffer = reader.readVarLengthBuffer();
    writer.writeVarintNum(scriptBuffer.length)
    writer.write(scriptBuffer);

    // sequence number
    writer.writeUInt32LE(reader.readUInt32LE());

    //
    // Get the TX from Whatsonchain and add the extended information
    //
    // we must make a copy of txID, otherwise it will be reversed and written that way by the writer (JS object reference)
    const txIDHex = Buffer.from(txID).reverse().toString('hex')
    const wocTx = await fetch(`https://api.whatsonchain.com/v1/bsv/main/tx/hash/${txIDHex}`);
    const wocTxJson: any = await wocTx.json();

    // write the satoshis
    writer.writeUInt64LEBN(new BN(Math.round(wocTxJson.vout[outputIndex].value * 100000000)))

    let lockingScript = Buffer.from(wocTxJson.vout[outputIndex].scriptPubKey.hex, 'hex');
    writer.writeVarintNum(lockingScript.length)
    writer.write(lockingScript as Buffer)
  }

  writeOutputs(reader, writer);

  return returnBuffer ? writer.toBuffer() : writer.toBuffer().toString('hex');
}
