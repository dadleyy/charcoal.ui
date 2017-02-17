import Ember from 'ember';

const { inject, computed } = Ember;

const auth = inject.service();
const user = computed('auth.user', function() { return this.get('auth.user'); });

export default Ember.Component.extend({ auth, user });
