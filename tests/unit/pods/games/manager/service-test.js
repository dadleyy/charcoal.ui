import { moduleFor, test } from 'ember-qunit';

moduleFor('service:games/manager', 'Unit | Service | games/manager', {
  needs: [
    'service:uuid',
    'service:deferred',
    'service:games/resource',
    'service:game-memberships/manager',
    'service:game-rounds/manager'
  ]
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});
