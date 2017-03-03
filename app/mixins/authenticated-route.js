import Ember from 'ember';

const { inject } = Ember;

function beforeModel(...params) {
  const next = this._super.bind(this, ...params);
  return this.get('auth').prepare().then(next);
}

export default Ember.Mixin.create({ auth: inject.service(), beforeModel });
