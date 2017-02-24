import Ember from 'ember';

const { inject, Route } = Ember;

function model({ game_id }) {
  const table_delegate = this.get('table_delegate');
  const membership_manager = this.get('membership_manager');
  const deferred = this.get('deferred');
  const sorting = { };
  const pagination = { size: 5 };
  const resolution = { table_delegate, sorting, pagination, membership_manager };

  function resolve(response) {
    resolution.users = response.results;
    let { table_delegate, ...others } = resolution;

    // give our manager + delegate context
    table_delegate.setProperties(others);
    membership_manager.setProperties({ game: resolution.game });

    return deferred.resolve(resolution);
  }

  function loadUsers(games_result) {
    [ resolution.game ] = games_result.results;
    membership_manager.set('game', resolution.game);
    return membership_manager.refresh().then(resolve);
  }

  membership_manager.on('updated', () => { table_delegate.set('state', { updated: Date.now() }); });

  return this.get('game_resource').query({ where: { id: game_id } }).then(loadUsers);
}

function deactivate() {
  this._super(...arguments);
}

export default Route.extend({ 
  deferred           : inject.service(),
  game_resource      : inject.service('games/resource'),
  membership_manager : inject.service('game-memberships/manager'),
  table_delegate     : inject.service('delegates/game-display-table'),
  model, deactivate
});
