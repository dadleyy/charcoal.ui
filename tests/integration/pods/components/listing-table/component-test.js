import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Delegate from 'charcoal/delegates/table';

moduleForComponent('listing-table', 'Integration | Component | listing table', {
  integration: true
});

test('it renders', function(assert) {
  const delegate = Delegate.create();
  this.set('delegate', delegate);

  this.render(hbs`{{listing-table delegate=delegate}}`);
   
  assert.equal(true, true);
});
