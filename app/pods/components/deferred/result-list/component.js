import Ember from 'ember';
const { run, computed, merge } = Ember;
const { not } = computed;

const tagName = '';

let id_pool = 0;

function uuid() {
  return `-${++id_pool}-`;
}

function empty() {
  return { complete: null, result: null, failed: null, ready: false, error: null };
}

const promise = computed({
  set(key, target_promise) {
    const get = this.get.bind(this);
    const current_request = uuid();
    const update = this.setProperties.bind(this);

    update(merge(empty(), { current_request }));

    function success(result) {
      const current = get('current_request');

      if(get('isDestroyed') === true || current !== current_request) {
        return false;
      }

      run.next(null, update, { error: null, failed: false, ready: true, result });
    }

    function failed(error) {
      const current = get('current_request');

      if(get('isDestroyed') === true || current !== current_request) {
        return false;
      }

      run.next(null, update, { error, failed: true, ready: false, result: null });
    }

    function finished() {
      const current = get('current_request');

      if(get('isDestroyed') === true || current !== current_request) {
        return false;
      }

      run.next(null, update, { complete: true });
    }

    target_promise.then(success)
      .catch(failed)
      .finally(finished);

    return target_promise;
  }
});

const pending = not('ready');

export default Ember.Component.extend({tagName, promise, pending});
