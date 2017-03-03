import Ember from 'ember';
import Events from 'charcoal/mixins/event-handles';

const { run, Service, inject } = Ember;

function init() {
  this._super(...arguments);
  this.setProperties({ users: [], memberships: [] });
}

function refresh() {
  const { game } = this;
  const deferred = this.get('deferred');

  if(!game) {
    return deferred.reject(new Error("must provide game first!"))
  }

  const users_resource = this.get('users_resource');
  const membership_resource = this.get('membership_resource');

  const set = this.set.bind(this);
  const trigger = this.trigger.bind(this, 'updated');

  function refreshed({ results }) {
    run.next(null, trigger);
    set('users', results);
    return deferred.resolve(true);
  }

  function loadUsers({ results }) {
    set('memberships', results);
    let user_ids = results.map(function({ user_id }) { return user_id; });
    return users_resource.query({ where: { id: user_ids } }).then(refreshed);
  }

  return membership_resource.query({ where: { game_id: game.id } }).then(loadUsers);
}

function add(user_id) {
  const { game } = this;
  const memberships = this.get('membership_resource');
  return memberships.create({ game_id: game.id, user_id }).then(refresh.bind(this));
}

export default Service.extend(Events, {
  deferred: inject.service(),
  membership_resource: inject.service('game-memberships/resource'),
  users_resource: inject.service('users/resource'),
  add, init, refresh
});
