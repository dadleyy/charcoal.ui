"use strict";

const path = require("path");
const del  = require("del");
const pug  = require("gulp-pug");
const cfg  = require("./config");

module.exports = function(gulp) {
  const base = cfg.path("base");
  const dist = cfg.path("dist.app");
  const index_src = path.join(base, "src/html/index.pug");
  const index_out = path.join(dist, "index.html");

  const locals = {
    API_HOME: process.env["API_PROXY_HOME"]
  };

  gulp.task("clean:html", function() {
    return del([index_out]);
  });

  gulp.task("html:release", ["clean:html"], function() {
    const out = gulp.dest(dist);
    const compile = pug({ locals, pretty: false });

    return gulp.src(index_src).pipe(compile).pipe(out);
  });

  gulp.task("html", ["clean:html"], function() {
    const compile = pug({ locals, pretty: true });
    const out = gulp.dest(dist);

    return gulp.src(index_src).pipe(compile).pipe(out);
  });

};
