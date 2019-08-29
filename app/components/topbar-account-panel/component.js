import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({

  tagName: '',

  kredits: service(),
  router: service(),

  actions: {

    signup() {
      this.router.transitionTo('signup');
    }

  }

});
