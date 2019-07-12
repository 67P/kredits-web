import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { alias } from '@ember/object/computed';

export default Route.extend({

  kredits: service(),
  contributions: alias('kredits.contributions'),

  model (params) {
    return this.contributions.findBy('id', parseInt(params.id));
  },

  setupController (controller, model) {
    this._super(controller, model);

    this.controllerFor('dashboard')
        .setProperties({
          showDetailsPane: true,
          selectedContributionId: model.id
        });
  },

  deactivate () {
    this.controllerFor('dashboard')
        .setProperties({
          showDetailsPane: false,
          selectedContributionId: null
        });
  }

});
