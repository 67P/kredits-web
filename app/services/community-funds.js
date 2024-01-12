import { A } from '@ember/array';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import Service, { inject as service } from '@ember/service';
import config from 'kredits-web/config/environment';

export default class CommunityFundsService extends Service {
  @service exchangeRates;

  @tracked balancesLoaded = false;
  @tracked balances = A([]);

  @task
  *fetchBalances () {
    const promises = [];
    const balances = config.communityFundsAPI.balances;

    for (const item of Object.keys(balances)) {
      const c = balances[item];
      promises.push(
        this.fetchBalance(c.url)
            .then(res => { return this.processBalance(res, c) })
      )
    }

    yield Promise.all(promises)
      .then(() => {
        this.balancesLoaded = true;
      })
      .catch(err => {
        console.log(`[community-funds] Fetching balances failed:`);
        console.error(err);
      });
  }

  async fetchBalance(url) {
    return fetch(url).then(res => res.json());
  }

  async processBalance (res, config) {
    await this.exchangeRates.fetchRates();

    // Format and round the approximate USD value
    const lang = navigator.language || navigator.userLanguage;
    const balanceUSD = (res.confirmed_balance / 100000000) * this.exchangeRates.btcusd;
    res.balanceUSD = Math.round(balanceUSD).toLocaleString(lang);

    this.balances.pushObject({
      ...res,
      ...{ token: { icon: `/img/${config.icon}`, symbol: config.symbol, description: config.description } }
    });
  }
}
