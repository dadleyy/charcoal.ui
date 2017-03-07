import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('game-membership-table/status-filter', 'Integration | Component | game membership table/status filter', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{game-membership-table/status-filter}}`);
  assert.equal(true, true);
});
