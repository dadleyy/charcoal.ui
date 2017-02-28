import Ember from 'ember';

const { inject, run, Component } = Ember;

const fields = ['email', 'password', 'name'];

function message(e) {
  return e.message || e.title || e;
}

const actions = {

  submit() {
    const { delegate, busy } = this;
    const set = this.setProperties.bind(this);
    const finished = run.bind(this, set, { busy: false });

    if(busy === true) {
      return false;
    }

    function failed(error_response) {
      let { errors } = error_response || { };

      errors = errors.length ? errors.map(message) : [ i18n.t('unknown_error') ];

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

function updater(field_name) {
  return function(evt) {
    const { value } = evt.target;
    const { delegate } = this;
    delegate.stage(field_name, value);
  }
}

for(let i = 0, c = fields.length; i < c; i++) {
  let field = fields[i];
  actions[field] = updater(field);
}

export default Component.extend({
  i18n: inject.service(),
  actions
});
