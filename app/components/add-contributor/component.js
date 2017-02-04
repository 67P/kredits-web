import Ember from 'ember';

export default Ember.Component.extend({

  id: null,
  realName: null,
  address: null,

  classId: function() {
    let value = this.get('id');
    return (Ember.isEmpty(value)) ? null : 'valid';
  }.property('id'),

  classRealName: function() {
    let value = this.get('realName');
    return (Ember.isEmpty(value)) ? null : 'valid';
  }.property('realName'),

  classAddress: function() {
    let value = this.get('address');
    return (Ember.isEmpty(value)) ? null : 'valid';
  }.property('address'),


  actions: {

    save() {
      console.log('id', this.get('id'));
      console.log('realName', this.get('realName'));
      console.log('address', this.get('address'));
    }

  }

});
