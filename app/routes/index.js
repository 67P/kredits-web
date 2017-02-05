import Ember from 'ember';

export default Ember.Route.extend({

  kredits: Ember.inject.service(),

  model() {
    let kredits = this.get('kredits');

    return Ember.RSVP.hash({
      contributors: kredits.getContributors(),
      totalSupply: kredits.getValueFromContract('totalSupply'),
      contributorsCount: kredits.getValueFromContract('contributorsCount'),
      proposals: kredits.getProposals()
    });
  }

});
