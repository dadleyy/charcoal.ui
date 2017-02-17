const path = require("path");

const base = __dirname;

let dist = {
  app: path.join(base, "dist", "app"),
  docs: path.join(base, "dist", "docs")
};

module.exports = { base, dist };

