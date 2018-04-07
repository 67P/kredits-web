import Controller from 'ember-controller';
import { filterBy } from 'ember-computed';
import injectService from 'ember-service/inject';

export default Controller.extend({
  kredits: injectService(),

  contributors: [],
  minedContributors: filterBy('contributors', 'id'),

  actions: {
    save(proposal) {
      // contributorIpfsHash is needed for the proposal ipfs data. I'm not happy to do this here but I think to load all the contributors in addProposal again is a bit too much. I hope we can refactor it later.
      let contributor = this.get('contributors').findBy('id', proposal.recipientId);
      proposal.contributorIpfsHash = contributor.get('ipfsHash');

      return this.get('kredits').addProposal(proposal)
        .then((proposal) => {
          this.transitionToRoute('index');
          return proposal;
        });
    }
  }
});
