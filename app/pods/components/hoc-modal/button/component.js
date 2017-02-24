import Ember from 'ember';

const { Component, inject } = Ember;

const actions = {
  open() {
    const popups = this.get('popups');
    const handle = this.get('handle');
    popups.open(handle, { top: '2vh', left: '2vw', width: '96vw' });
  }
};

export default Component.extend({ popups: inject.service(), actions }); 
