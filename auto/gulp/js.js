"use strict";

const path    = require("path");
const del     = require("del");
const concat  = require("gulp-concat");
const babel   = require("gulp-babel");
const helpers = require("gulp-babel-external-helpers");
const uglify  = require("gulp-uglify");
const rjs     = require("gulp-requirejs-optimize");
const file    = require("gulp-file");
const merge   = require("merge-stream");
const docs    = require("gulp-yuidoc");
const tsc     = require("gulp-typescript");
const eslint  = require('gulp-eslint');
const yaml    = require('gulp-yaml');
const cfg     = require("./config");

module.exports = function(gulp) {
  const base = cfg.path("base");
  const app_dest = cfg.path("dist.app");
  const docs_dest = cfg.path("dist.docs");

  const eslint_config = path.join(base, ".eslintrc");

  const js_src = path.join(base, "src/js");
  const js_out = path.join(app_dest, "assets/js");
  const js_tmp = path.join(base, "tmp/js");

  const config_out = path.join(js_tmp, "config/environment.js");
  const config_in = path.join(base, "config/environment");

  const locales_out = path.join(app_dest, "assets/locales");

  const docs_out = path.join(docs_dest, "js");

  const npm_root = path.join(base, "node_modules");
  const vendor_bundle_file = path.join(app_dest, "assets/vendors/bundle.js");

  function vendor(lib_path) {
    return path.join(npm_root, lib_path);
  }

  const vendors = [
    vendor("requirejs/require.js"),
    vendor("regenerator-runtime/runtime.js")
  ];

  const presets = ["es2015", "react"];

  const plugins = [
    "external-helpers", 
    "transform-es2015-modules-amd",
    "transform-object-rest-spread",
    "transform-async-to-generator"
  ];

  /* This function is used to optimize the main.js file and it's dependency tree into a single file. The files outside
   * of it's tree will be lazy-loaded via requirejs during the runtime of the application.
   */
  function bundle(opts = { }) {
    const cwd = js_tmp;

    const paths = {
      "charcoal"      : js_tmp,
      "page"          : vendor("page/page"),
      "bluebird"      : vendor("bluebird/js/browser/bluebird"),
      "react"         : vendor(`react/dist/react-with-addons${opts.min ? ".min" : ""}`),
      "react-dom"     : vendor(`react-dom/dist/react-dom${opts.min === true ? ".min" : ""}`),
      "hoctable"      : vendor("hoctable/dist/es5/hoctable/hoctable"),
      "moment"        : vendor("moment/moment"),
      "uri-templates" : vendor("uri-templates/uri-templates"),
      "qwest"         : vendor("qwest/qwest.min")
    };

    const eager_load = [
      "moment",
      "uri-templates",
      "bluebird",
      "react"
    ];

    const rjs_conf = {
      paths,
      include : ["main"],
      optimize : "none",
      insertRequire: eager_load,
      include: eager_load.concat("main")
    };

    const compiler = rjs(rjs_conf);

    compiler.on("error", function(err) {
      console.error(err);
    });

    const out = gulp.dest(js_out);
    return gulp.src(["main.js"], { cwd }).pipe(compiler).pipe(out);
  };

  /* This function is during the `gulp:release` process and tells the bundler to use the optimized versions of vendor
   * libraries that complain if their un-minified version is being used in the application (react, react-dom).
   */
  bundle.min = function() {
    return bundle({ min: true });
  };

  /* clean:js:docs
   *
   * Removes any files/directories associated with javascript documentation.
   */
  gulp.task("clean:js:docs", function() {
    return del([docs_out]);
  });

  /* clean:js
   *
   * Removes any files/directories associated with javascript application itself.
   */
  gulp.task("clean:js", ["clean:js:docs"], function() {
    const dirs = [vendor_bundle_file, js_out, js_tmp];
    return del(dirs);
  });

  /* js:docs
   *
   * Generates javascript documentation for the application.
   */
  gulp.task("js:docs", ["clean:js:docs"], function() {
    const cwd = js_src;
    const out = gulp.dest(docs_out);

    return gulp.src(["**/*.js", "**/*.jsx"], { cwd }).pipe(docs()).pipe(out);
  });

  /* js:vendors
   *
   * It is necessary for some vendor libraries to be exposed in the browser as globals during runtime. This includes
   * requirejs, which is used to lazy-load dependencies during the routing engine.
   */
  gulp.task("js:vendors", function() {
    return gulp.src(vendors)
      .pipe(concat("bundle.js"))
      .pipe(gulp.dest(path.dirname(vendor_bundle_file)));
  });

  /* js:vendors:release
   *
   * Like js:vendors, but w/ minification.
   */
  gulp.task("js:vendors:release", function() {
    return gulp.src(vendors)
      .pipe(concat("bundle.js"))
      .pipe(gulp.dest(path.dirname(vendor_bundle_file)))
      .pipe(uglify())
      .pipe(gulp.dest(path.dirname(vendor_bundle_file)));
  });

  /* js:ts
   *
   * Compiles typescript files to the js_tmp directory.
   */
  gulp.task("js:ts", ["clean:js"], function() {
    const config_file = path.join(base, "tsconfig.json");
    const project = tsc.createProject(config_file);
    const cwd = js_src;
    const out = gulp.dest(js_tmp);

    return gulp.src(["**/*.ts", "**/*.tsx"], { cwd }).pipe(project()).pipe(out);
  });

  /* js:babel
   *
   * Compiles es6 and jsx fils to the js_tmp directory. Also runs eslint during the process.
   */
  gulp.task("js:babel", ["js:ts"], function() {
    const vanilla = gulp.src(["**/*.js", "**/*.jsx"], { cwd: js_src });
    const out = gulp.dest(js_tmp)

    return vanilla
      .pipe(eslint(eslint_config))
      .pipe(eslint.format())
      .pipe(babel({ presets, plugins }))
      .pipe(helpers("helpers.js"))
      .pipe(out);
  });

  /* js:copy
   *
   * Copies compiled files from the js_tmp directory to the final distributable directory.
   */
  gulp.task("js:copy", ["js:babel", "js:vendors"], function() {
    const cwd = js_tmp;
    const out = gulp.dest(js_out);

    return gulp.src("**/*.js", { cwd }).pipe(out);
  });

  gulp.task("js:runtime-config:locales", ["js:copy"], function() {
    const cwd = path.join(base, "config/locales");
    const out = gulp.dest(locales_out);

    return gulp.src("**/*.yml", { cwd })
      .pipe(yaml({ schema: 'DEFAULT_SAFE_SCHEMA' }))
      .pipe(out)
  });

  /* js:runtime-config:environment
   *
   * Creates a config/environment file for use during runtime with compile-time environment variables.
   */
  gulp.task("js:runtime-config:environment", ["js:runtime-config:locales"], function() {
    const config = require(config_in);
    const { base, dir } = path.parse(config_out);

    return file(base, config.contents, { src: true })
      .pipe(babel({ presets, plugins }))
      .pipe(gulp.dest(dir));
  });

  gulp.task("js", ["js:runtime-config:environment"], bundle);

  gulp.task("js:release:bundle", ["js:runtime-config:environment"], bundle.min);

  // js:release:unstage
  //
  // This task is responsible for deleting any files from the temp directory created during the compilation
  gulp.task("js:release:unstage", ["js:release:bundle"], function() {
    return del([js_tmp]);
  });

  gulp.task("js:release:stage", ["js:release:unstage"], function() {
    const cwd = js_out;
    const out = gulp.dest(js_tmp);

    return gulp.src(["**/*.js"], { cwd }).pipe(out);
  });

  gulp.task("js:release:clean", ["js:release:stage"], function() {
    const pattern = path.join(js_out, "**/*");

    return del([pattern]);
  });

  gulp.task("js:release", ["js:release:clean"], function() {
    const cwd = path.join(base, "tmp/js");
    const out = gulp.dest(js_out);

    return gulp.src(["**/*.js"], { cwd }).pipe(uglify()).pipe(out);
  });

};
