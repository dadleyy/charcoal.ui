import router from "charcoal/router";
import ajax from "test-helpers/ajax";
import config from "charcoal/config/environment";

describe("router test suite", function() {

  let bag = { };

  beforeEach(ajax.install);
  afterEach(ajax.uninstall);

  beforeEach(function() {
    const main = document.createElement("div");
    main.setAttribute("id", "main");
    document.body.appendChild(main);
    bag = { main };
  });

  afterEach(function() {
    document.body.removeChild(bag.main);
    router.stop();
  });

  describe("having registered a catch-all route", function() {

    const route = {
      path: "*",
      view: "test-views/dummy",
      resolve() {
      },
    };

    beforeEach(function() {
      router.register(route);
      router.start();
    });

    afterEach(function() {
      const { latest } = ajax.requests;
      latest.send({}, 422);
    });

    it("should attempt to prep the \"auth\" service", function() {
      const { url } = ajax.requests.latest;
      expect(url).toBe(`${config.api_root}/auth/user`);
    });

  });

  describe("having registered a guest route", function() {

    const route = {
      path: "*",
      view: "test-views/dummy",
      resolve() {
      },
    };

    beforeEach(function() {
      router.register(route);
      router.start();
    });

    afterEach(function() {
      const { latest } = ajax.requests;
      latest.send({}, 422);
    });

    it("should NOT attempt to prep the \"auth\" service", function() {
      const { url } = ajax.requests.latest;
      expect(url).toBe(`${config.api_root}/auth/user`);
    });

  });

});
