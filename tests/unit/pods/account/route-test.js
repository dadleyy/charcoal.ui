import { moduleFor, test } from 'ember-qunit';

moduleFor('route:account', 'Unit | Route | account', {
  needs: [
    'service:analytics',
    'service:users/account-manager',
    'service:auth'
  ]
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
