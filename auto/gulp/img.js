"use strict";

const path = require("path");
const del  = require("del");
const cfg  = require("./config");

module.exports = function(gulp) {
  let dist = cfg.path("dist.app");
  const base = cfg.path("base");

  gulp.task("clean:img", function() {
    return del([path.join(dist, "assets/img")]);
  });

  gulp.task("img", ["clean:img"], function() {
    const cwd = path.join(base, "src/img");
    const dest = gulp.dest(path.join(dist, "assets/img"));
    return gulp.src("**/*", { cwd }).pipe(dest);
  });

};
