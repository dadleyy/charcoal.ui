import qwest from "qwest";

const ajax = {

  async get() {
    const { responseText } = await qwest.get(...arguments);

    return JSON.parse(responseText);
  }

};

export default ajax;
