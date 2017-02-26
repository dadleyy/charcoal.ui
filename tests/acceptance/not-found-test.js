import { test } from 'qunit';
import moduleForAcceptance from 'charcoal/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | not-found (404)');

test('visiting /non-existant-route + not logged in', function(assert) {
  visit('/non-existant-route');

  andThen(function() {
    assert.equal(currentURL(), '/login');
  });
});
