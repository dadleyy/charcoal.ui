import Ember from 'ember';
import RequiredAuth from 'charcoal/mixins/require-authentication-route';
import TrackedRoute from 'charcoal/mixins/tracked-route';

const { Route, inject } = Ember;

function model() {
  const user = this.get('auth.user');
  const manager = this.get('manager');
  const deferred = this.get('deferred');

  function resolve() {
    return deferred.resolve({ manager });
  }

  return manager.load(user.id).then(resolve);
}

export default Route.extend(RequiredAuth, TrackedRoute, {
  manager: inject.service('users/account-manager'),
  model
});
