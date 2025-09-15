// ReSharper disable once InconsistentNaming
var gulp = require("gulp");
var runSequence = require("run-sequence");

/*
 * Builds the CSS, Font and JavaScript files for the site.
 */
gulp.task("watch-all", ["watch-ts", "watch-app", "watch-content", "watch-scripts", "watch-index"]);
gulp.task("watch", ["build"], (cb) => {
    runSequence("set-index", "watch-all", cb);
});
//# sourceMappingURL=watch.js.map