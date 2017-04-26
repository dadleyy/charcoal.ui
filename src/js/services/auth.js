import config from "charcoal/config/environment";
import qwest from "qwest";

const { api_root } = config;

let internals = { };

async function fetch() {
  return await qwest.get(`${api_root}/auth/user`);
}

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
      const { results, meta } = await fetch();
      const [ user ] = results;
      internals = { meta, user };
    } catch (e) {
      internals = { guest : true, prepared : true };

      throw e;
    }

    return { ...internals };
  }

};

export default auth;
