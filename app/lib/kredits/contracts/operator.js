import ethers from 'npm:ethers';
import RSVP from 'rsvp';

import Kredits from '../kredits';
import ContributionSerializer from '../serializers/contribution';

import Base from './base';

export default class Operator extends Base {
  all() {
    return this.functions.proposalsCount()
      .then((count) => {
        count = count.toNumber();
        let proposals = [];

        for (let id = 1; id <= count; id++) {
          proposals.push(this.getById(id));
        }

        return RSVP.all(proposals);
      });
  }

  getById(id) {
    id = ethers.utils.bigNumberify(id);

    return this.functions.proposals(id)
      .then((data) => {
        // TODO: remove as soon as the contract provides the id
        data.id = id;
        // TODO: rename creatorAddress to creator
        data.creatorAddress = data.creator;

        return data;
      })
      // Fetch IPFS data if available
      .then((data) => {
        return Kredits.ipfs.catAndMerge(data, ContributionSerializer.deserialize);
      });
  }

  addProposal(proposalAttr) {
    let json = ContributionSerializer.serialize(proposalAttr);
    // TODO: validate against schema

    return Kredits.ipfs
      .add(json)
      .then((ipfsHashAttr) => {
        let proposal = [
          proposalAttr.contributorId,
          proposalAttr.amount,
          ipfsHashAttr.ipfsHash,
          ipfsHashAttr.hashFunction,
          ipfsHashAttr.hashSize,
        ];

        console.log('[kredits] addProposal', ...proposal);
        return this.functions.addProposal(...proposal);
      });
  }
}
