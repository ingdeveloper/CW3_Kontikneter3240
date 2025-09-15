"use strict";

// ReSharper disable InconsistentNaming
var gulp = require("gulp");
var del = require("del");
var glob = require("glob");
var flatten = require("array-flatten");
// ReSharper enable InconsistentNaming
var paths = require("../paths").paths;
var logging = require("../logging");

// Removes all files from ./dist/, and the .js/.js.map files compiled from .ts
gulp.task("clean-ts", function() {
    const tsToJs = (file) => {
        return [
            file.replace(/\.ts$/, ".js"),
            file.replace(/\.ts$/, ".js.map")
        ];
    };
    
    return glob(`${paths.app.root}/**/*.ts`, (err, files) => {
        var allFiles = flatten(files.map(tsToJs));

        del(allFiles).then(paths => {
            console.log("Deleted files and folders:\n");
            logging.logFiles(paths);
        });
    });   
});