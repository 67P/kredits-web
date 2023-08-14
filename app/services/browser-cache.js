import Service from '@ember/service';
import * as localforage from 'localforage';
import config from 'kredits-web/config/environment';

function createStore(name) {
  let networkName;
  if (config.web3NetworkName) {
    networkName = config.web3NetworkName.toLocaleLowerCase().replace(' ', '-');
  } else {
    networkName = 'custom';
  }
  return localforage.createInstance({ name: `kredits:${networkName}:${name}` });
}

export default class BrowserCacheService extends Service {

  constructor() {
    super(...arguments);
    this.stores = {
      contributors:  createStore('contributors'),
      contributions: createStore('contributions'),
      reimbursements: createStore('reimbursements')
    }
  }

  get contributors() {
    return this.stores.contributors;
  }

  get contributions() {
    return this.stores.contributions;
  }

  get reimbursements() {
    return this.stores.reimbursements;
  }
}
