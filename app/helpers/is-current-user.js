import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { isPresent } from '@ember/utils';

export default Helper.extend({

  kredits: service(),
  currentUser: alias('kredits.currentUser'),

  compute([contributor]) {
    return isPresent(contributor) && isPresent(this.currentUser) &&
            contributor.account === this.currentUser.account;
  }

});
