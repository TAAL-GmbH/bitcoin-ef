import { initReaderWriter, writeOutputs } from "./helpers";

export const ExtendedToStandard = function(tx: Buffer | String): Buffer | String {
  let { returnBuffer, reader, writer } = initReaderWriter(tx);

  const header = reader.read(6).toString('hex').toLowerCase();
  if (header !== '0000000000ef') {
    throw new Error('not an extended format transaction');
  }

  // read in the real number of transactions
  const sizeTxIns = reader.readVarintNum();
  writer.writeVarintNum(sizeTxIns);
  for (let i = 0; i < sizeTxIns; i++) {
    // tx ID
    writer.write(reader.read(32));
    // output index
    writer.writeUInt32LE(reader.readUInt32LE());

    // input script
    const scriptBuffer = reader.readVarLengthBuffer();
    writer.writeVarintNum(scriptBuffer.length)
    writer.write(scriptBuffer);

    // sequence number
    writer.writeUInt32LE(reader.readUInt32LE());

    //
    // Discard the extended information, by reading from reader
    //
    // satoshis
    reader.readUInt64LEBN();

    // locking script
    const size = reader.readVarintNum();
    reader.read(size);
  }

  writeOutputs(reader, writer);

  return returnBuffer ? writer.toBuffer() : writer.toBuffer().toString('hex');
}
