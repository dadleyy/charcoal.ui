import Ember from 'ember';

const { computed, Component } = Ember;

const deficit = computed('manager.state', function() {
  const { users } = this.get('manager.membership_manager') || { };
  return users && users.length ? 3 - users.length : 3;
});

export default Component.extend({ deficit });
