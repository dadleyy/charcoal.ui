import Ember from 'ember';

const { run, Component, inject } = Ember;
const ELEMENT_NODE_TYPE = 1;
const NUMERIC_RE=/^[\d\.]+$/;

function init() {
  this._super(...arguments);
  const doc = this.get('doc');

  const head = doc.createTextNode('');
  const tail = doc.createTextNode('');

  this.set('nodes', { head, tail });
  this.set('flags', { sent: false });
}

function willRender() {
  this._super(...arguments);

  const { isDestroyed: destroyed, handle, flags } = this;
  const root = this.get('popups.root');
  const bounding = this.get('popups').bounding(handle);

  if(destroyed || !root || flags.sent) {
    return false;
  }

  const left = NUMERIC_RE.test(bounding.left) ? `${bounding.left}px` : bounding.left;
  const top = NUMERIC_RE.test(bounding.top) ? `${bounding.top}px` : bounding.top;

  function send() {
    const { head, tail } = this.get('nodes');
    let cursor = head;
    const { parentNode: parent } = cursor;

    while(cursor) {
      parent.removeChild(cursor);
      root.insertBefore(cursor, null);

      if(cursor.nodeType === ELEMENT_NODE_TYPE && bounding.width) {
        cursor.style.width = bounding.width;
      }

      if(cursor.nodeType === ELEMENT_NODE_TYPE) {
        cursor.style.position = 'absolute';
        cursor.style.left = left;
        cursor.style.top = top;
        cursor.dataset.handle = handle.id;
      }

      cursor = cursor && cursor !== tail ? parent.firstChild : null;
    }

    this.set('flags', { sent: true });
  }

  run.schedule('afterRender', send.bind(this));
}

function willDestroyElement() {
  this._super(...arguments);
  const { isDestroyed: destroyed } = this;

  if(destroyed) {
    return false;
  }

  const { element } = this;
  const { head, tail } = this.get('nodes');
  let cursor = head;
  const { parentNode: parent } = cursor;

  while(cursor) {
    const next = cursor.nextSibling;
    parent.removeChild(cursor);
    element.insertBefore(cursor, null);

    if(cursor === tail) {
      break;
    }

    cursor = next;
  }

  this.set('flags', { sent: false });
}

export default Component.extend({
  classNames: ['popup-manager__wormhole'],
  init, willRender, willDestroyElement,
  popups: inject.service(),
  doc: inject.service('-document'),
});
