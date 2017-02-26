import Ember from 'ember';

const { inject, Route } = Ember;

function model({ game_id }) {
  const table_delegate = this.get('table_delegate');
  const membership_manager = this.get('membership_manager');
  const round_manager = this.get('round_manager');
  const deferred = this.get('deferred');
  const resolution = { round_manager, table_delegate, membership_manager };

  let set = this.setProperties.bind(this);

  function refresh() {
    let updated = Date.now();
    table_delegate.set('state', { updated });
  }

  function resolve(response) {
    resolution.users = response.results;
    let { table_delegate, ...others } = resolution;
    let { game } = resolution;

    // give our manager + delegate context
    table_delegate.setProperties(others);
    membership_manager.setProperties({ game });
    round_manager.setProperties({ game });

    let subscriptions = {
      memberships: membership_manager.on('updated', refresh)
    };

    set({ subscriptions });

    return deferred.resolve(resolution);
  }

  function loadUsers(games_result) {
    [ resolution.game ] = games_result.results;
    membership_manager.set('game', resolution.game);
    return membership_manager.refresh().then(resolve);
  }

  return this.get('game_resource').query({ where: { id: game_id } }).then(loadUsers);
}

function deactivate() {
  this._super(...arguments);
  const { memberships } = this.get('subscriptions');
  this.get('membership_manager').off(memberships);
}

export default Route.extend({ 
  deferred           : inject.service(),
  game_resource      : inject.service('games/resource'),
  membership_manager : inject.service('game-memberships/manager'),
  round_manager      : inject.service('game-rounds/manager'),
  table_delegate     : inject.service('delegates/game-display-table'),
  model, deactivate
});
