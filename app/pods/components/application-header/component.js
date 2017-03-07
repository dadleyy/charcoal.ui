import Ember from 'ember';
import ENV from 'charcoal/config/environment';

const { inject, computed } = Ember;

const user = computed.alias('auth.user');

const source_home = computed(function() {
  return ENV.source_home;
});

export default Ember.Component.extend({
  auth: inject.service(),
  i18n: inject.service(),
  user, source_home
});
