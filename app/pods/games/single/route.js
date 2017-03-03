import Ember from 'ember';
import RequiredAuth from 'charcoal/mixins/require-authentication-route';
import TrackedRoute from 'charcoal/mixins/tracked-route';

const { run, inject, Route } = Ember;

function model({ game_id }) {
  const table_delegate = this.get('table_delegate');
  const membership_manager = this.get('membership_manager');
  const round_manager = this.get('round_manager');
  const deferred = this.get('deferred');
  const analytics = this.get('analytics');
  const sorting = { rel: 'created_at' };
  const resolution = { round_manager, table_delegate, sorting, membership_manager };

  const transition = run.bind(this, this.transitionTo);
  const set = run.bind(this, this.setProperties)
  const get = run.bind(this, this.get);

  function refresh() {
    let updated = Date.now();

    if(get('resolved') !== true) {
      return;
    }

    table_delegate.set('state', { updated });
  }

  function failed() {
    return transition('index');
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
      memberships: membership_manager.on('updated', refresh),
      rounds: round_manager.on('updated', refresh)
    };

    set({ subscriptions });

    analytics.track({ category: 'games', action: 'loaded', label: resolution.game.uuid });
    run.next(null, set, { resolved: true });
    return deferred.resolve(resolution);
  }

  function loadUsers(games_result) {
    [ resolution.game ] = games_result.results;

    if(!resolution.game) {
      return transition('index');
    }

    membership_manager.set('game', resolution.game);
    return membership_manager.refresh().then(resolve);
  }

  return this.get('game_resource').query({ where: { uuid: game_id } }).then(loadUsers).catch(failed);
}

function deactivate() {
  this._super(...arguments);
  const { rounds, memberships } = this.get('subscriptions');

  this.get('membership_manager').off(memberships);
  this.get('round_manager').off(rounds);
}

export default Route.extend(RequiredAuth, TrackedRoute, {
  deferred           : inject.service(),
  game_resource      : inject.service('games/resource'),
  membership_manager : inject.service('game-memberships/manager'),
  round_manager      : inject.service('game-rounds/manager'),
  table_delegate     : inject.service('delegates/game-display-table'),
  model, deactivate
});
