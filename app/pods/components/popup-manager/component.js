import Ember from 'ember';

const { Component, inject, run } = Ember;

const ELEMENT_NODE_TYPE = 1;
const ESCAPE = 27;

function willDestroyElement() {
  const mouse = this.get('mouse');
  const keyboard = this.get('keyboard');
  const { mouse: mouse_id, keyboard: keyboard_id } = this.get('listeners');
  mouse.off(mouse_id);
  keyboard.off(keyboard_id);
}

function init() {
  this._super(...arguments);
  const mouse = this.get('mouse');
  const keyboard = this.get('keyboard');

  const check = () => {
    const popups = this.get('popups');
    const { active } = popups.get('pool');

    if(!active.length || this.get('popups.opening')) {
      return false;
    }

    const { childNodes: children } = this.element;

    for(let i = 0, c = children.length; i < c; i++) {
      const { nodeType: type, dataset } = children[i];

      if(type !== ELEMENT_NODE_TYPE || !dataset) {
        continue;
      }

      const handle = popups.find(dataset.handle);

      if(!handle) {
        continue;
      }

      const { flags } = handle;

      if(!flags.close || flags.close.indexOf('click') === -1) {
        continue;
      }

      run.next(popups, popups.close, handle);
    }
  };

  const escape = (evt) => {
    const { keyCode: code } = evt;
    const popups = this.get('popups');
    const { active } = popups.get('pool');

    if(code !== ESCAPE) {
      return;
    }

    let c = 0;

    while(active.length && ++c < 100) {
      let [{ handle }] = active;
      popups.close(handle);
    }
  };

  const listeners = { 
    mouse: mouse.click(check), 
    keyboard: keyboard.keyup(escape)
  };

  this.set('listeners', listeners);
}

function didRender() {
  const popups = this.get('popups');
  const { element } = this;
  popups.mount(element);
}

export default Component.extend({ 
  classNames: ['popup-manager'],
  willDestroyElement, didRender, init,
  mouse: inject.service(), 
  keyboard: inject.service(), 
  popups: inject.service(), 
});
