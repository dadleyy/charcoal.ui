import Ember from 'ember';
import EventHandlesMixin from 'charcoal/mixins/event-handles';
import { module, test } from 'qunit';

module('Unit | Mixin | event handles');

// Replace this with your real tests.
test('it works', function(assert) {
  let EventHandlesObject = Ember.Object.extend(EventHandlesMixin);
  let subject = EventHandlesObject.create();
  assert.ok(subject);
});
