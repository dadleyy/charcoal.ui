import { moduleFor, test } from 'ember-qunit';

moduleFor('route:dashboard', 'Unit | Route | dashboard', {
  needs: [
    'service:auth',
    'service:analytics',
    'service:delegates/game-membership-table',
    'service:i18n'
  ]
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
