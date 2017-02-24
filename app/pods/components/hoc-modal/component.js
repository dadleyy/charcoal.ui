import Ember from 'ember';

const { Component, inject } = Ember;

function init() {
  this._super(...arguments);
  const popups = this.get('popups');
  const handle = popups.allocate();
  this.set('handle', handle);
}

function willDestroyElement() {
  const handle = this.get('handle');
  const popups =this.get('popups');
  popups.free(handle);
  this.set('handle', null);
}

export default Component.extend({
  classNames: ['hoc-modal'],
  init, willDestroyElement,
  popups: inject.service() 
});
