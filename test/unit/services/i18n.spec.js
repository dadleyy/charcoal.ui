import config from "charcoal/config/environment";
import i18n from "charcoal/services/i18n";
import ajax from "test-helpers/ajax";

describe("i18n test suite", function() {

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

    const TEST_ENTRY = "this is a test";
    const OTHER_TEST_ENTRY = "this is another test";

    beforeEach(function(done) {
      i18n.set("en").then(done);
      const { latest } = ajax.requests;
      latest.send({ test: TEST_ENTRY, other: { test: OTHER_TEST_ENTRY } });
    });

    it("should return the matching lookup for valid strings", function() {
      const result = i18n("test");
      expect(result).toBe(TEST_ENTRY);
    });

    it("should return the matching lookup for valid strings w/ separator", function() {
      const result = i18n("other.test");
      expect(result).toBe(OTHER_TEST_ENTRY);
    });

  });

});
