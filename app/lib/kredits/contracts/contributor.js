import ethers from 'npm:ethers';
import RSVP from 'rsvp';

import Kredits from '../kredits';
import ContributorSerializer from '../serializers/contributor';
import { toBytes32 } from '../utils/multihash';

import Base from './base';

export default class Contributor extends Base {
  all() {
    return this.contract.functions.contributorsCount()
      .then((count) => {
        count = count.toNumber();
        let contributors = [];

        for (let id = 1; id <= count; id++) {
          contributors.push(this.getById(id));
        }

        return RSVP.all(contributors);
      });
  }

  getById(id) {
    id = ethers.utils.bigNumberify(id);

    return this.contract.functions.getContributorById(id)
      .then((data) => {
        // TODO: remove as soon as the contract provides the id
        data.id = id;
        // TODO: rename address to account
        data.address = data.account;

        return data;
      })
      // Fetch IPFS data if available
      .then((data) => {
        return this.fetchAndMergeIpfsData(data, ContributorSerializer);
      });
  }

  add(attributes) {
    console.log(attributes);

    let json = ContributorSerializer.serialize(attributes);
    // TODO: validate against schema

    return Kredits.ipfs
      .add(new Kredits.ipfs.Buffer(json))
      .then((res) => res[0].hash)
      .then((ipfsHash) => {
        Object.assign(attributes, this.decodeIpfsHash(ipfsHash));
        return attributes;
      })
      .then((attributes) => {
        let { address, digest, hashFunction, hashSize, isCore } = attributes;

        let contributor = [
          address,
          digest,
          hashFunction,
          hashSize,
          isCore,
        ];

        console.log('[kredits] addContributor', ...contributor);
        return this.contract.functions.addContributor(...contributor);
      });
  }
}
