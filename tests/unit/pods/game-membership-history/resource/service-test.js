import { moduleFor, test } from 'ember-qunit';

moduleFor('service:game-membership-history/resource', 'Unit | Service | game membership history/resource', {
  needs: [
    'service:ajax',
    'service:deferred'
  ]
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});
