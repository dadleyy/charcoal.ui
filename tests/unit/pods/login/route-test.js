import { moduleFor, test } from 'ember-qunit';

moduleFor('route:login', 'Unit | Route | login', {
  needs: ['service:analytics', 'service:auth', 'service:delegates/signup']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
