import injectService from 'ember-service/inject';
import Route from 'ember-route';

export default Route.extend({
  kredits: injectService(),

  setupController(controller) {
    this._super(...arguments);

    this.get('kredits').getContributors()
      .then((contributors) => {
        controller.set('contributors', contributors);
      });
  }
});
