import Ember from 'ember';

const NUMERIC_RE = /^[\d\.]+$/i;
const { computed, Component, inject } = Ember;
const { htmlSafe: safe } = Ember.String;

const display = computed('popups.active', 'popups.{active}', function() {
  return this.get('popups.active') && this.get('handle').open;
});

const style = computed('display', function() {
  const popups = this.get('popups');
  const handle = this.get('handle');
  let { top, left, width, height } = popups.bounding(handle) || { };

  if(!top || !left) {
    return safe(`display: none;`);
  }

  if(!height) {
    height = 'auto';
  }

  if(!width) {
    width = 'auto';
  }

  left = NUMERIC_RE.test(left) ? `${left}px` : left;
  top = NUMERIC_RE.test(top) ? `${top}px` : top;
  return safe(`position: absolute; left: ${left}; top: ${top}; height: ${height}; width: ${width};`);
});

export default Component.extend({
  classNames: ['popup-manager__popup'],
  style, display,
  popups: inject.service(),
});
