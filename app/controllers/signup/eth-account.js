import Controller from '@ember/controller';
import { not, notEmpty } from '@ember/object/computed';
// import { computed } from '@ember/object';

export default Controller.extend({

  ethAddress: null,

  // TODO address validation
  isValidEthAccount: notEmpty('ethAddress'),
  signupButtonDisabled: not('isValidEthAccount')

});
