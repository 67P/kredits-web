import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ContributorComponent extends Component {
  @service router;

  @tracked selectedContributorId = null;
  @tracked showToplistOnly = true;

  get contributorList () {
    return this.args.contributorList;
  }

  get contributorTop10 () {
    return this.contributorList ?
      this.contributorList.slice(0, 10) : [];
  }

  get contributors () {
    return this.showToplistOnly ?
      this.contributorTop10 : this.contributorList;
  }

  get hiddenContributorsAmount () {
    return this.contributorList.length - 10;
  }

  get showAllButtonText () {
    return `Show ${this.hiddenContributorsAmount} more contributors`;
  }

  @action
  openContributorDetails (contributor) {
    this.router.transitionTo('dashboard.contributors.show', contributor);
  }

  @action
  showAllContributors () {
    this.showToplistOnly = false;
  }
}
