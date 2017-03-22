import Ember from 'ember';

const { run, inject, Component } = Ember;
const DEBOUNCE_TIME = 400;

function apply() {
  const { query: user } = this;
  const delegate = this.get('delegate');
  const query = { user };
  const state = { query };
  delegate.set('state', state);
}

function init() {
  this._super(...arguments);

  const { game, manager } = this;
  const pagination = { size: 5 };

  // sync up the delegate w/ our manager and game
  this.get('delegate').setProperties({ game, manager });

  this.setProperties({ pagination });
}

const actions = {

  search(evt) {
    let { value: query } = evt.target;
    this.set('query', query);
    run.debounce(this, apply, DEBOUNCE_TIME);
  }

};

export default Component.extend({
  delegate: inject.service('delegates/game-membership-modal-table'),
  init, actions
});
