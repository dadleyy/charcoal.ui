const babel = require("babel-core");
const path = require("path");

module.exports = function(config) {
  let browsers   = ["PhantomJS"];
  let frameworks = ["requirejs", "jasmine-ajax", "jasmine"];
  let reporters  = ["dots", "narrow"];
  const npm_root = path.join(__dirname, "./node_modules");

  function vendor(lib_path) {
    return path.join(npm_root, lib_path);
  }

  const source_processors = process.env["DISABLE_LINT"] ? ["babel"] : ["eslint", "babel"];

  let preprocessors = {
    "src/**/*.js": source_processors,
    "src/**/*.jsx": source_processors,

    "src/**/*.ts": ["typescript"],
    "src/**/*.tsx": ["typescript"],

    "test/views/**/*.jsx": ["babel"],
    "test/unit/**/*.js": ["babel"],
    "test/fixtures/**/*.js": ["babel"],
    "test/helpers/**/*.js": ["babel"],
    "test/unit.js": ["babelexternal"]
  };

  let files = [
    {pattern: "./test/unit/**/*.spec.js", included: false},
    {pattern: "./test/fixtures/**/*.js", included: false},
    {pattern: "./test/helpers/**/*.js", included: false},
    {pattern: "./test/views/**/*.jsx", included: false},

    {pattern: "./src/**/*.ts", included: false},
    {pattern: "./src/**/*.tsx", included: false},

    {pattern: vendor("page/page.js"), included: false},
    {pattern: vendor("bluebird/js/browser/bluebird.js"), included: false},
    {pattern: vendor("react/dist/react.js"), included: false},
    {pattern: vendor("react-dom/dist/react-dom.js"), included: false},
    {pattern: vendor("hoctable/dist/es5/hoctable/**/*.js"), included: false},
    {pattern: vendor("qwest/qwest.min.js"), included: false},
    {pattern: vendor("moment/moment.js"), included: false},
    {pattern: vendor("uri-templates/uri-templates.js"), included: false},

    {pattern: "./src/**/*.js", included: false},
    {pattern: "./src/**/*.jsx", included: false},

    vendor("regenerator-runtime/runtime.js"),
    "./test/unit.js"
  ];

  function inject(content, file, done) {
    content = babel.buildExternalHelpers() + "\n" + content;
    done(null, content);
  }

  function external() {
    return inject;
  }

  let plugins = [
    "karma-eslint",
    "karma-jasmine",
    "karma-jasmine-ajax",
    "karma-requirejs",
    "karma-babel-preprocessor",
    "karma-typescript-preprocessor",
    "karma-phantomjs-launcher",
    "karma-chrome-launcher",
    "karma-narrow-reporter",
    "karma-anybar-reporter",
    {"preprocessor:babelexternal": ["factory", external]},
  ];

  let options = {preprocessors, browsers, plugins, frameworks, files};

  options.babelPreprocessor = {
    options: {
      presets: ["es2015", "react"],
      plugins: [
        "external-helpers", 
        "transform-es2015-modules-amd",
        "transform-object-rest-spread",
        "transform-async-to-generator"
      ]
    },
    filename: function (file) {
      return file.originalPath.replace(/\.jsx$/, ".js");
    }
  };

  options.anybar = {
    colors: {
      failed: "exclamation",
      running: "black",
      success: "green"
    }
  };

  options.eslint = {
    errorThreshold: 1000,
    stopAboveErrorThreshold: true,
    stopOnError: true,
    stopOnWarning: true,
    showWarnings: true,
    engine: {
      configFile: path.join(__dirname, "./.eslintrc")
    }
  };

  options.typescriptPreprocessor = {
    options: {
      sourceMap         : false,
      target            : "ES5",
      module            : "amd",
      noImplicitAny     : false,
      noResolve         : true,
      removeComments    : true,
      concatenateOutput : false
    },
    transformPath: function(path) {
      return path.replace(/\.ts$/, ".js");
    }
  };

  options.narrowReporter = {
    showSuccess: true
  };

  config.set(options);
};
