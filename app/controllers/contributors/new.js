import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({

  kredits: service(),

  contributors: alias('kredits.contributors'),

  actions: {

    save (contributor) {
      return this.kredits.addContributor(contributor)
        .then(contributor => {
          this.transitionToRoute('index');
          return contributor;
        });
    }

  }

});
