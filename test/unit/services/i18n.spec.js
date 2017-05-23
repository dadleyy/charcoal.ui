import config from "charcoal/config/environment";
import i18n from "charcoal/services/i18n";
import ajax from "test-helpers/ajax";

describe("i18n test suite", function() {

  const dictionary = {
    test: "this is a test",
    other: {
      test: "this is another test"
    },
    templated: "hello {{0}}, {{1}}"
  };

  beforeEach(function() {
    ajax.install();
  });

  afterEach(function() {
    ajax.uninstall();
  });

  it("should attempt to load in the locale file", function() {
    i18n.set("en");
    expect(ajax.requests.latest_url).toBe(`${config.locale_root}/en.json`);
  });

  describe("having successfully loaded in the locale file", function() {

    beforeEach(function(done) {
      i18n.set("en").then(done);
      const { latest } = ajax.requests;
      latest.send(dictionary);
    });

    it("should return the matching lookup for valid strings", function() {
      const result = i18n("test");
      expect(result).toBe(dictionary.test);
    });

    it("should return the matching lookup for valid strings w/ separator", function() {
      const result = i18n("other.test");
      expect(result).toBe(dictionary.other.test);
    });

    it("should template out variables appropriately", function() {
      let result = i18n("templated", "world", "how are you");
      expect(result).toBe("hello world, how are you");
      result = i18n("templated", "world", "how are you");
      expect(result).toBe("hello world, how are you");
    });

  });

});
