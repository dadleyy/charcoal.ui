import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const Delegate = Ember.Object.extend({
  columns() {
    return [{ }];
  },

  rows() {
    return Ember.RSVP.resolve({ });
  }
});

moduleForComponent('game-membership-table', 'Integration | Component | game membership table', {
  integration: true,
  beforeEach() {
    this.register('service:delegate', Delegate);
    this.inject.service('delegate', { as: 'delegate' });
  }
});

test('it renders', function(assert) {
  this.render(hbs`
    {{#game-membership-table delegate=delegate}}
    {{/game-membership-table}}
  `);

  assert.equal(true, true);
});
