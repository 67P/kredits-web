import Ember from 'ember';
import ipfsAPI from 'npm:ipfs-api';
import config from 'kredits-web/config/environment';

export default Ember.Service.extend({

  ipfsInstance: null,

  ipfs: function() {
    if (this.get('ipfsInstance')) {
      return this.get('ipfsInstance');
    }
    let ipfs = ipfsAPI(config.ipfs);
    this.set('ipfsInstance', ipfs);
    return ipfs;
  }.property('ipfsInstance'),

  storeFile(content) {
    let ipfs = this.get('ipfs');
    return ipfs.add(new ipfs.Buffer(content)).then(res => {
      Ember.Logger.debug('[ipfs] stored content in IPFS', content, res[0].hash);
      return res[0].hash;
    });
  },

  getFile(hash) {
    return this.get('ipfs').cat(hash, { buffer: true }).then(res => {
      return res.toString();
    }, err => {
      Ember.Logger.error('[ipfs] error trying to fetch file', hash, err);
      return err;
    });
  }

});
