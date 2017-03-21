import { moduleFor, test } from 'ember-qunit';

moduleFor('service:delegates/game-membership-table', 'Unit | Service | delegates/game membership table', {
  needs: [
    'service:i18n',
    'service:auth',
    'service:deferred',
    'service:games/resource',
    'service:game-memberships/resource',
    'service:users/resource'
  ]
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});
