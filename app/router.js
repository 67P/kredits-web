import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('proposals', function() {
    this.route('new');
  });
  this.route('contributions', function() {
    this.route('new');
  });
  this.route('contributors', function() {
    this.route('new');
    this.route('edit', { path: ':id/edit' });
  });
});

export default Router;
