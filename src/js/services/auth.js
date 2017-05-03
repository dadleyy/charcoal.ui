import config from "charcoal/config/environment";
import qwest from "qwest";

const { api_root } = config;

let internals = { };

const auth = {

  get user() {
    const { user } = internals;

    return user ? { ...user } : null;
  },

  async prep() {
    const { prepared } = internals;

    if(prepared) {
      return { ...internals };
    }

    try {
      const { results, meta } = await qwest.get(`${api_root}/auth/user`);
      const [ user ] = results;
      internals = { meta, user };
    } catch (e) {
      internals = { guest : true, prepared : true };
      throw e;
    }

    return { ...internals };
  },

  reset() {
    internals = { };
  }

};

export default auth;
