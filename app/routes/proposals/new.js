import Ember from 'ember';
import Proposal from 'kredits-web/models/proposal';

export default Ember.Route.extend({

  model(params) {
    return Proposal.create({
      recipientAddress: params.recipient,
      amount: params.amount,
      url: params.url,
      ipfsHash: params.ipfsHash
    });
  }

});
