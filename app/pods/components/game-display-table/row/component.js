import Ember from 'ember';

const { inject, computed, Component } = Ember;
const tagName = 'tbody';
const ENDED_STATUS = 'ENDED';

const userColumns = computed(function() {
  let { round } = this.get('row');
  let columns = this.get('row.columns').filter(function({ user }) { return !!user; });
  let result = [ ];

  for(let i = 0, c = columns.length; i < c; i++) {
    let { user } = columns[i];
    let asshole = user.id === round.asshole_id;
    let president = user.id === round.president_id;
    let vice_president = user.id === round.vice_president_id;
    let unranked = !asshole && !president && !vice_president;
    result.push({ unranked, asshole, president, vice_president, user });
  }

  return result;
});

function update(role_data) {
  const { signals, round } = this.get('row');
  const rounds = this.get('rounds');
  const finish = signals.bind(null, 'updated');
  const updates = Object.assign({ id: round.id }, role_data);
  return rounds.update(updates).then(finish);
}

const actions = {

  vp(user) {
    return update.call(this, { vice_president_id: user.id });
  },

  president(user) {
    return update.call(this, { president_id: user.id });
  },

  asshole(user) {
    return update.call(this, { asshole_id: user.id });
  }

};

const ended = computed('row.manager.{state}', function() {
  const { status } = this.get('row.manager.state.game') || { };
  return status === ENDED_STATUS;
});

export default Component.extend({
  rounds: inject.service('game-rounds/resource'),
  userColumns, tagName, actions, ended
});
