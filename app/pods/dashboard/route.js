import Ember from 'ember';
import RequiredAuth from 'charcoal/mixins/require-authentication-route';

function model() {
  const user = this.get('auth.user');
  return this.get('deferred').resolve({ user });
}

export default Ember.Route.extend(RequiredAuth, { model });
