import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('about');
  this.route('login');

  this.route('auth', function() {
    this.route('callbacks', function() {
      this.route('google');
    });
  });

  this.route('dashboard');

  this.route('games', function() {
    this.route('single', { path: ':game_id' });
  });

  this.route('not-found',  { path: "/*path" });
});

export default Router;
