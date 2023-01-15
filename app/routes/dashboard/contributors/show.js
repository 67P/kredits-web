import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { alias } from '@ember/object/computed';

export default Route.extend({

  kredits: service(),
  contributors: alias('kredits.contributors'),

  model (params) {
    const contributor = this.contributors.findBy('id', params.id);

    if (contributor) {
      return contributor;
    } else {
      return this.kredits.fetchContributor(params.id);
    }
  },

  setupController (controller, model) {
    this._super(controller, model);

    this.controllerFor('dashboard')
        .setProperties({
          showDetailsPane: true,
          selectedContributorId: model.id
        });
  },

  deactivate () {
    this.controllerFor('dashboard')
        .setProperties({
          showDetailsPane: false,
          selectedContributorId: null
        });
  }

});
