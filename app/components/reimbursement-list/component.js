import Component from '@glimmer/component';
import { sort } from '@ember/object/computed';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ReimbursementListComponent extends Component {
  @service kredits;

  itemSorting = Object.freeze(['pendingStatus:asc', 'id:desc']);
  @sort('args.items', 'itemSorting') itemsSorted;

  @action
  veto (id) {
    this.kredits.vetoReimbursement(id).then(transaction => {
      console.debug('[controllers:budget] Veto submitted to chain: '+transaction.hash);
    });
  }
}
