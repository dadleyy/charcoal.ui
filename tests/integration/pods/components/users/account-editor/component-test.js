import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('users/account-editor', 'Integration | Component | users/account editor', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{users/account-editor}}`);
  assert.equal(true, true);
});
