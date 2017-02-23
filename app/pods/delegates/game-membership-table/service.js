import Ember from 'ember';
import ENV from 'charcoal/config/environment';

const { inject, run } = Ember;
const { API_HOME } = ENV;

function columns() {
  const i18n = this.get('i18n');
  return [
    { text: i18n.t('game_id'), rel: 'id', style: 'width: 120px' },
    { text: i18n.t('status'), rel: 'game.status', style: 'width: 20%' },
    { text: i18n.t('created_by'), rel: 'game.owner', style: 'width: 35%' },
    { text: i18n.t('created'), rel: 'created', style: 'width: 35%' },
    { rel: 'actions', style: 'width: 80px' }
  ];
}

function rows({ pagination, sorting }) {
  const { size: limit, page } = pagination;

  const ajax = this.get('ajax');
  const deferred = this.get('deferred');
  const { games, memberships, users } = this.get('cache');

  let count = 0;

  let signals = () => {
    run.next(this, function() { this.set('state', { updated: Date.now() }); });
  };

  function toRow(membership) {
    let [ game ] = games.filter(function({ id }) { return id === membership.game_id; });
    let [ owner ] = game ? users.filter(function({ id }) { return id === game.owner_id; }) : [ ];
    return { membership, game, owner, signals };
  }

  function finish({ results }) {
    users.replace(0, users.length, results);
    let rows = memberships.map(toRow);
    return deferred.resolve({ rows, count });
  }

  function loadOwners({ results }) {
    games.replace(0, games.length, results);
    let owners = games.map(function({ owner_id }) { return owner_id; }).uniq();
    let data = { "filter[id]": `in(${owners.join()})` };
    return ajax.request(`${API_HOME}/users`, { data }).then(finish);
  }

  function loadGames(result) {
    count = Ember.get(result, 'meta.count');

    if(count === 0) {
      let rows = [{ empty: true }];
      return deferred.resolve({ rows, count });
    }

    memberships.replace(0, memberships.length, result.results);
    let game_ids = memberships.map(function({ game_id }) { return game_id; });
    let data = { "filter[id]": `in(${game_ids.join()})` };

    return ajax.request(`${API_HOME}/games`, { data }).then(loadOwners);
  }

  let data = { limit, page, sort: sorting.rel };
  return ajax.request(`${API_HOME}/game-memberships`, { data }).then(loadGames);
}

function init() {
  this.set('cache', { games: [ ], memberships: [ ], users: [ ] });
}

function sizes() {
  return [5, 10, 20];
}

export default Ember.Service.extend({
  i18n: inject.service(),
  ajax: inject.service(),
  deferred: inject.service(),
  columns, rows, sizes, init
});
