import Ember from 'ember';

export default Ember.Route.extend({

  kredits: Ember.inject.service(),

  model() {
    return Ember.RSVP.hash({
      contributors: this.get('kredits').getContributors(),
      totalSupply: this.get('kredits').getValueFromContract('totalSupply'),
      contributorsCount: this.get('kredits').getValueFromContract('contributorsCount')
    });
  }

});
