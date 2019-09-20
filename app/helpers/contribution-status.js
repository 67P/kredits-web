import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { once } from '@ember/runloop';

export default Helper.extend({

  kredits: service(),
  currentBlock: alias('kredits.currentBlock'),

  compute([contribution]) {
    this.setupRecompute(contribution);

    if (contribution.vetoed) {
      return 'vetoed';
    } else if (contribution.confirmedAt > this.currentBlock) {
      return 'unconfirmed';
    } else {
      return 'confirmed'
    }
  },

  destroy () {
    if (this.teardown) this.teardown();
    this._super(...arguments);
  },

  setupRecompute (contribution) {
    if (this.teardown) this.teardown();

    contribution.addObserver('vetoed' , this, this.triggerRecompute);
    contribution.addObserver('confirmedAt' , this, this.triggerRecompute);
    contribution.addObserver('currentBlock' , this, this.triggerRecompute);

    this.teardown = () => {
      contribution.removeObserver('vetoed', this, this.triggerRecompute);
      contribution.removeObserver('confirmedAt', this, this.triggerRecompute);
      contribution.removeObserver('currentBlock', this, this.triggerRecompute);
    };
  },

  triggerRecompute () {
    once(this, function () {
      this.recompute();
    });
  }

});
