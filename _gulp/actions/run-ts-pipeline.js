"use strict";

// var gulp = require("gulp");
// var plumber = require("gulp-plumber");
// var srcMap = require("gulp-sourcemaps");
// var typescript = require("gulp-typescript");
// var babel = require("gulp-babel");
// var changed = require("gulp-changed");
// var debug = require("../debug");
// var uglify = require("gulp-uglify-es").default;
// var minify = require("gulp-minify");
// var gulpif = require("gulp-if");
// var cache = require("gulp-cached");
// var remember = require("gulp-remember");
// var argv = require("yargs").argv;
// var paths = require("../paths").paths;
// var logging = require("../logging");

// var project = typescript.createProject(`tsconfig.json`);

// function runTsPipeline(isRelease) {
//     // return gulp
//     //     //.src([`${paths.app.src}/**/*.ts`, `${paths.scripts}/**/*.d.ts`, `${paths.scripts}/typings/Enums.ts`], { base: "./" })
//     //     .src([`${paths.app.src}/**/*.ts`], { base: "./" })
//     //     .pipe(plumber())
//     //     .pipe(cache("app"))
//     //     .pipe(gulpif(!isRelease, srcMap.init()))
//     //     .pipe(typescript(project))
//     //     .pipe(babel({
//     //         moduleIds: false,
//     //         presets: ["es2015", "stage-0", "es2015-async-to-generator"]
//     //     }))
//     //     .pipe(gulpif(isRelease, minify()))
//     //     .pipe(gulpif(isRelease, uglify()))
//     //     .pipe(debug())
//     //     .pipe(gulpif(!isRelease, srcMap.write(".", { includeContent: true, sourceRoot: "/WFSpa3/" })))
//     //     .pipe(remember("app"))
//     //     .pipe(gulp.dest("./"))
//     //     .on("error", logging.logError);
// }

// module.exports = runTsPipeline;