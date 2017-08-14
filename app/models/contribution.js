import Ember from 'ember';

export default Ember.Object.extend({

  // blockNumber: null,
  // blockHash: null,
  // transactionHash: null,
  recipientAddress: null,
  contributorId: null,
  ipfsHash: null,
  amount: null,

  contribution: null,
  kind: null,
  description: null,
  url: null,
  details: null,

  /**
   * Loads the contribution details from IPFS and sets local instance
   * properties from it
   *
   * @method
   * @public
   */
  loadDetails(ipfs) {
    let promise = new Ember.RSVP.Promise((resolve, reject) => {
      ipfs.getFile(this.get('ipfsHash')).then(content => {
        let contributionJSON = JSON.parse(content);
        let contribution = Ember.Object.create(contributionJSON);

        this.setProperties({
          kind: contribution.get('kind'),
          description: contribution.get('description'),
          url: contribution.get('url')
        });

        // TODO load details
        // let details = profile.get('accounts');

        Ember.Logger.debug('[proposal] loaded contribution details', contributionJSON);
        resolve();
      }).catch((err) => {
        Ember.Logger.error('[proposal] error trying to load contribution details', this.get('ipfsHash'), err);
        reject(err);
      });
    });

    return promise;
  },

});
