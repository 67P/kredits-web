import Component from '@glimmer/component';

export default class ExpenseListComponent extends Component {

  get showDeleteButton () {
    return !!this.args.deletable;
  }

}
