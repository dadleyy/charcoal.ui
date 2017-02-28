import Ember from 'ember';
import EventHandles from 'charcoal/mixins/event-handles';

const { run, inject, Service, computed } = Ember;

function clear() {
  this.set('revisions', [ ]);
}

const user = computed('revisions', function() {
  const u = { };
  const { revisions } = this;

  for(let i = 0, c = revisions.length; i < c; i++) {
    let { field, value } = revisions[i];
    u[field] = value;
  }

  return u;
});


function init() {
  this._super(...arguments);
  clear.call(this);
}

function commit() {
  const user = this.get('user');
  const resource = this.get('user_resource');
  const trigger = run.bind(this, this.trigger);
  const deferred = this.get('deferred');

  function success(user_response) {
    const { meta } = user_response;

    if(meta && meta.token) {
      trigger('saved', user_response);
      return deferred.resolve(user_response);
    }

    return deferred.reject(new Error('no token returned from server'));
  }

  return resource.create(user).then(success);
}

function stage(field, value) {
  const { revisions } =  this;
  const unique = revisions.filter(function({ field: f }) { return f !== field; });

  unique.push({ field, value });

  this.set('revisions', unique);
}

export default Service.extend(EventHandles, { 
  deferred: inject.service(),
  user_resource: inject.service('users/resource'),
  init, clear, user, commit, stage
});
