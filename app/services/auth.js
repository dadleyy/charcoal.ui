import Ember from 'ember';
import ENV from 'charcoal/config/environment';

const { API_HOME } = ENV;
const { run, inject } = Ember;

const AUTH_ENDPOINT = `${API_HOME}/auth/user`;

function register(response) {
  const deferred = this.get('deferred');
  const { meta } = response;
  const { user, client } = meta || {};
  const { flags } = this;

  if(user && client) {
    flags.guest = false;
    this.set('user', user);
    this.set('client', client);
    return deferred.resolve(true);
  }

  return deferred.reject();
}

function prepare() {
  const deferred = this.get('deferred');
  const flags = this.get('flags');
  const success = register.bind(this);
  const set = run.bind(this, this.set);

  if(flags.loaded) {
    return this.get('deferred').resolve();
  }

  function failed() {
    set('flags', { ...flags, guest: true });
    return deferred.resolve();
  }

  function finished() {
    set('flags', { ...flags, loaded: true });
    return deferred.resolve({ flags });
  }

  return this.get('ajax').request(AUTH_ENDPOINT)
    .then(success)
    .catch(failed)
    .finally(finished);
}

function init() {
  this._super(...arguments);
  this.set('flags', { loaded: false });
}

function attempt(token) {
  const data = { token };
  const deferred = this.get('deferred');
  const success = register.bind(this);

  function failed() {
    return deferred.reject();
  }

  return this.get('ajax').request(AUTH_ENDPOINT, { data }).then(success).catch(failed);
}

export default Ember.Service.extend({ 
  ajax: inject.service(), deferred: inject.service(),
  init, prepare, attempt
});
