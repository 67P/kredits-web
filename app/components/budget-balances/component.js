import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default class BudgetBalancesComponent extends Component {
  @service communityFunds
  @alias('communityFunds.balances') balances;

  get loading () {
    return !this.communityFunds.balancesLoaded;
  }
}
