import Ember from 'ember';

const { computed } = Ember;

function init() {
  this._super(...arguments);
}

const created = computed(function() {
  return new Date(this.get('row.membership.created_at'));
});

export default Ember.Component.extend({ created, init, tagName: 'tbody' });
