import Ember from 'ember';

const { Service } = Ember;

function ready() {
  const { ready, items, pages } = this.get('-queue');

  this.set('-queue.ready', true);

  for(let i = 0, c = items.length; i < c; i++) {
    let item = items[i];
    track.call(this, item);
  }

  for(let i = 0, c = pages.length; i < c; i++) {
    let { route, fields } = pages[i];
    page.call(this, route, fields);
  }
}

function send(type, ...params) {
  window.ga('send', type, ...params);
}

function track(event) {
  const { ready, items } = this.get('-queue');

  if(!ready) {
    items.push(event);
    return;
  }

  const { category, action, label, value } = event;
  return send('event', category, action, label, value);
}

function page(route, fields) {
  const { ready, pages } = this.get('-queue');

  if(!ready) {
    pages.push({ route, fields });
    return;
  }

  return send('pageview', route, fields);
}

function init() {
  this._super(...arguments);
  this.set('-queue', { ready: false, items: [ ], pages: [ ] });
}

export default Service.extend({ ready, track, init, page });
