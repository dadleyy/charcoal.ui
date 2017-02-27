import Ember from 'ember';

const { Component, inject } = Ember;

const actions = {
  open() {
    const { element } = this;
    const popups = this.get('popups');
    const handle = this.get('handle');
    let { top, left, height } = element.getBoundingClientRect();

    top += height + window.scrollY;

    popups.open(handle, { top, left });
  }
};

const classNames = ['hoc-menu__button-container'];

export default Component.extend({ popups: inject.service(), actions, classNames }); 
