import Ember from 'ember';
import RequireAuthenticationRouteMixin from 'charcoal/mixins/require-authentication-route';
import { module, test } from 'qunit';

module('Unit | Mixin | require authentication route');

// Replace this with your real tests.
test('it works', function(assert) {
  let RequireAuthenticationRouteObject = Ember.Object.extend(RequireAuthenticationRouteMixin);
  let subject = RequireAuthenticationRouteObject.create();
  assert.ok(subject);
});
