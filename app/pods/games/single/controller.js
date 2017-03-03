import Ember from 'ember';

const { computed, inject, Controller } = Ember;

function init() {
  this._super(...arguments);
}

const actions = {

  newRound() {
    const { round_manager, table_delegate, game } = this.get('model');

    function success() {
      table_delegate.set('state', { updated: Date.now() });
    }

    return round_manager.add().then(success);
  },

  refresh() {
    this.get('model.table_delegate').set('state', { updated: Date.now() });
  }

};

const lonely = computed('model.manager.state.game.{population}', function() {
  const { population } = this.get('model.manager.state.game') || { };
  return !population || population < 3;
});

export default Controller.extend({
  users: inject.service('users/resource'),
  memberships: inject.service('game-memberships/resource'),
  rounds: inject.service('game-rounds/resource'),
  init, actions, lonely
});
