import Ember from 'ember';

const { computed, inject, run, Component } = Ember;

const fields = ['email', 'password', 'name', 'username'];

const actions = {

  submit() {
    const { delegate, busy } = this;
    const set = this.setProperties.bind(this);
    const finished = run.bind(this, set, { busy: false });
    const api_errors = this.get('api_errors');

    if(busy === true) {
      return false;
    }

    function failed(er) {
      let errors = er && er.errors ? api_errors.parse(er.errors) : [ i18n.t('unknown_error') ];
      set({ errors, failed: true });
    }

    function success() {
      let errors = [ ];
      set({ errors, failed: false });
    }

    this.set('busy', true);
    delegate.commit().then(success).catch(failed).finally(finished);
  }

};

const user = computed.alias('delegate.user');

function updater(field_name) {
  function set(key, value) {
    this.get('delegate').stage(field_name, value);
    return value;
  }

  function get() {
    return this.get('delegate').get(`user.${field_name}`);
  }

  return { get, set };
}

let dyanmic = { };
for(let i = 0, c = fields.length; i < c; i++) {
  let field = fields[i];
  dyanmic[field] = computed(updater(field));
}

export default Component.extend({ 
  i18n: inject.service(),
  api_errors: inject.service('api-errors'),
  user, ...dyanmic, actions
});
