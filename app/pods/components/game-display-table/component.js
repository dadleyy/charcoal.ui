import Ember from 'ember';

const { inject } = Ember;

const actions = {

  start() {
    const rounds = this.get('rounds');
    const { delegate } = this;
    const { game } = delegate;
    const { id: game_id } = game;

    function success() {
      const updated = Date.now();
      delegate.set('state', { updated });
    }

    return rounds.create({ game_id }).then(success);
  }

};

export default Ember.Component.extend({
  rounds: inject.service('game-rounds/resource'),
  actions
});
