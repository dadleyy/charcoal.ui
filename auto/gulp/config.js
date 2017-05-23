const path = require("path");
const pkg = require("../../package.json");

function lookup(lookup_string) {
  const parts = lookup_string.split(".");
  let { build: dictionary } = pkg.config;

  while(parts.length && dictionary) {
    let next = parts.shift();
    dictionary = dictionary[next]
  }

  return dictionary;
};

lookup.path = function(lookup_string) {
  const val = lookup(lookup_string);
  return path.resolve(path.join(__dirname, "../../", val));
};

module.exports = lookup;
