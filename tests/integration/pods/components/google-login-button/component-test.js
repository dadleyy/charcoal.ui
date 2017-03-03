import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('google-login-button', 'Integration | Component | google login button', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{google-login-button}}`);
  const href = this.$().find('a[href]').attr('href');
  assert.equal(/google/i.test(href), true);
});
