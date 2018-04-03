import Ember from 'ember';

const {
  Component,
  isPresent,
  inject: {
    service
  },
  computed
} = Ember;

export default Component.extend({

  kredits: service(),

  proposal: null,
  contributors: null,
  inProgress: false,

  isValidRecipient: computed('proposal.recipientAddress', function() {
    // TODO: add proper address validation
    return this.get('proposal.recipientAddress') !== ''
  }),

  isValidAmount: computed('proposal.amount', function() {
    return parseInt(this.get('proposal.amount'), 10) > 0;
  }),

  isValidUrl: computed('proposal.url', function() {
    return isPresent(this.get('proposal.url'));
  }),

  isValidDescription: computed('proposal.description', function() {
    return isPresent(this.get('proposal.description'));
  }),

  isValid: computed.and('isValidRecipient',
                        'isValidAmount',
                        'isValidDescription'),

  actions: {
    save() {
      if (! this.get('isValid')) {
        alert('Invalid data. Please review and try again.');
        return false;
      }
      this.set('inProgress', true);
      let proposal = this.get('proposal');

      // Set the recipient's IPFS profile hash so it can be used in the
      // contribution object (which is to be stored in IPFS as well)
      let contributor = this.get('contributors').findBy('address', proposal.get('recipientAddress'));
      proposal.set('recipientProfile', contributor.get('ipfsHash'));

      this.get('kredits').addProposal(proposal)
        .then(() => {
          this.attrs.onSave();
        }).catch((error) => {
          Ember.Logger.error('[add-proposal] error creating the proposal', error);
          alert('Something went wrong.');
        }).finally(() => {
          this.set('inProgress', false);
        });
    }
  }

});
