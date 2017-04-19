import config from "charcoal/config/environment";
import qwest from "qwest";

const { api_root } = config;

let internals = { };

async function fetch() {
  return await qwest.get(`${api_root}/user`);
}

const auth = {

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

      return { guest : true };
    }

    return { ...internals };
  }

};

export default auth;
