import Ember from 'ember';

const { inject, Component } = Ember;

const actions = {

  close() {
    const { handle } = this;
    const popups = this.get('popups');
    popups.close(handle);
  }

};

export default Component.extend({
  actions, popups: inject.service()
});
