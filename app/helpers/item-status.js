import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { once } from '@ember/runloop';

export default Helper.extend({

  kredits: service(),
  currentBlock: alias('kredits.currentBlock'),

  compute([item]) {
    this.setupRecompute(item);

    let status = [];

    if (item.vetoed) {
      status.push('vetoed');
    } else if (item.confirmedAt > this.currentBlock) {
      status.push('unconfirmed');
    } else {
      status.push('confirmed');
    }

    if (item.hasPendingChanges) {
      status.push('pending');
    }

    return status.join(' ');
  },

  destroy () {
    if (this.teardown) this.teardown();
    this._super(...arguments);
  },

  setupRecompute (item) {
    if (this.teardown) this.teardown();

    item.addObserver('vetoed' , this, this.triggerRecompute);
    item.addObserver('confirmedAt' , this, this.triggerRecompute);
    item.addObserver('currentBlock' , this, this.triggerRecompute);
    item.addObserver('hasPendingChanges' , this, this.triggerRecompute);

    this.teardown = () => {
      item.removeObserver('vetoed', this, this.triggerRecompute);
      item.removeObserver('confirmedAt', this, this.triggerRecompute);
      item.removeObserver('currentBlock', this, this.triggerRecompute);
      item.removeObserver('hasPendingChanges', this, this.triggerRecompute);
    };
  },

  triggerRecompute () {
    once(this, this.recompute);
  }

});
