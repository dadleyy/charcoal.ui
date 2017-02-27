import Ember from 'ember';
import Events from 'charcoal/mixins/event-handles';

const { run, inject, Service } = Ember;

function empty() {
  return { active: [], idle: [] };
}

function mount(root) {
  const { active, idle } = this.get('pool') || empty();
  this.set('pool', { active, idle });
  this.set('active', active.length >= 1);
  this.set('root', root);
}

function allocate(flags = { close: [ ] }) {
  const { active, idle } = this.get('pool') || empty();
  const id = this.get('uuid').generate();
  const get = this.get.bind(this);

  const handle = { id, flags };

  function isOpen() {
    const { active } = get('pool');

    for(let i = 0, c = active.length; i < c; i ++) {
      const { handle } = active[i];

      if(handle.id === this.id) {
        return true;
      }
    }

    return false;
  }

  Object.defineProperty(handle, 'open', { get: isOpen });

  idle.push(handle);

  this.set('pool', { active, idle });
  return handle;
}

function free(target) {
  close.call(this, target);
  const pool = this.get('pool');
  const active = pool.active.filter(function({ handle }) { return handle.id !== target.id; });
  const idle = pool.idle.filter(function({ id }) { return id !== target.id; });
  this.set('pool', { active, idle });
}

function close(target) {
  const { active, idle } = this.get('pool');
  let found = null;

  for(let i = 0, c = active.length; i < c; i++) {
    const { handle } = active[i];

    if(handle.id !== target.id) {
      continue;
    }

    found = i;
    break;
  }

  if(found === null) {
    return -1;
  }

  let [ match ] = active.splice(found, 1);
  idle.push(match.handle);

  const pool = { active, idle };

  run.next(this, this.setProperties, { pool, opening: Date.now() });
}

function open(handle, bounding) {
  const { active, idle } = this.get('pool');
  let found = null;

  if(idle.length === 0) {
    return -1;
  }

  /*
  const [ current ] = active;

  if(current) {
    close.call(this, current.handle);
  }
  */

  for(var i = 0, c = idle.length; i < c; i++) {
    const { id } = idle[i];

    if(id !== handle.id) {
      continue;
    }

    found = i;
    break;
  }

  if(found === null) {
    return -1;
  }

  let [ target ] = idle.splice(found, 1);
  active.push({ handle: target, bounding });

  const pool = { active, idle };
  this.setProperties({ pool, opening: true });

  function finish() {
    this.set('opening', false);
  }

  run.next(this, finish);
}

function bounding(target) {
  const { active } = this.get('pool');

  for(let i = 0, c = active.length; i < c; i++) {
    const { handle, bounding } = active[i];

    if(handle.id === target.id) {
      return bounding;
    }
  }

  return null;
}

function find(handle_id) {
  const { active, idle } = this.get('pool'); 
  let [ r ] = active.filter(function({ handle }) { return handle.id === handle_id; });

  if(r) {
    return r.handle;
  }

  return idle.filter(function({ id }) { return id === handle_id; })[0];
}

export default Service.extend(Events, {
  allocate, free, mount, open, bounding, close, find,
  uuid: inject.service()
});
