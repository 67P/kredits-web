import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class BudgetBalancesComponent extends Component {
  @service communityFunds;

  get balancesSorted () {
    return this.communityFunds.balances
               .sortBy('confirmed_balance').reverse();
  }

  get loading () {
    return !this.communityFunds.balancesLoaded;
  }
}
