import Ember from 'ember';

const { inject } = Ember;

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
    return replace('about');
  }

  const { token } = params;
  return auth.attempt(token).then(success).catch(failed);
}

export default Ember.Route.extend({ auth: inject.service(), beforeModel });

