import Ember from 'ember';
import ENV from 'charcoal/config/environment';

const { inject, computed } = Ember;

const auth = inject.service();
const user = computed.alias('auth.user');

const source_home = computed(function() { return ENV.source_home; });

export default Ember.Component.extend({ auth, user, source_home });
