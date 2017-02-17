import Ember from 'ember';
import RequiredAuth from 'charcoal/mixins/require-authentication-route';

const { inject } = Ember;

function model() {
  const user = this.get('auth.user');
  const table_delegate = this.get('table_delegate');
  const pagination = { };
  const sorting = { };
  return this.get('deferred').resolve({ user, table_delegate, pagination, sorting });
}

export default Ember.Route.extend(RequiredAuth, {
  table_delegate: inject.service('delegates/game-membership-table'),
  model
});
