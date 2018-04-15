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

    return this.functions.getProposal(id)
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
