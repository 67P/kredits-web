import Ember from 'ember';

export default Ember.Route.extend({

  kredits: Ember.inject.service(),

  model() {
    let newContributor = Ember.getOwner(this).lookup('model:contributor');
    newContributor.set('kind', 'person');

    let kredits = this.get('kredits');
    let totalSupply = kredits.get('kredits').Token.functions.totalSupply();

    return Ember.RSVP.hash({
      contributors: kredits.getContributors(),
      proposals: kredits.getProposals(),
      totalSupply,
      newContributor: newContributor,
    });
  }

});
