import Ember from 'ember';

const { inject } = Ember;

function beforeModel() {
  return this.get('auth').prepare();
}

export default Ember.Mixin.create({ auth: inject.service(), beforeModel });
