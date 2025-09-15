var gulpif = require("gulp-if");
var gulpDebug = require("gulp-debug");

var enableDebugMode = true;

module.exports = function() {
    return gulpif(enableDebugMode, gulpDebug());
}

