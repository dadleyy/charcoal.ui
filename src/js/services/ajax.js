import qwest from "qwest";

const ajax = {

  async get() {
    const { status, responseText } = await qwest.get(...arguments);

    if(status > 299) {
      throw new Error(`invalid status ${status}: ${responseText}`);
    }

    return JSON.parse(responseText);
  }

};

export default ajax;
