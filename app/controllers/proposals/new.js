import Controller from '@ember/controller';
import { alias, filterBy } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  kredits: service(),

  contributors: alias('kredits.contributors'),
  minedContributors: filterBy('contributors', 'id'),

  actions: {
    save(proposal) {
      // contributorIpfsHash is needed for the proposal ipfs data. I'm not happy to do this here but I think to load all the contributors in addProposal again is a bit too much. I hope we can refactor it later.
      let contributor = this.contributors.findBy('id', proposal.contributorId);
      proposal.contributorIpfsHash = contributor.get('ipfsHash');

      return this.kredits.addProposal(proposal)
        .then((proposal) => {
          this.transitionToRoute('index');
          return proposal;
        });
    }
  }
});
