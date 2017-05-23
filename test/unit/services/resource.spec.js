import resource from "charcoal/services/resource";
import ajax from "test-helpers/ajax";

describe("resource test suite", function() {

  let bag = { };

  beforeEach(ajax.install);
  afterEach(ajax.uninstall);

  beforeEach(function() {
    bag = { };
  });

  describe("having only been provided a url template", function() {

    beforeEach(function() {
      bag.r = resource("/api{/id}");
    });

    describe("#query", function() {

      it("makes a GET request w/ basic query parameters", function() {
        bag.r.query({ foo: "bar" });
        const { latest } = ajax.requests;
        expect(latest.method).toBe("GET");
        expect(latest.url).toBe("/api?foo=bar");
      });

      it("makes a GET request w/ special \"where\" query parameters", function() {
        bag.r.query({ where: { foo: "bar" }});
        const { latest } = ajax.requests;
        expect(latest.method).toBe("GET");
        expect(latest.raw_url).toBe("/api?filter[foo]=eq(bar)");
      });

      it("makes a GET request w/ url template params filled", function() {
        bag.r.query({ id: 1 });
        const { latest } = ajax.requests;
        expect(latest.method).toBe("GET");
        expect(latest.raw_url).toBe("/api/1");
      });

    });

  });

});
