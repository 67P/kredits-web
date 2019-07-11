import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({

  router: service(),

  tagName: 'table',
  classNames: 'contributor-list',
  selectedContributor: null,

  actions: {

    openContributorDetails(contributor) {
      this.router.transitionTo('dashboard.contributors.show', contributor);
    }

  }

});
