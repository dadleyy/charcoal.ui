import Ember from 'ember';

const { inject, Mixin } = Ember;
const POOL_PROPERTY = '_event-pool';

function trigger(event_name, ...event_details) {
  let pool = this.get(POOL_PROPERTY);

  if(!pool || pool.length === 0) {
    return;
  }

  for(let i = 0, c = pool.length; i < c; i++) {
    let { name, handler, context } = pool[i];

    if(name !== event_name) {
      continue;
    }

    handler.apply(context, ...event_details);
  }
}

function off(target_id) {
  let pool = this.get(POOL_PROPERTY);

  if(!pool || pool.length === 0) {
    return -1;
  }

  let new_pool = pool.filter(function({ id }) { return id !== target_id; });

  if(new_pool.length === pool.length) {
    return -1;
  }

  this.set(POOL_PROPERTY, new_pool);
  return target_id;
}

function on(name, handler, context) {
  if(typeof handler !== 'function') {
    return -1;
  }

  let id = this.get('uuid').generate();
  let pool = this.get(POOL_PROPERTY) || [ ];

  pool.push({ name, handler, context, id });
  this.set(POOL_PROPERTY, pool);
  return id;
}

export default Mixin.create({
  uuid: inject.service(),
  trigger, on, off 
});
