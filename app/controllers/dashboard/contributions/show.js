
import Controller from '@ember/controller';
import { computed } from '@ember/object';
import config from 'kredits-web/config/environment';

export default Controller.extend({

  ipfsGatewayUrl: computed(function() {
    return config.ipfs.gatewayUrl;
  })

});
