import qwest from "qwest";

const ajax = {

  async patch() {
    const { status, responseText } = await qwest.map("PATCH", ...arguments);

    if(status > 299) {
      throw new Error(`invalid status ${status}: ${responseText}`);
    }

    return JSON.parse(responseText);
  },

  async post() {
    const { status, responseText } = await qwest.post(...arguments);

    if(status > 299) {
      throw new Error(`invalid status ${status}: ${responseText}`);
    }

    return JSON.parse(responseText);
  },

  async get() {
    const { status, responseText } = await qwest.get(...arguments);

    if(status > 299) {
      throw new Error(`invalid status ${status}: ${responseText}`);
    }

    return JSON.parse(responseText);
  }

};

export default ajax;
