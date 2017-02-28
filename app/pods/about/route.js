import Ember from 'ember';

function titleToken() { return this.get('i18n').t('about'); }

export default Ember.Route.extend({ titleToken });
