"use strict";

const gulp   = require("gulp");
const dotenv = require("dotenv");

dotenv.load();

require("./auto/gulp/css")(gulp);
require("./auto/gulp/js")(gulp);
require("./auto/gulp/html")(gulp);
require("./auto/gulp/watch")(gulp);
require("./auto/gulp/fonts")(gulp);
require("./auto/gulp/img")(gulp);

gulp.task("clean", ["clean:css", "clean:js", "clean:html", "clean:fonts", "clean:img"]);
gulp.task("default", ["css", "js", "html", "fonts", "img"]);
gulp.task("release", ["css:release", "js:release", "html:release", "fonts", "img"]);
