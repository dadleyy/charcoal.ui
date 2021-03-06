import Ember from 'ember';
import layout from 'charcoal/pods/components/hoc-table/pagination/template';

const { run, inject, computed } = Ember;

const tagName = 'footer';

const promise = computed('promise', {
  set(key, target_promise) {
    const get = this.get.bind(this);

    let updates = { display: false, controls: null };
    let update = run.bind(this, this.setProperties, updates);

    function receive(result) {
      const { count } = result;
      const { page, size } = get('pagination') || { page: 0 };

      if(get('isDestroyed') === true) {
        return false;
      }

      if(!count) {
        return run.next(null, update);
      }

      const start = page ? page * size : 0;
      const end = start + size;

      updates.controls = { next: count > end, previous: start > 0 };
      updates.display  = { total: count, size };

      run.next(null, update);
    }

    target_promise.then(receive);

    return target_promise;
  }
});

function init() {
  this._super(...arguments);
  const deferred = this.get('deferred');

  const options = () => {
    let delegate = this.get('delegate');
    let sizes = delegate.sizes();
    return deferred.resolve(sizes);
  };

  const select = (size) => {
    const { page } = this.get('pagination');
    this.set('pagination', { size, page });
  };

  this.set('sizeDelegate', { options, select });
}

const actions = {

  move(amount) {
    const { size, page } = this.get('pagination');
    this.set('pagination', { size, page: (page || 0) + amount });
  }

};

export default Ember.Component.extend({
  deferred: inject.service(),
  layout, promise, tagName, actions, init
});
