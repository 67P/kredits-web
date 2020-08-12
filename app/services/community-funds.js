import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import config from 'kredits-web/config/environment';

const txServiceBaseUrl = `${config.gnosisSafe.txServiceHost}/api/v1/safes/${config.gnosisSafe.address}`;

export default class CommunityFundsService extends Service {
  @tracked balanceETH = { balance: 0, balanceUsd: 0, usdConversion: 0 };
  @tracked balanceWBTC = { balance: 0, balanceUsd: 0, usdConversion: 0 };

  @task
  *fetchBalances () {
    const uri = `${txServiceBaseUrl}/balances/usd/`;

    yield fetch(uri).then(res => res.json())
      .then(res => {
        this.processBalances(res);
      })
      .catch(err => {
        console.log(`[community-funds] Fetching balances failed:`);
        console.error(err);
      });
  }

  processBalances (res) {
    // TODO proper selection/find
    const { balance, balanceUsd, usdConversion } = res[0];
    this.balanceETH = { balance, balanceUsd, usdConversion };
    this.balanceWBTC = res[1];
  }
}
