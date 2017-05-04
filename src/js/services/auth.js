import config from "charcoal/config/environment";
import Evented from "charcoal/util/evented";
import ajax from "charcoal/services/ajax";

export const EVENTS = { USER_AUTHENTICATED : 1 };

const { api_root } = config;

const events = new Evented();

let internals = { events };

const auth = {

  on() {
    events.on(...arguments);
  },

  off() {
    events.off(...arguments);
  },

  get user() {
    const { user } = internals;

    return user ? { ...user } : null;
  },

  async attempt(token) {
    const { results, meta } = await ajax.get(`${api_root}/auth/user`, { token });

    const [ user ] = results;
    internals = { meta, user, prepared : true };

    if(user) {
      events.trigger(EVENTS.USER_AUTHENTICATED);
    }

    return !!user;
  },

  async prep() {
    const { prepared } = internals;

    if(prepared) {
      return { ...internals };
    }

    try {
      const { results, meta } = await ajax.get(`${api_root}/auth/user`);
      const [ user ] = results;
      internals = { meta, user };
    } catch (e) {
      internals = { guest : true, prepared : true };
      throw e;
    }

    if(internals.user) {
      events.trigger(EVENTS.USER_AUTHENTICATED);
    }

    return { ...internals };
  },

  reset() {
    internals = { };
  }

};

export default auth;
