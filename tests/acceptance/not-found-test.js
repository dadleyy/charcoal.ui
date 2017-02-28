import { test } from 'qunit';
import Pretender from 'pretender';
import moduleForAcceptance from 'charcoal/tests/helpers/module-for-acceptance';

function locale() {
  return [200, {"Content-Type": "application/json"}, JSON.stringify({ })];
}

let server = null
moduleForAcceptance('Acceptance | not-found (404)', {
  beforeEach() {
    server = new Pretender();
    server.get('/locale/en', locale);
  },
  afterEach() {
    server.shutdown();
  }
});

test('visiting /non-existant-route + not logged in', function(assert) {
  visit('/non-existant-route');

  andThen(function() {
    assert.equal(currentURL(), '/login');
  });
});
