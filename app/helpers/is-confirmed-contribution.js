import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Helper.extend({

  kredits: service(),
  currentBlock: alias('kredits.currentBlock'),

  compute([contribution]) {
    return !contribution.vetoed &&
           (contribution.confirmedAt <= this.currentBlock);
  }

});
