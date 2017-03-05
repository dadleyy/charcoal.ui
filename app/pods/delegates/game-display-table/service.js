import Ember from 'ember';

const { inject, Service } = Ember;
const ENDED_STATUS = 'ENDED';

function columns() {
  const i18n = this.get('i18n');
  let users = this.get('members.users');
  let width = users && users.length ? (100 / users.length) : 0;

  function toColumn(user) {
    const style = `width: ${width}%`;
    return { text: user.name, rel: `user-${user.id}`, sortable: false, user, style, align: 'center' };
  }

  const id_column = {
    text: i18n.t('round_no'),
    rel: 'created_at',
    style: 'width: 140px',
    align: 'center',
    sortable: true
  };

  const menu_column = { rel: 'menu', style: 'width: 120px', align: 'center' };
  let result = users.map(toColumn);
  return [ id_column ].concat(result).concat([ menu_column ]);
}

function rows({ pagination, sorting }) {
  const { id: game_id, status } = this.get('game');
  const { members: membership_manager, rounds: round_manager } = this;

  const deferred = this.get('deferred');
  const round_resource = this.get('round_resource');

  let count = null;

  const { size: limit, page } = pagination;

  let c = columns.call(this);
  let rows = status === ENDED_STATUS ? [{ aborted: true, columns: c }] : [{ empty: true, columns: c }];

  const signals = function() {
    let updated = Date.now();
    this.set('state', { updated });
  }.bind(this);

  const start = (page || 0) * limit;

  function toRow(round, index) {
    let number = sorting.order ? (start + index + 1) : count - (index + start);
    let { users } = membership_manager;
    let [ asshole ] = users.filter(function({ id }) { return id === round.asshole_id; });
    let [ president ] = users.filter(function({ id }) { return id === round.president_id; });
    let [ vice_president ] = users.filter(function({ id }) { return id === round.vice_president_id; });
    return { round_manager, number, round, asshole, president, vice_president, columns: c, signals };
  }

  function resolve({ results, meta }) {
    count = meta.count;

    if(count === 0) {
      return deferred.resolve({ rows });
    }

    rows = results.map(toRow);
    return deferred.resolve({ rows, count });
  }

  let sort_order = sorting.order ? 'asc' : 'desc';
  let sort_on = 'created_at';
  return round_resource.query({ limit, page, sort_order, sort_on, where: { game_id } }).then(resolve);
}

function init() {
  this._super(...arguments);
  this.set('cache', { rounds: [ ] });
}

function sizes() { return [ 5, 10, 20 ]; }

export default Service.extend({ 
  deferred: inject.service(),
  round_resource: inject.service('game-rounds/resource'),
  i18n: inject.service(),
  sizes, columns, rows, init
});
