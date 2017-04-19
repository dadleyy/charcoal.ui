import Bluebird from "bluebird";

const deferred = {

  get Promise() {
    return Bluebird;
  },

  make() {
    let
    result = { };

    result.promise = new Bluebird(function(resolve, reject) {
      result = { ...result, resolve, reject };
    });

    return result;
  }

};

export default deferred;
