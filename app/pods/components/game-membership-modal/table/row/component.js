import Ember from 'ember';

const { computed, Component } = Ember;

const addable = computed('row.{user,member}', function() {
  return this.get('row.member') === undefined;
});

const actions = {

  add() {
    const { manager, signals, user } = this.get('row');
    const finish = signals.bind(null, 'added');
    return manager.addMember(user.id).then(finish);
  }

};

export default Component.extend({
  actions, addable, tagName: 'tbody'
});
