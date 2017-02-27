import Ember from 'ember';

const { inject, computed, Component } = Ember;

const classNames = ['popup-manager__popup'];

const isOpen = computed('handle.{open}', 'popups.{opening}', function() {
  return this.get('popups') && this.get('handle').open === true;
});

function init() {
  this._super(...arguments);
}

export default Component.extend({
  popups: inject.service(),
  classNames, init, open: isOpen
});
