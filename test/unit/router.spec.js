import router from "charcoal/router";
import auth from "charcoal/services/auth";
import ajax from "test-helpers/ajax";
import config from "charcoal/config/environment";
import view from "test-views/dummy";
import page from "page";

describe("router test suite", function() {

  let bag = { };

  beforeEach(ajax.install);
  afterEach(ajax.uninstall);
  beforeEach(auth.reset);

  const login = {
    path: "/login",
    guest: true,
    view: "test-views/dummy",
    resolve() {
      bag.flags.loaded_login = true;
    }
  };

  const root = { 
    path: "/",
    guest: true,
    view: "test-views/dummy",
    resolve() {
      bag.flags.loaded_root = true;
    }
  };

  beforeEach(function() {
    const main = document.createElement("div");
    const page_options = { hashbang: true, popstate: true, base_url: '/context.html' };
    const flags = { loaded_login: false };

    main.setAttribute("id", "main");
    document.body.appendChild(main);

    bag = { main, page_options, flags };

    router.register(root);
    router.register(login);
  });

  function start() {
    router.start(bag.page_options);
  }

  afterEach(function() {
    document.body.removeChild(bag.main);
    router.stop();
  });

  describe("having registered a route w/o guest access", function() {

    const route = {
      path: "/foobar",
      view: "test-views/dummy",
      resolve() {
        bag.flags.loaded_foobar = true;
      },
    };

    beforeEach(function() {
      router.register(route);
    });

    beforeEach(start);

    beforeEach(function(done) {
      page("/foobar");
      return done();
    });

    it("should attempt to prep the \"auth\" service", function() {
      const { url } = ajax.requests.latest;
      expect(url).toBe(`${config.api_root}/auth/user`);
    });

    describe("having recevied bad status from auth call", function() {

      beforeEach(function(done) {
        const { latest } = ajax.requests;
        latest.send({}, 422);
        setTimeout(done, 300);
      });

      it("should have redirected to the login route", function() {
        expect(bag.flags.loaded_login).toBe(true);
        expect(bag.flags.loaded_foobar).not.toBe(true);
      });

    });

  });

  describe("having registered a guest route", function() {

    const route = {
      path: "/guest-route",
      view: "test-views/dummy",
      guest: true,
      resolve() {
        bag.flags.loaded_guest_route = true;
      },
    };

    beforeEach(function() {
      page("/guest-route");
      router.register(route); 
    });

    beforeEach(start);

    beforeEach(function(done) {
      setTimeout(done, 200);
    });

    it("should not attempt to prep the \"auth\" service", function() {
      const { latest } = ajax.requests;
      expect(latest).toBe(null);
      expect(bag.flags.loaded_login).toBe(false);
      expect(bag.flags.loaded_guest_route).toBe(true);
    });

  });

  describe("having registered a guest route w/ dependencies", function() {

    const route = {
      path: "/guest-route",
      view: "test-views/dummy",
      guest: true,
      resolve(dep_one) {
        expect(typeof dep_one.default.install).toBe("function");
        bag.flags.loaded_guest_route = true;
        return { };
      },
      dependencies: [
        "test-helpers/ajax"
      ]
    };

    beforeEach(function() {
      router.register(route); 
    });

    beforeEach(start);

    beforeEach(function(done) {
      page("/guest-route");
      setTimeout(done, 200);
    });

    it("should not attempt to prep the \"auth\" service", function() {
      const { latest } = ajax.requests;
      expect(latest).toBe(null);
      expect(bag.flags.loaded_login).toBe(false);
      expect(bag.flags.loaded_guest_route).toBe(true);
    });

  });

});
