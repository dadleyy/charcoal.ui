import Ember from 'ember';

const { inject, Service } = Ember;

function columns() {
  const i18n = this.get('i18n');
  let users = this.get('membership_manager.users');
  let width = users && users.length ? (100 / users.length) : 0;

  function toColumn(user) {
    const style = `width: ${width}%`;
    return { text: user.name, rel: `user-${user.id}`, sortable: false, user, style, align: 'center' };
  }

  let result = users.map(toColumn);
  return [{ text: i18n.t('round_id'), rel: 'id', style: 'width: 120px', align: 'center'}].concat(result);
}

function rows({ pagination }) {
  const { id: game_id } = this.get('game');
  const deferred = this.get('deferred');
  const round_resource = this.get('rounds');
  const users = this.get('membership_manager.users');

  const { size: limit, page } = pagination;

  let c = columns.call(this);
  let rows = [{ empty: true, columns: c }];

  const signals = function() {
    let updated = Date.now();
    this.set('state', { updated });
  }.bind(this);

  function toRow(round) {
    let [ asshole ] = users.filter(function({ id }) { return id === round.asshole_id; });
    let [ president ] = users.filter(function({ id }) { return id === round.president_id; });
    let [ vice_president ] = users.filter(function({ id }) { return id === round.vice_president_id; });
    return { round, asshole, president, vice_president, columns: c, signals };
  }

  function resolve({ results, meta }) {
    const { count } = meta;

    if(count === 0) {
      return deferred.resolve({ rows });
    }

    rows = results.map(toRow);
    return deferred.resolve({ rows, count });
  }

  return round_resource.query({ limit, page, where: { game_id } }).then(resolve);
}

function init() {
  this._super(...arguments);
  this.set('cache', { rounds: [ ] });
}

function sizes() { return [5,10,20]; }

export default Service.extend({ 
  deferred: inject.service(),
  rounds: inject.service('game-rounds/resource'),
  i18n: inject.service(),
  sizes, columns, rows, init
});
