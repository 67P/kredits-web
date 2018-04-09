import Kredits from '../kredits';
import { fromBytes32 } from '../utils/multihash';

export default class Base {
  constructor(contract) {
    this.contract = contract;
  }

  get functions() {
    return this.contract.functions;
  }

  // TODO: move into utils
  fetchAndMergeIpfsData(data, Serializer) {
    let ipfsHash = data.ipfsHash;

    if (!ipfsHash) {
      return data;
    }

    return Kredits.ipfs
      .cat(ipfsHash)
      .then(Serializer.deserialize)
      .then((attributes) => {
        return Object.assign({}, data, attributes);
      });
  }

  reassembleIpfsHash(data) {
    let { ipfsHash: digest, hashFunction, hashSize } = data;
    data.ipfsHash = fromBytes32({ digest, hashFunction, hashSize });
    delete data.hashFunction;
    delete data.hashSize;

    return data;
  }
}
