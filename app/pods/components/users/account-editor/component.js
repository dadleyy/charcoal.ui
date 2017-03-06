import Ember from 'ember';

const { computed, Component } = Ember;
const FIELDS = ['username', 'email', 'password', 'name', 'password_confirm'];

const fields = { };

function updater(field_name) {
  function get() {
    return this.get(`manager.user.${field_name}`);
  }

  function set(k, value) {
    this.get('manager').stage(field_name, { value });
  }

  return computed('manager.user', { get, set });
}

for(var i = 0, c = FIELDS.length; i < c; i++) {
  let key = FIELDS[i];
  fields[key] = updater(key);
}

export default Component.extend({ ...fields });
