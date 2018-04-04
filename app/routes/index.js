import Ember from 'ember';

export default Ember.Route.extend({

  kredits: Ember.inject.service(),

  beforeModel(transition) {
    const kredits = this.get('kredits');
    return kredits.initEthProvider().then(() => {
      if (kredits.get('accountNeedsUnlock')) {
        if (confirm('It looks like you have an Ethereum wallet available. Please unlock your account.')) {
          transition.retry();
        }
      }
    });
  },

  model() {
    let newContributor = Ember.getOwner(this).lookup('model:contributor');
    newContributor.set('kind', 'person');

    let kredits = this.get('kredits');
    let totalSupply = kredits.get('tokenContract')
      .then((contract) => contract.totalSupply());

    return Ember.RSVP.hash({
      contributors: kredits.getContributors(),
      proposals: kredits.getProposals(),
      totalSupply,
      newContributor: newContributor,
    });
  }

});
