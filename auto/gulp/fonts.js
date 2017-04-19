"use strict";

const path = require("path");
const del  = require("del");
const cfg  = require("./config");

module.exports = function(gulp) {
  let dest = path.join(cfg.path("dist.app"), "assets/fonts");
  const base = cfg.path("base");

  gulp.task("clean:fonts", function() {
    return del([dest]);
  });

  gulp.task("fonts:material", ["clean:fonts"], function() {
    let cwd = path.join(base, "bower_components/materialize/fonts");

    return gulp.src("**/*", {cwd})
      .pipe(gulp.dest(dest));
  });

  gulp.task("fonts", ["fonts:material"], function() {
    let cwd = path.join(base, "src/fonts");
    return gulp.src("**/*", {cwd})
      .pipe(gulp.dest(dest));
  });

};
