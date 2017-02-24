import Ember from 'ember';

const { inject, Component } = Ember;

function init() {
  this._super(...arguments);

  const { game, manager } = this;

  let pagination = { size: 5 };
  let sorting = { };

  // sync up the delegate w/ our manager and game
  this.get('delegate').setProperties({ game, manager });

  this.setProperties({ pagination, sorting });
}

export default Component.extend({
  users: inject.service('users/resource'),
  memberships: inject.service('users/memberships'),
  delegate: inject.service('delegates/game-membership-modal-table'),
  init
});
