import Controller from '@ember/controller';
import { action } from '@ember/object';
import config from 'kredits-web/config/environment';

export default class IndexController extends Controller {

  @action
  connectGithub () {
    window.location = config.githubConnectUrl;
  }

}
