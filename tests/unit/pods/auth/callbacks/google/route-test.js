import { moduleFor, test } from 'ember-qunit';

moduleFor('route:auth/callbacks/google', 'Unit | Route | auth/callbacks/google', {
  needs: ['service:analytics', 'service:auth']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
