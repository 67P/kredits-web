import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  router: service(),

  selectedContributorId: null,

  actions: {

    openContributorDetails(contributor) {
      this.router.transitionTo('dashboard.contributors.show', contributor);
    }

  }
});
