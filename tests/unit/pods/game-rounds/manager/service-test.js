import { moduleFor, test } from 'ember-qunit';

moduleFor('service:game-rounds/manager', 'Unit | Service | game rounds/manager', {
  needs: [
    'service:uuid',
    'service:deferred',
    'service:game-rounds/resource'
  ]
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});
