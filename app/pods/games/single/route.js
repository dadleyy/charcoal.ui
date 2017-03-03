import Ember from 'ember';
import RequiredAuth from 'charcoal/mixins/require-authentication-route';
import TrackedRoute from 'charcoal/mixins/tracked-route';

const { run, inject, Route } = Ember;

function model({ game_id }) {
  const table_delegate = this.get('table_delegate');
  const manager = this.get('manager');
  const deferred = this.get('deferred');
  const analytics = this.get('analytics');

  const sorting = { rel: 'created_at' };
  const resolution = { table_delegate, sorting, manager };

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

  function failed(err) {
    console.error(err);
    return transition('index');
  }

  function resolve({ members, game, rounds }) {
    let { table_delegate } = resolution;

    // give our manager + delegate context
    table_delegate.setProperties({ members, game, rounds });

    let subscriptions = { manager: manager.on('updated', refresh) };
    set({ subscriptions });

    analytics.track({ category: 'games', action: 'loaded', label: game.uuid });
    run.next(null, set, { resolved: true });
    return deferred.resolve({ game, members, rounds, ...resolution });
  }

  return this.get('manager').load(game_id).then(resolve).catch(failed);
}

function deactivate() {
  this._super(...arguments);
  const { subscriptions } = this;
  this.get('manager').off(subscriptions.manager);
}

export default Route.extend(RequiredAuth, TrackedRoute, {
  deferred       : inject.service(),
  manager        : inject.service('games/manager'),
  members        : inject.service('game-memberships/manager', { singleton: false }),
  table_delegate : inject.service('delegates/game-display-table'),
  model, deactivate
});
