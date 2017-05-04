import router from "charcoal/router";
import auth from "charcoal/services/auth";
import ajax from "test-helpers/ajax";
import dom from "test-helpers/dom";
import config from "charcoal/config/environment";
import view from "test-views/dummy";
import page from "page";

describe("router test suite", function() {

  let bag = { };

  beforeEach(ajax.install);
  afterEach(ajax.uninstall);

  beforeEach(dom.setup);
  afterEach(dom.teardown);

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
    const page_options = { hashbang: true, popstate: true, base_url: '/context.html' };
    const flags = { loaded_login: false };

    bag = { page_options, flags };

    router.register(root);
    router.register(login);
  });

  function start() {
    router.start(bag.page_options);
  }

  afterEach(function() {
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

  describe("hacing a route that fails during resolve" ,function() {

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

  describe("resolve error handling", function() {

    const error_text = "something went wrong";

    const route = {
      path: "/guest-route",
      view: "test-views/dummy",
      guest: true,
      resolve(dep_one) {
        throw new Error(error_text);
      }
    };

    beforeEach(function() {
      router.register(route); 
      bag.error_text = error_text;
    });

    beforeEach(start);

    beforeEach(function(done) {
      page("/guest-route");
      setTimeout(done, 200);
    });

    it("should have rendered the error view", function() {
      const error = dom.find("[data-role=application-error] [data-role=error-value]")[0];
      expect(error.value).toBe(error_text);
    });

  });

  describe("having registered a guest route w/ dependencies", function() {

    const route = {
      path: "/guest-route",
      view: "test-views/dummy",
      guest: true,
      resolve(dep_one) {
        bag.resolved_dependencies = [ dep_one ];
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
      expect(bag.resolved_dependencies.length).toBe(1);
    });

  });

});
