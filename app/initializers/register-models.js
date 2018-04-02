import Contributor from 'kredits-web/models/contributor';
import Proposal from 'kredits-web/models/proposal';

export default {
  name: 'register-models',
  initialize: function(app) {
    app.register('model:contributor', Contributor, { singleton: false });
    app.register('model:proposal', Proposal, { singleton: false });
  }
};
