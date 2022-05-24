import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { task } from 'ember-concurrency-decorators';
import config from 'kredits-web/config/environment';

export default class CommunityFundsService extends Service {
  @service exchangeRates;

  @tracked balancesLoaded = false;
  @tracked balances = A([]);

  @task
  *fetchBalances () {
    yield fetch(config.btcBalanceAPI).then(res => res.json())
      .then(res => {
        return this.processBalances(res);
      })
      .catch(err => {
        console.log(`[community-funds] Fetching balances failed:`);
        console.error(err);
      });
  }

  async processBalances (res) {
    await this.exchangeRates.fetchRates();
    // Format and round the approximate USD value
    const lang = navigator.language || navigator.userLanguage;
    const balanceUSD = res.confirmed_balance * this.exchangeRates.btcusd;
    res.balanceUSD = Math.round(balanceUSD).toLocaleString(lang);

    this.balances.pushObject({
      ...res,
      ...{ token: { name: 'BTC', symbol: 'BTC'} }
    });

    this.balancesLoaded = true;
  }
}
