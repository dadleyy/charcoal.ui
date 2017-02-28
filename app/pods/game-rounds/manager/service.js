import Ember from 'ember';
import Events from 'charcoal/mixins/event-handles';

const { inject, run, Service } = Ember;

function emptyRound() {
  return { asshole_id: null, president_id: null, vice_president_id: null  };
}

function clear(round) {
  const rounds = this.get('rounds');
  const deferred = this.get('deferred');
  const { ...cleared } = emptyRound();
  const updated = run.bind(this, this.trigger, 'updated');

  function success(results) {
    updated();
    return deferred.resolve(results);
  }

  return rounds.update({ id: round.id, ...cleared }).then(success);
}

function add() {
  const { game } = this;
  const updated = run.bind(this, this.trigger, 'updated');
  const rounds = this.get('rounds');
  const deferred = this.get('deferred');

  function success(results) {
    updated();
    return deferred.resolve(results);
  }

  return rounds.create({ game_id: game.id }).then(success);
}

function remove(){ 
}

export default Service.extend(Events, {
  deferred: inject.service(),
  rounds: inject.service('game-rounds/resource'),
  add, clear, remove
});
