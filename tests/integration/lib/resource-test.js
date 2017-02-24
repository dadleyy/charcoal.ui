import Pretender from 'pretender';
import resource from 'charcoal/lib/resource';
import { test, moduleFor } from 'ember-qunit';


let server = null;

moduleFor('service:resource', {
  integration: true,
  beforeEach() {
    let s = resource('api/resource');
    this.register('service:resource', s, {singleton: true});
    this.inject.service('resource', { as: 'resource' });
    server = new Pretender();
  },
  afterEach() {
    server.shutdown();
  }
});

test('it created an injectable service', function(assert) {
  assert.ok(true);
});

test('it has a \'query\' method defined', function(assert) {
  assert.ok(typeof this.subject().query === 'function');
});

test('it has an \'update\' method defined', function(assert) {
  assert.ok(typeof this.subject().update === 'function');
});

test('it has a \'create\' method defined', function(assert) {
  assert.ok(typeof this.subject().create === 'function');
});

test('it has a \'del\' method defined', function(assert) {
  assert.ok(typeof this.subject().del === 'function');
});

test('it makes a GET request on query w/ in operation', function(assert) {
  server.get('/api/resource', function(request) {
    let filter = request.queryParams['filter[game_id]'];
    assert.equal(filter, 'in(1,2)');
    return [200, {"Content-Type": "application/json"}, JSON.stringify({ })];
  });

  this.subject().query({ where: { game_id: [1,2] } });
});

test('it makes a GET request on query w/ lt operation', function(assert) {
  server.get('/api/resource', function(request) {
    let filter = request.queryParams['filter[game_id]'];
    assert.equal(filter, 'lt(10)');
    return [200, {"Content-Type": "application/json"}, JSON.stringify({ })];
  });

  this.subject().query({ where: { game_id: { lt: 10 } } });
});

test('it makes a GET request on query w/ lk operation', function(assert) {
  server.get('/api/resource', function(request) {
    let filter = request.queryParams['filter[name]'];
    assert.equal(filter, 'lk(danny)');
    return [200, {"Content-Type": "application/json"}, JSON.stringify({ })];
  });

  this.subject().query({ where: { name: { like: 'danny' } } });
});

test('it makes a GET request on query w/ gt operation', function(assert) {
  server.get('/api/resource', function(request) {
    let filter = request.queryParams['filter[game_id]'];
    assert.equal(filter, 'gt(10)');
    return [200, {"Content-Type": "application/json"}, JSON.stringify({ })];
  });

  this.subject().query({ where: { game_id: { gt: 10 } } });
});

test('it makes a GET request on query w/ eq operation', function(assert) {
  server.get('/api/resource', function(request) {
    let filter = request.queryParams['filter[game_id]'];
    assert.equal(filter, 'eq(1)');
    return [200, {"Content-Type": "application/json"}, JSON.stringify({ })];
  });

  this.subject().query({ where: { game_id: 1 } });
});
