"use strict";

var path = require("path");
var paths = require("./paths").paths;
var logging = require("./logging");

exports.extractIncludePath = (vfsFile, callback) => {
    const basePath = path.resolve(paths.app.root);
    const file = vfsFile.path;
    const extension = path.extname(file);
    const fileBaseName = path.basename(file, extension);
    var includeEntry = `${path.dirname(file)}\\${fileBaseName}`;
    includeEntry = path.relative(basePath, includeEntry);
    includeEntry = includeEntry.replace(/\\/g, "/");
    callback(null, includeEntry);
};