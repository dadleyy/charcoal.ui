import Ember from 'ember';
import TrackedRoute from 'charcoal/mixins/tracked-route';

const { Route } = Ember;

function redirect() {
  this.transitionTo("index");
}

export default Route.extend(TrackedRoute, { redirect });
