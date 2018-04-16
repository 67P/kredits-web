import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('spinner');
  this.route('proposals', function() {
    this.route('new');
  });
});

export default Router;
