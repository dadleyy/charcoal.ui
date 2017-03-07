import Ember from 'ember';
import { GAME_STATUSES } from 'charcoal/pods/games/manager/service';

const { inject, Component, computed } = Ember;

const selected = computed('delegate.{state}', function() {
  const { status } = this.get('delegate.state') || { };
  return this.get('i18n').t(status || 'all');
});

const actions = {

  select(status) {
    const { delegate } = this;
    const { state } = delegate;
    delegate.set('state', { ...state, status });
  }

};

export default Component.extend({
  i18n: inject.service(),
  selected, actions
});
