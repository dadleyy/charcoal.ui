import Ember from 'ember';
import AuthenticatedRoute from 'charcoal/mixins/authenticated-route';

const { inject } = Ember;

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

function destroyed() {
  const { subscriptions } = this;
  console.log(subscriptions);
}

export default Ember.Route.extend(AuthenticatedRoute, { 
  signup_delegate: inject.service('delegates/signup'),
  model, destroyed
});
