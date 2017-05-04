import utils from "hoctable/utils";

class Evented {

  constructor() {
    this.pool = [ ];
  }

  on(name, handler, context) {
    const { pool } = this;
    const uuid = utils.uuid();
    pool.push({ name, handler, context, uuid });

    return uuid;
  }

  off(id) {
    const { pool } = this;

    function missing({ uuid }) {
      return uuid !== id;
    }

    this.pool = pool.filter(missing);

    return this.pool.length !== pool.length;
  }

  trigger(event, ...event_properties) {
    const { pool } = this;

    for(let i = 0, c = pool.length; i < c; i++) {
      const { name, handler, context } = pool[i];

      if(name !== event) {
        continue;
      }

      handler.apply(context, event_properties);
    }

  }

  get length() {
    const { pool } = this;

    return pool.length;
  }

}

export default Evented;
