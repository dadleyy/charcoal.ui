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

  const docs_out = path.join(docs_dest, "js");

  const npm_root = path.join(base, "node_modules");
  const vendor_bundle_file = path.join(app_dest, "assets/vendors/bundle.js");

  function vendor(lib_path) {
    return path.join(npm_root, lib_path);
  }

  let vendors = [
    vendor("requirejs/require.js"),
    vendor("regenerator-runtime/runtime.js")
  ];

  let presets = ["es2015", "react"];

  let plugins = [
    "external-helpers", 
    "transform-es2015-modules-amd",
    "transform-object-rest-spread",
    "transform-async-to-generator"
  ];

  let rjs_conf = { };

  gulp.task("clean:js:docs", function() {
    return del([docs_out]);
  });

  gulp.task("clean:js", ["clean:js:docs"], function() {
    const dirs = [vendor_bundle_file, js_out, js_tmp];
    return del(dirs);
  });

  gulp.task("js:docs", ["clean:js:docs"], function() {
    const cwd = js_src;
    const out = gulp.dest(docs_out);

    return gulp.src(["**/*.js", "**/*.jsx"], { cwd }).pipe(docs()).pipe(out);
  });

  gulp.task("js:vendors:release", function() {
    return gulp.src(vendors)
      .pipe(concat("bundle.js"))
      .pipe(gulp.dest(path.dirname(vendor_bundle_file)))
      .pipe(uglify())
      .pipe(gulp.dest(path.dirname(vendor_bundle_file)));
  });

  gulp.task("js:vendors", function() {
    return gulp.src(vendors)
      .pipe(concat("bundle.js"))
      .pipe(gulp.dest(path.dirname(vendor_bundle_file)));
  });

  gulp.task("js:ts", ["clean:js"], function() {
    const config_file = path.join(base, "tsconfig.json");
    const project = tsc.createProject(config_file);
    const cwd = js_src;
    const out = gulp.dest(js_tmp);

    return gulp.src(["**/*.ts", "**/*.tsx"], { cwd }).pipe(project()).pipe(out);
  });

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

  gulp.task("js:copy", ["js:babel", "js:vendors"], function() {
    const cwd = js_tmp;
    const out = gulp.dest(js_out);

    return gulp.src("**/*.js", { cwd }).pipe(out);
  });

  gulp.task("js:config", ["js:copy"], function() {
    const config = require(config_in);
    const { base, dir } = path.parse(config_out);
    return file(base, config.contents, { src: true }).pipe(babel({ presets, plugins })).pipe(gulp.dest(dir));
  });

  function bundle(opts = { }) {
    const cwd = js_tmp;

    const compiler = rjs({
      include : ["main"],
      optimize : "none",
      paths: {
        "charcoal": cwd,
        "page": vendor("page/page"),
        "bluebird": vendor("bluebird/js/browser/bluebird"),
        "react": vendor(opts.min === true ? "react/dist/react.min" : "react/dist/react"),
        "react-dom": vendor(opts.min === true ? "react-dom/dist/react-dom.min" : "react-dom/dist/react-dom"),
        "hoctable": vendor("hoctable/dist/es5/hoctable/hoctable"),
        "qwest": vendor("qwest/qwest.min")
      }
    });

    compiler.on("error", function(err) {
      console.error(err);
    });

    const out = gulp.dest(js_out);
    return gulp.src(["main.js"], { cwd }).pipe(compiler).pipe(out);
  };

  bundle.min = function() {
    return bundle({ min: true });
  };

  gulp.task("js", ["js:config"], bundle);

  gulp.task("js:release:bundle", ["js:config"], bundle.min);

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
