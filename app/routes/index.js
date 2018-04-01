import Ember from 'ember';
import Contributor from 'kredits-web/models/contributor';

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
    let kredits = this.get('kredits');
    let totalSupply = kredits.get('tokenContract')
      .then((contract) => contract.invoke('totalSupply'));

    return Ember.RSVP.hash({
      contributors: kredits.getContributors(),
      proposals: kredits.getProposals(),
      totalSupply,
      newContributor: Contributor.create({ kind: 'person' })
    });
  }

});
