import { moduleFor, test } from 'ember-qunit';

moduleFor('route:not-found', 'Unit | Route | not found', {
  needs: ['service:analytics']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
