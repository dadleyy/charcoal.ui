import Ember from 'ember';
import AuthenticatedRoute from 'charcoal/mixins/authenticated-route';
import TrackedRoute from 'charcoal/mixins/tracked-route';

const { inject, Route } = Ember;

const auth = inject.service('auth');

function model() {
  const auth = this.get('auth');
  const { flags } = auth;

  if(flags.guest === false) {
    return this.replaceWith('index');
  }

  const signup_delegate = this.get('signup_delegate');
  const subscriptions = { signup: signup_delegate.on('saved', login) };
  const transition = this.transitionTo.bind(this);

  function redirect() {
    transition('index');
  }

  function login(user_response) {
    const { meta } = user_response;
    return auth.attempt(meta.token).then(redirect);
  }

  this.setProperties({ subscriptions });

  return this.get('deferred').resolve({ signup_delegate });
}

function deactivate() {
  const { subscriptions } = this;
  this.get('signup_delegate').off(subscriptions.signup);
}

export default Route.extend(TrackedRoute, AuthenticatedRoute, { 
  signup_delegate: inject.service('delegates/signup'),
  model, deactivate
});
