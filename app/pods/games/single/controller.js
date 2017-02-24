import Ember from 'ember';

const { inject, Controller } = Ember;

function init() {
  this._super(...arguments);
}

const actions = {

  newRound() {
    const rounds = this.get('rounds');
    const { table_delegate, game } = this.get('model');

    function success() {
      table_delegate.set('state', { updated: Date.now() });
    }

    return rounds.create({ game_id: game.id }).then(success);
  },

  refresh() {
    this.get('model.table_delegate').set('state', { updated: Date.now() });
  }

};

export default Controller.extend({
  users: inject.service('users/resource'),
  memberships: inject.service('game-memberships/resource'),
  rounds: inject.service('game-rounds/resource'),
  init, actions
});
