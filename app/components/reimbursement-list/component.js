import Component from '@glimmer/component';
import { sort } from '@ember/object/computed';

export default class ReimbursementListComponent extends Component {
  itemSorting = Object.freeze(['id:desc']);
  @sort('args.items', 'itemSorting') itemsSorted;
}
