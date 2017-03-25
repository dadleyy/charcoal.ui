import Ember from 'ember';

const { Service, inject } = Ember;

function rows({ pagination }) {
  const { size: limit, page } = pagination;
  const { game, manager, state } = this;
  const resolution = { rows: [{ empty: true }] };

  const deferred = this.get('deferred');
  const membership_resource = this.get('memberships');
  let { query } = state || { };

  let where = { };

  const signals = () => {
    this.set('state', { updated: Date.now() });
  };

  function toRow(user) {
    let [ member ] = resolution.memberships.filter(function({ user_id }) { return user_id === user.id; });
    return { manager, user, game, member, signals };
  }

  function finish(response) {
    let { results } = response;
    resolution.memberships = results;
    resolution.rows = resolution.users.map(toRow);
    return deferred.resolve(resolution);
  }

  function resolve(response) {
    let { meta, results } = response;
    let { count } = meta;

    if(count >= 1 === false) {
      return deferred.resolve(resolution);
    }

    let user_ids = results.map(function({ id }) { return id; });

    resolution.users = results;
    resolution.count = count;
    let where = { user_id: user_ids, game_id: game.id, status: 'ACTIVE' };
    return membership_resource.query({ where }).then(finish);
  }

  if(query && query.user) {
    where.name = { like: query.user };
  }

  return this.get('users').query({ limit, page, where }).then(resolve);
}

function columns() {
  const i18n = this.get('i18n');
  return [
    { text: i18n.t('user_id'), rel: 'id', style: 'width: 120px' },
    { text: i18n.t('name'), rel: 'game.status', style: 'width: 100%' },
    { rel: 'actions', style: 'width: 200px' }
  ];
}

function sizes() { return [5, 10, 20]; }

export default Service.extend({ 
  i18n: inject.service(),
  deferred: inject.service(),
  users: inject.service('users/resource'),
  memberships: inject.service('game-memberships/resource'),
  rows, columns, sizes
});
