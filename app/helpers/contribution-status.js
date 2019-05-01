import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Helper.extend({

  kredits: service(),
  currentBlock: alias('kredits.currentBlock'),

  compute([contribution]) {
    if (contribution.vetoed) {
      return 'vetoed';
    } else if (contribution.confirmedAt > this.currentBlock) {
      return 'unconfirmed';
    } else {
      return 'confirmed'
    }
  }

});
