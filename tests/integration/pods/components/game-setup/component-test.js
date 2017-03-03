import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('game-setup', 'Integration | Component | game setup', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{game-setup}}`);
  assert.equal(true, true);
});
