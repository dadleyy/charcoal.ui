import Ember from 'ember';
import { GAME_STATUSES } from 'charcoal/pods/games/manager/service';

const { inject, computed, Component } = Ember;
const { ENDED: ENDED_STATUS } = GAME_STATUSES;
const tagName = 'tbody';

function wasAbsent(history_list, round) {
  let { id: round_id } = round;

  // exit early - one history record
  if(history_list.length === 1) {
    let [{ entry_round_id: entry, exit_round_id: exit }] = history_list;
    return (entry !== null && entry > round_id) || (exit !== null && exit < round_id);
  }

  // if there is more than one record, iterate over sorted the history
  for(let i = 0, c = history_list.length; i < c; i++) {
    let { entry_round_id: entry, exit_round_id: exit } = history_list[i];

    if(entry === null && (exit === null || exit > round_id)) {
      return false;
    }

    if(entry && exit && entry <= round_id && exit >= round_id) {
      return false;
    }
  }

  let latest = history_list[history_list.length - 1];

  if(latest.exit_round_id && latest.exit_round_id < round_id) {
    return true;
  }

  return latest.entry_round_id > round_id; 
}

const userColumns = computed(function() {
  let { round } = this.get('row');
  let columns = this.get('row.columns').filter(function({ user }) { return !!user; });
  let result = [ ];

  for(let i = 0, c = columns.length; i < c; i++) {
    let { user, membership, histories } = columns[i];

    let asshole = user.id === round.asshole_id;
    let president = user.id === round.president_id;
    let vice_president = user.id === round.vice_president_id;

    let absent = wasAbsent(histories, round);
    let inactive = membership.status === 'INACTIVE';

    let rankable = !asshole && !president && !vice_president && !absent && !inactive;

    result.push({ rankable, asshole, president, vice_president, user, absent });
  }

  return result;
});

async function update(role_data) {
  const { signals, round } = this.get('row');
  const rounds = this.get('rounds');
  const updates = Object.assign({ id: round.id }, role_data);

  try {
    await rounds.update(updates);
    signals('updated');
  } catch(e) {
    console.error(e);
  }
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
