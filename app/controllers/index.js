import Ember from 'ember';

const {
  computed
} = Ember;

export default Ember.Controller.extend({

  contributorsCount: computed('model.contributors.[]', function() {
    return this.get('model.contributors').length;
  }),

  kreditsSum: computed('model.contributors.[]', function() {
    let kredits = this.get('model.contributors').mapBy('kredits');
    return kredits.reduce(function(previousValue, currentValue) {
      return currentValue + previousValue;
    });
  })

});
