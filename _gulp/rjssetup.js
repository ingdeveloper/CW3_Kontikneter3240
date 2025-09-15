"use strict";

var fs = require("fs");
var vm = require("vm");
var merge = require("deeply");

var paths = require("./paths").paths;
var logging = require("./logging");


var servicesConfig = vm.runInNewContext(fs.readFileSync(`${paths.app.src}/services/services.js`) + "; require;");

// Config
var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync(`${paths.app.src}/require.config.js`) + "; require;");

exports.requireJsOptimizerconfig = merge(requireJsRuntimeConfig, {
    out: "main.js",
    baseUrl: paths.app.root,
    name: "src/main",
    paths: {
        durandal: "../node_modules/durandal/js",
        plugins: "../node_modules/durandal/js/plugins",
        transitions: "../node_modules/durandal/js/transitions",
        requireLib: "../node_modules/requirejs/require",
        bluebird: "../node_modules/bluebird/js/browser/bluebird"
    },
    include: [
        "requireLib"
    ],
    insertRequire: ["src/main"]
});