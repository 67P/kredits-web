import Kredits from '../kredits';
import multihashes from 'npm:multihashes';

export default class Base {
  constructor(contract) {
    this.contract = contract;
  }

  get functions() {
    return this.contract.functions;
  }

  // TODO: move into utils
  fetchAndMergeIpfsData(data, Serializer) {
    if (!data.hashSize || data.hashSize === 0) {
      return data;
    }
    let digest = Kredits.ipfs.Buffer.from(data.ipfsHash.slice(2), 'hex');
    let ipfsHash = multihashes.encode(digest, data.hashFunction, data.hashSize);

    return Kredits.ipfs
      .cat(ipfsHash)
      .then(Serializer.deserialize)
      .then((attributes) => {
        return Object.assign({}, data, attributes);
      });
  }

  decodeIpfsHash(ipfsHash) {
    let multihash = multihashes.decode(multihashes.fromB58String(ipfsHash));
    return {
      ipfsHash: '0x' + multihashes.toHexString(multihash.digest),
      hashSize: multihash.length,
      hashFunction: multihash.code
    };
  }
}
