import Ember from 'ember';
import layout from 'charcoal/pods/components/hoc-table/template';
const { computed } = Ember;

const columns = computed('delegate', function() {
  const delegate = this.get('delegate');
  return delegate.columns();
});

const promise = computed('delegate.{state,store}', 'pagination', 'sorting', function() {
  const sorting = this.get('sorting');
  const pagination = this.get('pagination');
  return this.get('delegate').rows({ sorting, pagination });
});

function init() {
  this._super(...arguments);
  this.sorting = this.sorting || { };
  this.pagination = this.pagination || { };
}

export default Ember.Component.extend({ init, layout, columns, promise });
