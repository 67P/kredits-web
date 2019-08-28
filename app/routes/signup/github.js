import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Route.extend({

  kredits: service(),

  redirect () {
    this._super(...arguments);

    let accessToken;
    try {
      accessToken = window.location.hash.match(/access_token=(.+)/)[1];
    } catch (error) { /* ignore */ }

    if (isEmpty(accessToken) || accessToken === 'undefined') {
      console.error('No GitHub access token found.');
      this.transitionTo('signup');
      return;
    }

    this.kredits.set('githubAccessToken', accessToken);

    this.transitionTo('signup.eth-account');
  }

});

