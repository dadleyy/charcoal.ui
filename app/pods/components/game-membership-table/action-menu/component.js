import Ember from 'ember';
import ENV from 'charcoal/config/environment';

const { API_HOME } = ENV;
const { inject, Component, computed } = Ember;

const className = 'game-membership-table__action-menu';

const actions = {

  leave() {
    const membership = this.get('membership');
    const ajax = this.get('ajax');
    const finished = this.get('signals').bind(null, 'destroyed');
    return ajax.del(`${API_HOME}/game-memberships/${membership.id}`).then(finished);
  },

  destroy() {
    const ajax = this.get('ajax');
    const game = this.get('game');
    const finished = this.get('signals').bind(null, 'destroyed');
    return ajax.del(`${API_HOME}/games/${game.id}`).then(finished);
  }

};

const canDelete = computed('game.owner_id', function() {
  const active = this.get('game.status') === 'ACTIVE';
  const owner = this.get('auth.user.id') === this.get('game.owner_id');
  return active && owner;
});

export default Component.extend({
  auth: inject.service(),
  ajax: inject.service(),
  className, actions, canDelete
});
