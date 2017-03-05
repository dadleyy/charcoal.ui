import Ember from 'ember';

const { computed, inject, Controller } = Ember;
const ACTIVE_STATUS = 'ACTIVE';

function init() {
  this._super(...arguments);
}

const actions = {

  newRound() {
    const { manager, table_delegate, game } = this.get('model');

    function success() {
      table_delegate.set('state', { updated: Date.now() });
    }

    return manager.newRound().then(success);
  },

  refresh() {
    this.get('model.table_delegate').set('state', { updated: Date.now() });
  }

};

const lonely = computed('ended', 'model.manager.state.game.{population}', function() {
  const { population } = this.get('model.manager.state.game') || { };
  return (!population || population < 3) && !this.get('ended');
});

const active = computed('lonely', 'model.manager.state.game.{status}', function() {
  const { status } = this.get('model.manager.state.game') || { };
  return this.get('lonely') === false && status === ACTIVE_STATUS;
});

const ended = computed('model.manager.state.game.{status}', function() {
  const { status } = this.get('model.manager.state.game') || { };
  return status !== ACTIVE_STATUS;
});

export default Controller.extend({
  users: inject.service('users/resource'),
  memberships: inject.service('game-memberships/resource'),
  rounds: inject.service('game-rounds/resource'),
  init, actions, lonely, active, ended
});
