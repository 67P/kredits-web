import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

  kredits: service(),

  model(params) {
    const contribution = this.kredits.contributions.findBy('id', parseInt(params.id));
    contribution.contributorId = contribution.contributorId.toString();

    return contribution;
  },

  setupController (controller, model) {
    this._super(controller, model);

    controller.set('attributes', model.getProperties([
      'kind', 'amount', 'description', 'url', 'details'
    ]));
    controller.set('attributes.contributorId', model.contributorId.toString());
    controller.set('attributes.date', model.jsDate);
  }

});
