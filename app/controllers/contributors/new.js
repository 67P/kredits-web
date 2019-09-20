import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  kredits: service(),

  actions: {

    save (contributor) {
      return this.kredits.addContributor(contributor);
    }

  }

});
