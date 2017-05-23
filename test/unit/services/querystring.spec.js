import querystring from "charcoal/services/querystring";

describe("querystring service", function() {

  let bag = null;

  describe("with valid string", function() {

    beforeEach(function() {
      const string = "foo=bar";
      const query = querystring(string);
      bag = { string, query };
    });

    it("should parse correctly", function() {
      const { query } = bag;
      const foo = query.get("foo");
      expect(foo).toBe("bar");
    });

  });

});
