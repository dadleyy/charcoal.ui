import Ember from 'ember';
import Events from 'charcoal/mixins/event-handles';

const { run, Service, inject } = Ember;

function init() {
  this._super(...arguments);
  this.setProperties({ users: [], memberships: [] });
}

async function refresh() {
  const { game } = this;
  const deferred = this.get('deferred');

  if(!game) {
   throw new Error("must provide game first!");
  }

  const users_resource = this.get('users_resource');
  const membership_resource = this.get('membership_resource');
  const history_resource = this.get('history_resource');

  const [ membership_response, history_response ] = await deferred.all([
    membership_resource.query({ where: { game_id: game.id } }),
    history_resource.query({ where: { game_id: game.id } })
  ]);

  const { results: memberships } = membership_response;
  const { results: history } = history_response;
  let user_ids = memberships.map(function({ user_id }) { return user_id; });
  const { results: users } = await users_resource.query({ where: { id: user_ids } });
  run.next(this, this.trigger, 'updated');
  this.setProperties({ users, memberships, history });
}

function add(user_id) {
  const { game } = this;
  const memberships = this.get('membership_resource');
  return memberships.create({ game_id: game.id, user_id }).then(refresh.bind(this));
}

export default Service.extend(Events, {
  deferred: inject.service(),
  membership_resource: inject.service('game-memberships/resource'),
  history_resource: inject.service('game-membership-history/resource'),
  users_resource: inject.service('users/resource'),
  add, init, refresh
});
