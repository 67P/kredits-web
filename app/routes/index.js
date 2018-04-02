import Ember from 'ember';

export default Ember.Route.extend({

  kredits: Ember.inject.service(),

  beforeModel(transition) {
    const kredits = this.get('kredits');

    if (kredits.get('web3') && kredits.get('web3Provided')) {
      kredits.get('web3').eth.getAccounts((error, accounts) => {
        if (error || accounts.length === 0) {
          if (confirm('It looks like you have an Ethereum wallet available. Please unlock your account.')) {
            transition.retry();
          }
        }
      });
    }
  },

  model() {
    let newContributor = Ember.getOwner(this).lookup('model:contributor');
    newContributor.set('kind', 'person');

    let kredits = this.get('kredits');
    let totalSupply = kredits.get('tokenContract')
      .then((contract) => contract.invoke('totalSupply'));

    return Ember.RSVP.hash({
      contributors: kredits.getContributors(),
      proposals: kredits.getProposals(),
      totalSupply,
      newContributor: newContributor,
    });
  }

});
