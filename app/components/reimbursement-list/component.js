import Component from '@glimmer/component';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default class ReimbursementListComponent extends Component {
  @service kredits;

  itemSorting = Object.freeze(['pendingStatus:asc', 'id:desc']);
  @sort('args.items', 'itemSorting') itemsSorted;
}
