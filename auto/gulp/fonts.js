"use strict";

const path = require("path");
const del  = require("del");
const cfg  = require("./config");

module.exports = function(gulp) {
  const dest = path.join(cfg.path("dist.app"), "assets/fonts");
  const base = cfg.path("base");

  gulp.task("clean:fonts", function() {
    return del([dest]);
  });

  gulp.task("fonts:font-awesome", ["clean:fonts"], function() {
    const cwd = path.join(base, "node_modules/font-awesome/fonts");
    const out = gulp.dest(path.join(dest, "font-awesome"));

    return gulp.src("**/*", { cwd }).pipe(out);
  });

  gulp.task("fonts", ["fonts:font-awesome"], function() {
    const cwd = path.join(base, "src/fonts");
    const out = gulp.dest(dest);

    return gulp.src("**/*", { cwd }).pipe(out);
  });

};
