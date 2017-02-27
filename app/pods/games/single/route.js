import Ember from 'ember';

const { run, inject, Route } = Ember;

function model({ game_id }) {
  const table_delegate = this.get('table_delegate');
  const membership_manager = this.get('membership_manager');
  const round_manager = this.get('round_manager');
  const deferred = this.get('deferred');
  const sorting = { rel: 'created_at' };
  const resolution = { round_manager, table_delegate, sorting, membership_manager };

  let set = this.setProperties.bind(this);
  let get = this.get.bind(this);

  function refresh() {
    let updated = Date.now();

    if(get('resolved') === true) {
      table_delegate.set('state', { updated });
    }
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

    run.next(null, set, { resolved: true });
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
