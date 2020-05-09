import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

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
    this.route('new', { queryParams: ['contributorId', 'kind', 'amount'] });
    this.route('resubmit', { path: ':id/resubmit' });
  });
  this.route('contributors', function() {
    this.route('new');
    this.route('edit', { path: ':id/edit' });
  });
  this.route('signup', function() {
    this.route('github');
    this.route('eth-account');
    this.route('complete');
  });
});
