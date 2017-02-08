import Ember from 'ember';

export default Ember.Component.extend({

  id: null,
  realName: null,
  address: null,
  ipfsHash: null,
  isCore: true,

  inProgress: false,

  isValidId: function() {
    return Ember.isPresent(this.get('id'));
  }.property('id'),

  isValidRealName: function() {
    return Ember.isPresent(this.get('realName'));
  }.property('realName'),

  isValidAddress: function() {
    return this.get('kredits.web3Instance').isAddress(this.get('address'));
  }.property('address'),

  isValid: function() {
    return this.get('isValidId') && this.get('isValidRealName') && this.get('isValidAddress');
  }.property('isValidAddress', 'isValidId', 'isValidRealName'),

  reset: function() {
    this.setProperties({
      id: null,
      realName: null,
      address: null,
      ipfsHash: null,
      isCore: true,
      inProgress: false
    });

  },

  actions: {

    save() {
      if (!this.get('contractInteractionEnabled')) {
        alert('Only core team members can add new contributors. Please ask someone to set you up.');
        return;
      }

      if (this.get('isValid')) {
        this.set('inProgress', true);

        this.get('kredits').addContributor(
          this.get('address'),
          this.get('realName'),
          '', // TODO: this.get('ipfsHash')
          this.get('isCore'),
          this.get('id')
        ).then(contributor => {
          this.reset();
          this.get('contributors').pushObject(contributor);
          window.scroll(0,0);
        });
      } else {
        alert('Invalid data. Please review and try again.');
      }
    }

  }

});
