import Ember from 'ember';
import TrackedRoute from 'charcoal/mixins/tracked-route';

const { Route } = Ember;

function titleToken() { return this.get('i18n').t('about'); }

export default Route.extend(TrackedRoute, { titleToken });
