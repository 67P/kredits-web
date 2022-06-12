import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

  kredits: service(),

  model(params) {
    return this.kredits.contributions.findBy('id', parseInt(params.id));
  },

  setupController (controller, model) {
    this._super(controller, model);

    controller.set('attributes', model.getProperties([
      'contributorId', 'kind', 'amount', 'description', 'url', 'details'
    ]));
    controller.set('attributes.date', model.jsDate);
  }

});
