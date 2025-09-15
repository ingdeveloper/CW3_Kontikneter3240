"use strict";

var paths = require("../paths").paths;

exports.deployment = {
    "debug-standalone": {
        applicationTitle: "WEBfactory i4SCADA App",
        splashFile: `${paths.pageTemplates}/splash.tpl`,
        indexFile: `${paths.pageTemplates}/index-standalone.tpl`,
        debug: true
    },
    "debug-app": {
        applicationTitle: "WEBfactory i4SCADA App",
        splashFile: `${paths.pageTemplates}/splash.tpl`,
        indexFile: `${paths.pageTemplates}/index-app.tpl`,
        debug: true
    },
    "release-standalone": {
        applicationTitle: "WEBfactory i4SCADA App",
        splashFile: `${paths.pageTemplates}/splash.tpl`,
        indexFile: `${paths.pageTemplates}/index-standalone.tpl`,
        debug: false,
        bundleEntryPoint: "src/main-standalone",
        bundlePaths: {

        },
        bundleFiles: {
            "services": [{
                root: paths.app.root,
                files: `/src/services/**/*.js`
            }],
            "views": [{
                root: paths.app.root,
                files: `/src/views/popovers/**/*.html`,
                plugin: "text!"
            }],
            "components": [{
                    root: paths.app.root,
                    files: `/src/components/**/*.js`
                },
                {
                    root: paths.app.root,
                    files: `/src/components/**/*.html`,
                    plugin: "text!"
                }, {
                    root: paths.app.root,
                    files: `/src/customComponents/**/*.js`
                },
                {
                    root: paths.app.root,
                    files: `/src/customComponents/**/*.html`,
                    plugin: "text!"
                }
            ]
        }
    },
    "release-app": {
        applicationTitle: "WEBfactory i4SCADA App",
        splashFile: `${paths.pageTemplates}/splash.tpl`,
        indexFile: `${paths.pageTemplates}/index-app.tpl`,
        debug: false,
        bundleEntryPoint: "src/main-app",
        bundlePaths: {
                durandal: "../node_modules/durandal/js",
                plugins: "../node_modules/durandal/js/plugins",
                transitions: "../node_modules/durandal/js/transitions",
                requireLib: "../node_modules/requirejs/require",
                contextMenu: "../node_modules/jquery-contextmenu/dist/jquery.contextMenu.min",
                uiPosition: "../node_modules/jquery-contextmenu/dist/jquery.ui.position.min"
        },
        bundleFiles: {
            "services": [{
                root: paths.app.root,
                files: `/src/services/**/*.js`
            }],
            "components": [{
                    root: paths.app.root,
                    files: `/src/components/**/*.js`
                },
                {
                    root: paths.app.root,
                    files: `/src/components/**/*.html`,
                    plugin: "text!"
                }, {
                    root: paths.app.root,
                    files: `/src/customComponents/**/*.js`
                },
                {
                    root: paths.app.root,
                    files: `/src/customComponents/**/*.html`,
                    plugin: "text!"
                }
            ],
            "pages": [{
                    root: paths.app.root,
                    files: `/src/viewModels/**/*.js`
                },
                {
                    root: paths.app.root,
                    files: `/src/views/**/*.html`,
                    plugin: "text!"
                }
            ],
            "widgets": [{
                    root: paths.app.root,
                    files: `/src/widgets/**/*.js`
                },
                {
                    root: paths.app.root,
                    files: `/src/widgets/**/*.html`,
                    plugin: "text!"
                },
                {
                    root: paths.app.root,
                    files: `/src/customWidgets/**/*.js`
                },
                {
                    root: paths.app.root,
                    files: `/src/customWidgets/**/*.html`,
                    plugin: "text!"
                }
            ]
        }
    }
};