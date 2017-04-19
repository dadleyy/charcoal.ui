"use strict";

const path = require("path");
const del  = require("del");
const sass = require("gulp-sass");
const cfg  = require("./config");

module.exports = function(gulp) {
  const destination = path.join(cfg.path("dist.app"), "assets/css");
  const base = cfg.path("base");
  const source = [path.join(base, "src/sass/app.sass")];

  const includePaths = [
    path.join(base, "node_modules/bulma")
  ];

  gulp.task("clean:css", function() {
    return del([destination]);
  });

  gulp.task("css:release", ["clean:css"], function() {
    const outputStyle = "compressed";
    const compiler = sass({ outputStyle, includePaths }).on("error", sass.logError);
    const out = gulp.dest(destination);

    return gulp.src(source).pipe(compiler).pipe(out);
  });

  gulp.task("css", ["clean:css"], function() {
    const outputStyle = "expanded";
    const compiler = sass({ outputStyle, includePaths }).on("error", sass.logError);
    const out = gulp.dest(destination);
    return gulp.src(source).pipe(compiler).pipe(out);
  });

};
