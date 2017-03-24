import { moduleFor, test } from 'ember-qunit';

moduleFor('service:game-memberships/manager', 'Unit | Service | game-memberships/manager', {
  needs: [
    'service:uuid',
    'service:deferred',
    'service:game-memberships/resource',
    'service:game-membership-history/resource',
    'service:users/resource'
  ]
});

test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});
