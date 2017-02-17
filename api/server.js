const express = require("express");
const proxy   = require("express-http-proxy");
const dotenv  = require("dotenv");
const url     = require("url");
const qs      = require("querystring");

dotenv.load();

const API_URL       = process.env['API_URL'];
const CLIENT_ID     = process.env["API_CLIENT_ID"];
const CLIENT_SECRET = process.env["API_CLIENT_SECRET"];

function forwardPath(req, res) {
  let { pathname, query } = url.parse(req.url);
  let params = qs.parse(query);
  let result = [pathname, qs.stringify(params)].join("?");
  console.log(`querying ${result}`);
  return result;
}

console.log(`proxy to ${API_URL}`);

const app  = express();
const mw   = proxy(API_URL, {forwardPath});
const port = process.argv.length === 3 ? process.argv[2] : "8080";

console.log(`starting server on port ${port}`);
app.use(mw);
app.listen(port);
