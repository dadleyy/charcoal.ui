import Ember from 'ember';
import EventHandles from 'charcoal/mixins/event-handles';

const { run, inject, Service } = Ember;

export const GAME_STATUSES = {
  ENDED  : 'ENDED',
  ACTIVE : 'ACTIVE'
};

export default Service.extend(EventHandles, {
  deferred           : inject.service(),
  resource           : inject.service('games/resource'),
  membership_manager : inject.service('game-memberships/manager', { singleton: false }),
  round_manager      : inject.service('game-rounds/manager'),
  game_resource      : inject.service('games/resource'),

  addMember(user_id) {
    const { game } = this.get('state');
    const success = run.bind(this, this.trigger, 'updated');
    const reload = run.bind(this, this.load, game.uuid);
    return this.get('membership_manager').add(user_id).then(reload).then(success);
  },

  clearRound(round) {
    const { game } = this.get('state');
    const success = run.bind(this, this.trigger, 'updated');
    const reload = run.bind(this, this.load, game.uuid);
    return this.get('round_manager').clear(round).then(reload).then(success);
  },
  
  removeRound(round) {
    const { game } = this.get('state');
    const success = run.bind(this, this.trigger, 'updated');
    const reload = run.bind(this, this.load, game.uuid);
    return this.get('round_manager').remove(round).then(reload).then(success);
  },

  newRound() {
    const { game } = this.get('state');
    const success = run.bind(this, this.trigger, 'updated');
    const reload = run.bind(this, this.load, game.uuid);
    return this.get('round_manager').add().then(reload).then(success);
  },

  endGame() {
    const { id, uuid } = this.get('state.game') || { };
    const reload = run.bind(this, this.load, uuid);
    const updates = { id, status: GAME_STATUSES.ENDED };
    return this.get('resource').update(updates).then(reload);
  },

  load(uuid) {
    const deferred = this.get('deferred');
    const members = this.get('membership_manager');
    const rounds = this.get('round_manager');
    const set = run.bind(this, this.setProperties);
    const state = { };

    function finish() {
      return deferred.resolve({ members, rounds, ...state });
    }

    function loaded({ results } = { }) {
      [ state.game ] = results || [ ];

      set({ state });
      members.set('game', state.game);
      rounds.set('game', state.game);

      return members.refresh().then(finish);
    }

    return this.get('resource').query({ where: { uuid } }).then(loaded);
  }

});
