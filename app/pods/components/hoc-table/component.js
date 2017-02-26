import Ember from 'ember';
import layout from 'charcoal/pods/components/hoc-table/template';
const { computed } = Ember;

const columns = computed('delegate.{state,store}', function() {
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
  this.pagination = this.pagination || { page: 0, size: 5 };
}

export default Ember.Component.extend({ init, layout, columns, promise });
