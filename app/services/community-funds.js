import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { task } from 'ember-concurrency-decorators';
import config from 'kredits-web/config/environment';

const txServiceBaseUrl = `${config.gnosisSafe.txServiceHost}/api/v1/safes/${config.gnosisSafe.address}`;

export default class CommunityFundsService extends Service {
  @tracked balancesLoaded = false;
  @tracked balances = A([]);

  @task
  *fetchBalances () {
    const uri = `${txServiceBaseUrl}/balances/usd/`;

    yield fetch(uri).then(res => res.json())
      .then(res => this.processBalances(res))
      .catch(err => {
        console.log(`[community-funds] Fetching balances failed:`);
        console.error(err);
      });
  }

  processBalances (res) {
    for (const balance of res) {
      // Format and round the approximate USD value
      const lang = navigator.language || navigator.userLanguage;
      balance.balanceUsd = Math.round(balance.balanceUsd).toLocaleString(lang);

      if (balance.token) {
        // ERC20 token, has all meta data
        this.balances.pushObject(balance);
      } else {
        // RBTC, missing meta data
        this.balances.pushObject({
          ...balance,
          ...{ token: { name: 'RBTC', symbol: 'RBTC'} }
        });
      }
    }

    this.balancesLoaded = true;
  }
}
