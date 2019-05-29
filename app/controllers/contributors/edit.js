import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  kredits: service(),

  actions: {

    save (attributes) {
      return this.kredits
                 .updateContributor(this.model.id, attributes)
                 .then(() => this.transitionToRoute('index'))
    }

  }

});
