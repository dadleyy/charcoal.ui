import Ember from 'ember';
import AuthenticatedRoute from 'charcoal/mixins/authenticated-route';

const { inject } = Ember;

const auth = inject.service('auth');

function model() {
  const { flags } = this.get('auth');

  if(flags.guest) {
    return this.replaceWith('login');
  }

  return auth;
}

export default Ember.Route.extend(AuthenticatedRoute, { auth, model });

