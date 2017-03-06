import Ember from 'ember';

const { run, inject, computed, Service } = Ember;

export default Service.extend({
  deferred: inject.service(),
  user_resource: inject.service('users/resource'),

  load(id) {
    const set = run.bind(this, this.setProperties);
    const deferred = this.get('deferred');

    function success(response) {
      const [ user ] = response.results;
      set({ 'base': user, 'revisions': [ ] });
      return deferred.resolve({ user });
    }

    return this.get('user_resource').query({ where: { id } }).then(success);
  },

  stage(field, payload) {
    let rev = this.get('revisions').filter(function({ field: f }) { return f !== field; });
    rev.push({ field, payload });
    this.set('revisions', rev);
  },

  user: computed('revisions', 'base', function() {
    let { base, revisions } = this;
    let result = { ...base };

    for(let i = 0, c = revisions.length; i < c; i++) {
      let { field, payload } = revisions[i];
      result[field] = payload.value;
    }

    return result;
  })

});
