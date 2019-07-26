import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

  kredits: service(),

  redirect () {
    this._super(...arguments);

    const accessToken = window.location.hash.match(/access_token=(.+)/)[1];
    this.kredits.set('githubAccessToken', accessToken);

    this.transitionTo('signup.eth-account');
  }

});

