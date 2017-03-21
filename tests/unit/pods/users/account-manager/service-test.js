import { moduleFor, test } from 'ember-qunit';

moduleFor('service:users/account-manager', 'Unit | Service | users/account manager', {
  needs: ['service:analytics', 'service:deferred', 'service:users/resource']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});
