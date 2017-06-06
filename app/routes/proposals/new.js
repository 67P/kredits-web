import Ember from 'ember';
import Proposal from 'kredits-web/models/proposal';

const {
  Route,
  RSVP,
  inject: {
    service
  }
} = Ember;

export default Route.extend({

  kredits: service(),

  model(params) {
    const proposal = Proposal.create({
      recipientAddress: params.recipient,
      amount: params.amount,
      url: params.url,
      kind: params.kind || 'dev',
      ipfsHash: params.ipfsHash
    });

    return RSVP.hash({
      proposal,
      contributors: this.get('kredits').getContributors()
    });
  },

  setupController(controller, model) {
    this._super(controller, model.proposal);

    controller.set('contributors', model.contributors);
  }

});
