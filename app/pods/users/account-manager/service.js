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
    const { base, revisions } = this;
    let rev = revisions.filter(function({ field: f }) { return f !== field; });

    if(base[field] === payload.value) {
      this.set('revisions', rev);
      return;
    }

    rev.push({ field, payload });
    this.set('revisions', rev);
  },

  commit() {
    const user = this.get('user');
    const reload = run.bind(this, this.load, user.id);

    if(user.password !== undefined && user.password !== user.password_confirm) {
      return this.get('deferred').reject(new Error('invalid-password-confirm'));
    }

    return this.get('user_resource').update(user).then(reload);
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
