import injectService from 'ember-service/inject';
import Route from 'ember-route';

export default Route.extend({
  kredits: injectService(),

  setupController(controller, model) {
    this._super(...arguments);

    this.get('kredits').getContributors()
      .then((contributors) => {
        this.controller.set('contributors', contributors);
      });
  }
});
