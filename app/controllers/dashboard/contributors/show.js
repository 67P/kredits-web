import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({

  roleName: computed('model.isCore', 'totalKreditsEarned', function() {
    if (this.model.isCore) return 'Core Contributor';
    if (this.model.totalKreditsEarned <= 5000) return 'Newcomer';
    return 'Contributor';
  })

});
