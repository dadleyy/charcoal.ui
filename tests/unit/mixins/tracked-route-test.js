import Ember from 'ember';
import TrackedRouteMixin from 'charcoal/mixins/tracked-route';
import { module, test } from 'qunit';

module('Unit | Mixin | tracked route');

// Replace this with your real tests.
test('it works', function(assert) {
  let TrackedRouteObject = Ember.Object.extend(TrackedRouteMixin);
  let subject = TrackedRouteObject.create();
  assert.ok(subject);
});
