import Ember from 'ember';

const { computed, Component } = Ember;

function init() {
  this._super(...arguments);
}

const ranked = computed('round.{asshole_id,president_id,vice_president_id}', function() {
  let { asshole_id, president_id, vice_president_id } = this.get('round');
  return asshole_id || president_id || vice_president_id;
});

const actions = {

  clear() {
    const { manager, round } = this;

    function success() {
    }

    manager.clear(round).then(success);
  },

  remove() {
  }

};

export default Component.extend({ init, ranked, actions });
