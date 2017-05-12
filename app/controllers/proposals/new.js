import Ember from 'ember';
import QueryParams from 'ember-parachute';

export const queryParams = new QueryParams({
  recipient: {
    defaultValue: ''
  },
  amount: {
    defaultValue: ''
  },
  url: {
    defaultValue: ''
  },
  ipfsHash: {
    defaultValue: ''
  }
});

export default Ember.Controller.extend(queryParams.Mixin, {

  actions: {
    onSave() {
      this.transitionToRoute('index');
    }
  }

});
