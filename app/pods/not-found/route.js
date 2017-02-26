import Ember from 'ember';

const { Route } = Ember;

function redirect() {
  this.transitionTo("index");
}

export default Route.extend({ redirect });
