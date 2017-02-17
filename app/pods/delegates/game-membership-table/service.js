import Ember from 'ember';
import ENV from 'charcoal/config/environment';

const { inject } = Ember;
const { API_HOME } = ENV;

function columns() {
  const i18n = this.get('i18n');
  return [
    { text: i18n.t('game_id'), rel: 'id', style: 'width: 50%' },
    { text: i18n.t('created'), rel: 'created', style: 'width: 50%' },
    { rel: 'actions', style: 'width: 120px' }
  ];
}

function rows({ pagination, sorting }) {
  const { current: page } = pagination;
  const deferred = this.get('deferred');

  function finish(result) {
    const { count } = result.meta;

    if(count === 0) {
      let rows = [{ empty: true }];
      return deferred.resolve({ rows, count });
    }

    let rows = result.results.map(function(membership) { return { membership }; });
    return deferred.resolve({ rows, count });
  }

  return this.get('ajax').request(`${API_HOME}/game_memberships`).then(finish);
}

function sizes() {
  return [5, 10, 20];
}

export default Ember.Service.extend({
  i18n: inject.service(),
  ajax: inject.service(),
  deferred: inject.service(),
  columns, rows, sizes
});
