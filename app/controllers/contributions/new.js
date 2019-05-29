import Controller from '@ember/controller';
import { alias, filterBy, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({

  kredits: service(),

  contributors: alias('kredits.contributors'),
  minedContributors: filterBy('contributors', 'id'),

  contributorsSorting: Object.freeze(['name:asc']),
  sortedContributors: sort('minedContributors', 'contributorsSorting'),

  actions: {

    save (contribution) {
      const contributor = this.contributors.findBy('id', contribution.contributorId);
      contribution.contributorIpfsHash = contributor.ipfsHash;

      return this.kredits.addContribution(contribution)
        .then(contribution => {
          this.transitionToRoute('index');
          return contribution;
        });
    }

  }

});
