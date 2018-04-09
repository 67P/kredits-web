import ethers from 'npm:ethers';
import RSVP from 'rsvp';

import Kredits from '../kredits';
import ContributionSerializer from '../serializers/contribution';
import { toBytes32 } from '../utils/multihash';

import Base from './base';

export default class Operator extends Base {
  all() {
    return this.contract.functions.proposalsCount()
      .then((count) => {
        count = count.toNumber();
        let proposals = [];

        for (let id = 0; id < count; id++) {
          proposals.push(this.getById(id));
        }

        return RSVP.all(proposals);
      });
  }

  getById(id) {
    id = ethers.utils.bigNumberify(id);

    return this.contract.functions.proposals(id)
      .then(this.reassembleIpfsHash)
      .then((data) => {
        // TODO: remove as soon as the contract provides the id
        data.id = id;
        // TODO: rename creatorAddress to creator
        data.creatorAddress = data.creator;

        return data;
      })
      // Fetch IPFS data if available
      .then((data) => {
        return this.fetchAndMergeIpfsData(data, ContributionSerializer);
      });
  }

  addProposal(attributes) {
    console.log(attributes);

    let json = ContributionSerializer.serialize(attributes);
    // TODO: validate against schema

    return Kredits.ipfs
      .add(new Kredits.ipfs.Buffer(json))
      .then((res) => res[0].hash)
      .then((ipfsHash) => {
        Object.assign(attributes, toBytes32(ipfsHash));
        return attributes;
      })
      .then((attributes) => {
        let { recipientId, amount, digest, hashFunction, hashSize } = attributes;

        let proposal = [
          recipientId,
          amount,
          digest,
          hashFunction,
          hashSize,
        ];

        console.log('[kredits] addProposal', ...proposal);
        return this.contract.functions.addProposal(...proposal);
      });
  }
}
