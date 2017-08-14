import Ember from 'ember';

const {
  isPresent,
  isEmpty,
} = Ember;

export default Ember.Object.extend({

  id: null,
  creatorAddress: null,
  recipientAddress: null,
  recipientId: null,
  recipientName: null,
  recipientProfile: null,
  votesCount: null,
  votesNeeded: null,
  amount: null,
  executed: null,
  contribution: null,
  kind: null,
  description: null,
  url: null,
  details: null,
  ipfsHash: null,

  /**
   * Loads the contribution details from IPFS and sets local instance
   * properties from it
   *
   * @method
   * @public
   */
  loadContribution(ipfs) {
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

  /**
   * Creates a JSON-LD object of the contribution, according to
   * https://github.com/67P/kosmos-schemas/blob/master/schemas/contribution.json
   *
   * @method
   * @public
   */
  contributionToJSON() {
    if (isEmpty(this.get('recipientProfile'))) {
      throw new Error('IPFS hash for recipient profile missing from proposal object');
    }
    if (isEmpty(this.get('kind')) || isEmpty(this.get('description'))) {
      throw new Error('Missing one or more required properties: kind, description');
    }

    let contribution = {
      "@context": "https://schema.kosmos.org",
      "@type": "Contribution",
      "contributor": {
        "ipfs": this.get('recipientProfile')
      },
      "kind": this.get('kind'),
      "description": this.get('description'),
      "details": {}
    };

    if (isPresent(this.get('url'))) {
      contribution["url"] = this.get('url');
    }

    return contribution;
  },

  /**
   * Returns the JSON-LD representation of the contribution as a string
   *
   * @method
   * @public
   */
  serializeContribution() {
    return JSON.stringify(this.contributionToJSON());
  }

});
