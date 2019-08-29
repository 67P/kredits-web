import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Route.extend({

  kredits: service(),

  redirect () {
    this._super(...arguments);

    if (isEmpty(this.kredits.githubAccessToken)) {
      this.transitionTo('signup.index');
    }
  }

});
