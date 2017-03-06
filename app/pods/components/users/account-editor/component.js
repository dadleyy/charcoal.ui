import Ember from 'ember';

const { run, computed, Component } = Ember;

const update = function(field_name) {
  function get() {
    return this.get(`manager.user.${field_name}`);
  }

  function set(k, value) {
    const { manager } = this;
    manager.stage(field_name, { value });
    return manager.get(`user.${field_name}`);
  }

  return computed('manager.user', { get, set });
}

const actions =  {

  save() {
    const { busy } = this;
    const finished = run.bind(this, this.setProperties, { busy: false });

    if(busy) {
      return;
    }

    function failed(err) {
      window.alert(err.message);
    }

    this.get('manager').commit().catch(failed).finally(finished);
  },

  cancel() {
    const { id }= this.get('manager.user');
    this.get('manager').load(id);
  }

};

export default Component.extend({
  username: update('username'),
  email: update('email'),
  name: update('name'),
  password: update('password'),
  password_confirm: update('password_confirm'),
  actions
});
