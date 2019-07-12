import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { alias } from '@ember/object/computed';

export default Route.extend({

  kredits: service(),
  contributors: alias('kredits.contributors'),

  model (params) {
    return this.contributors.findBy('id', params.id);
  },

  activate () {
    this.controllerFor('dashboard')
        .set('showDetailsPane', true);
  },

  deactivate () {
    this.controllerFor('dashboard')
        .set('showDetailsPane', false);
  }

});
