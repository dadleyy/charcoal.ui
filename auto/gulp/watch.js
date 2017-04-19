"use strict";

const path  = require("path");

module.exports = function(gulp) {

  const base     = path.join(__dirname, "../../");
  const js_dir   = path.join(base, "src/js");
  const sass_dir = path.join(base, "src/sass");
  const html_dir = path.join(base, "src/html");
  const img_dir  = path.join(base, "src/img");

  gulp.task("watch:docs", function() {
    return gulp.watch(["**/*.js", "**/*.jsx"], {cwd: js_dir}, ["js:docs"]);
  });

  gulp.task("watch", ["default"], function() {
    gulp.watch(["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"], {cwd: js_dir}, ["js"]);
    gulp.watch(["**/*.jade"], {cwd: html_dir}, ["html"]);
    gulp.watch(["**/*"], {cwd: img_dir}, ["img"]);
    return gulp.watch(["**/*.sass", "**/*.scss"], {cwd: sass_dir}, ["css"]);
  });

};
