import Bluebird from "bluebird";

const deferred = {

  get Promise() {
    return Bluebird;
  },

  make() {
    const result = { };

    result.promise = new Bluebird(function(resolve, reject) {
      result.resolve = resolve;
      result.reject = reject;
    });

    return result;
  }

};

export default deferred;
