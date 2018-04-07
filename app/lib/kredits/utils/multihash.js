import bs58 from 'npm:bs58';
import NpmBuffer from 'npm:buffer';
const Buffer = NpmBuffer.Buffer;

function fromBytes32({ digest, hashFunction, hashSize }) {
  if (hashSize === 0) {
    return;
  }

  const hashBytes = Buffer.from(digest.slice(2), 'hex');
  const multiHashBytes = new (hashBytes.constructor)(2 + hashBytes.length);

  multiHashBytes[0] = hashFunction;
  multiHashBytes[1] = hashSize;
  multiHashBytes.set(hashBytes, 2);

  return bs58.encode(multiHashBytes);
}

function toBytes32(string) {
  const decoded = bs58.decode(string);

  return {
    digest: `0x${decoded.slice(2).toString('hex')}`,
    hashFunction: decoded[0],
    hashSize: decoded[1],
  };
}

export {
  fromBytes32,
  toBytes32
};
