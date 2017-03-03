import Ember from 'ember';
import EventHandles from 'charcoal/mixins/event-handles';

const { run, inject, Service } = Ember;

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
