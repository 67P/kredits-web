import Ember from 'ember';

const {
  isPresent,
  isEmpty,
} = Ember;

export default Ember.Object.extend({

  id: null,
  creatorAddress: null,
  recipientAddress: null,
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
