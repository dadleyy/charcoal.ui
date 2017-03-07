import Ember from 'ember';
import { GAME_STATUSES } from 'charcoal/pods/games/manager/service';

const { inject, Component, computed } = Ember;

const className = 'game-membership-table__action-menu';
const { ENDED: ENDED_STATUS } = GAME_STATUSES;

const actions = {

  leave() {
    const membership = this.get('membership');
    const resource = this.get('memberships_resource');
    const finished = this.get('signals').bind(null, 'destroyed');
    return resource.del({ id: membership.id }).then(finished);
  },

  destroy() {
    const resource = this.get('games_resource');
    const { id } = this.get('game');
    const status = ENDED_STATUS;
    const finished = this.get('signals').bind(null, 'destroyed');
    return resource.update({ id, status }).then(finished);
  }

};

const canDelete = computed('game.owner_id', function() {
  const active = this.get('game.status') === 'ACTIVE';
  const owner = this.get('auth.user.id') === this.get('game.owner_id');
  return active && owner;
});

export default Component.extend({
  auth: inject.service(),
  games_resource: inject.service('games/resource'),
  memberships_resource: inject.service('game-memberships/resource'),
  className, actions, canDelete
});
