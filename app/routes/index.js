import Ember from 'ember';
import Contributor from 'kredits-web/models/contributor';

export default Ember.Route.extend({

  kredits: Ember.inject.service(),

  model() {
    let kredits = this.get('kredits');

    return Ember.RSVP.hash({
      contributors: kredits.getContributors(),
      totalSupply: kredits.getValueFromContract('tokenContract', 'totalSupply'),
      proposals: kredits.getProposals(),
      newContributor: Contributor.create({ kind: 'person' })
    });
  }

});
