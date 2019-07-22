import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  kredits: service(),

  beforeModel(transition) {
    const kredits = this.kredits;

    let selectedNetworkId = window.ethereum.networkVersion;
    let kreditsNetwork = kredits.getKreditsDeployedNetwork();
    let kreditsNetworkName;

    switch(kreditsNetwork) {
      case '1':
        kreditsNetworkName = "Main";
        break;
      case '2':
        kreditsNetworkName = "Morden Test";
        break;
      case '3':
         kreditsNetworkName = "Ropsten Test";
        break;
      case '4':
         kreditsNetworkName = "Rinkeby Test";
        break;
      case '42':
         kreditsNetworkName = "Kovan Test";
        break;
      default:
        kreditsNetworkName = "Rinkeby Test";
    }

    if(selectedNetworkId == kreditsNetwork) {
      return kredits.setup().then(() => {
        kredits.get('kredits').preflightChecks().catch((error) => {
          console.error('Kredits preflight check failed!');
          console.error(error);
        });
        if (kredits.get('accountNeedsUnlock')) {
          if (confirm('It looks like you have an Ethereum wallet available. Please unlock your account.')) {
            transition.retry();
          }
        }
      }).catch((error) => {
        console.log('Error initializing Kredits', error);
      });
    }
    else {
      //need to better display this one maybe
      if(confirm(`Please change to ${kreditsNetworkName} network!`)) {
        transition.abort();
      }
    }

    window.ethereum.on('networkChanged', function() {
      transition.retry();
    })
  },

  afterModel() {
    return this.kredits.loadInitialData()
      .then(() => {
        this.kredits.addContractEventHandlers();
      });
  }
});
