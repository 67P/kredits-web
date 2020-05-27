import Service from '@ember/service';
import * as localforage from 'localforage';

function createStore(name) {
  return localforage.createInstance({ name: `kredits:${name}` });
}

export default class BrowserCacheService extends Service {

  constructor() {
    super(...arguments);
    this.stores = {
      contributors:  createStore('contributors'),
      contributions: createStore('contributions')
    }
  }

  get contributors() {
    return this.stores.contributors;
  }

  get contributions() {
    return this.stores.contributions;
  }
}
