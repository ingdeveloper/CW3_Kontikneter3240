// ReSharper disable once InconsistentNaming
var gulp = require("gulp");
var runSequence = require("run-sequence");
/*
 * Builds the CSS, Font and JavaScript files for the site.
 */
gulp.task("build", ["build-ts", "build-content-bundles", "build-script-bundles", "build-index", "set-index"], (cb) => {
    runSequence(["build-app-bundles"], cb);
});

//# sourceMappingURL=build.js.map