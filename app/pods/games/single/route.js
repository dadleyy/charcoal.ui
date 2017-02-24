import Ember from 'ember';

const { inject, Route } = Ember;

function model({ game_id }) {
  const table_delegate = this.get('table_delegate');
  const deferred = this.get('deferred');
  const sorting = { };
  const pagination = { size: 5 };
  const resolution = { table_delegate, sorting, pagination };
  const users = this.get('users_resource');

  function resolve(response) {
    resolution.users = response.results;
    let { table_delegate, ...others } = resolution;
    table_delegate.setProperties(others);
    return deferred.resolve(resolution);
  }

  function loadUsers(response) {
    let [ games_result, members_result ] = response;
    [ resolution.game ] = games_result.results;
    resolution.members = members_result.results;
    let user_ids = resolution.members.map(function({ user_id }) { return user_id; });
    return users.query({ where: { id: user_ids }}).then(resolve);
  }

  return deferred.all([
    this.get('game_resource').query({ where: { id: game_id } }),
    this.get('membership_resource').query({ where: { game_id } })
  ]).then(loadUsers);
}

export default Route.extend({ 
  deferred: inject.service(),
  game_resource: inject.service('games/resource'),
  membership_resource: inject.service('game-memberships/resource'),
  users_resource: inject.service('users/resource'),
  table_delegate: inject.service('delegates/game-display-table'),
  model 
});
