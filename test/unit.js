var TEST_REGEXP = /spec\.js$/;
var tests       = [];
var file_names  = Object.keys(window.__karma__.files);

function pathToModule(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

for(var i =  0, c = file_names.length; i < c; i++) {
  var file = file_names[i];
  if(TEST_REGEXP.test(file)) tests.push(pathToModule(file));
}

define("charcoal/config/environment", [], function() {
  var config = {
    locale_root: "/api/locales",
    api_root: "/api",
  };

  return config;
});

function start() {
  require(["bluebird"], function(bluebird) {
    window.Promise = window.Promise || bluebird;
    window.__karma__.start();
  });
}

require.config({
  baseUrl: '/base',
  paths: {
    "test-views": "/base/test/views",
    "test-helpers": "/base/test/helpers",
    "charcoal": "/base/src/js",
    "react": "/base/node_modules/react/dist/react",
    "react-dom": "/base/node_modules/react-dom/dist/react-dom",
    "bluebird": "/base/node_modules/bluebird/js/browser/bluebird",
    "hoctable": "/base/node_modules/hoctable/dist/es5/hoctable/hoctable",
    "page": "/base/node_modules/page/page",
    "qwest": "/base/node_modules/qwest/qwest.min"
  },
  shim: {},
  deps: tests,
  callback: start
});
