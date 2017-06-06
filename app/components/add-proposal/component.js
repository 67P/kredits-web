import Ember from 'ember';

const {
  Component,
  inject: {
    service
  },
  computed
} = Ember;

export default Component.extend({

  kredits: service(),

  proposal: null,
  inProgress: false,

  isValidRecipient: computed('proposal.recipientAddress', function() {
    return this.get('kredits.web3').isAddress(this.get('proposal.recipientAddress'));
  }),

  isValidAmount: computed('proposal.amount', function() {
    // TODO
    return true;
  }),

  isValidUrl: computed('proposal.url', function() {
    // TODO
    return true;
  }),

  isValidIpfsHash: computed('proposal.ipfsHash', function() {
    // TODO
    return true;
  }),

  isValid: computed.and('isValidRecipient', 'isValidAmount', 'isValidUrl',
                        'isValidIpfsHash'),

  actions: {
    save() {
      if (this.get('isValid')) {
        this.set('inProgress', true);

        this.get('kredits').addProposal(this.get('proposal'))
          .then(() => {
            this.attrs.onSave();
          }).catch((error) => {
            Ember.Logger.error('Error creating the proposal', error);
            alert('Something went wrong.');
          }).finally(() => {
            this.set('inProgress', false);
          });
      } else {
        alert('Invalid data. Please review and try again.');
      }
    }
  }

});
