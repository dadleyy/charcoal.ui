import Ember from 'ember';
import RequiredAuth from 'charcoal/mixins/require-authentication-route';
import TrackedRoute from 'charcoal/mixins/tracked-route';

const { Route, inject } = Ember;

function model() {
  const user = this.get('auth.user');
  const table_delegate = this.get('table_delegate');
  const pagination = { size: 5 };
  const sorting = { };
  return this.get('deferred').resolve({ user, table_delegate, pagination, sorting });
}

function titleToken() { return this.get('i18n').t('dashboard'); }

export default Route.extend(TrackedRoute, RequiredAuth, {
  i18n: inject.service(),
  table_delegate: inject.service('delegates/game-membership-table'),
  model, titleToken
});
