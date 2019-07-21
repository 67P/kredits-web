import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('dashboard', function() {
    this.route('contributors', function() {
      this.route('show', { path: ':id' });
    });

    this.route('contributions', function() {
      this.route('show', { path: ':id' });
    });
  });
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
  this.route('signup', function() {
    this.route('eth-account');
  });
});

export default Router;
