import Controller from '@ember/controller';
import config from 'kredits-web/config/environment';

export default Controller.extend({

  actions: {

    connectGithub () {
      window.location = config.githubConnectUrl;
    }

  }

});
