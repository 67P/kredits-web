import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ContributorComponent extends Component {
  @service router;

  selectedContributorId = null;

  @action
  openContributorDetails(contributor) {
    this.router.transitionTo('dashboard.contributors.show', contributor);
  }
}
