import ethers from 'npm:ethers';
import RSVP from 'rsvp';

import Kredits from '../kredits';
import ContributorSerializer from '../serializers/contributor';

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
        return Kredits.ipfs.catAndMerge(data, ContributorSerializer.deserialize);
      });
  }

  add(contributorAttr) {
    let json = ContributorSerializer.serialize(contributorAttr);
    // TODO: validate against schema

    return Kredits.ipfs
      .add(json)
      .then((ipfsHashAttr) => {
        let contributor = [
          contributorAttr.address,
          ipfsHashAttr.ipfsHash,
          ipfsHashAttr.hashFunction,
          ipfsHashAttr.hashSize,
          contributorAttr.isCore,
        ];

        console.log('[kredits] addContributor', ...contributor);
        return this.contract.functions.addContributor(...contributor);
      });
  }
}
