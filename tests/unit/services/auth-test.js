import { moduleFor, test } from 'ember-qunit';

moduleFor('service:auth', 'Unit | Service | auth', {
  needs: ['service:analytics', 'service:ajax', 'service:deferred']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});
