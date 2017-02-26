import Ember from 'ember';

const { run, computed } = Ember;
const tagName = 'tbody';

const promise = computed({
  set(key, value) {
    const set = this.set.bind(this);
    const get = this.get.bind(this);
    const after = set.bind(this, 'pending', false);

    set('pending', true);

    function finished() {
      if(get('isDestroyed') === true) {
        return;
      }

      run.next(null, after);
    }

    return value.finally(finished);
  }
});

export default Ember.Component.extend({ promise, tagName });
