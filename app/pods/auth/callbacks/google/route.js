import Ember from 'ember';
import TrackedRoute from 'charcoal/mixins/tracked-route';

const { inject, Route } = Ember;

function beforeModel(transition) {
  const { queryParams: params } = transition;
  const auth = this.get('auth');
  const replace = this.replaceWith.bind(this);

  if(!params.token) {
    return this.replaceWith('login');
  }

  function failed() {
    return replace('login');
  }

  function success() {
    return replace('dashboard');
  }

  const { token } = params;
  return auth.attempt(token).then(success).catch(failed);
}

export default Route.extend(TrackedRoute, {
  auth: inject.service(),
  beforeModel
});

