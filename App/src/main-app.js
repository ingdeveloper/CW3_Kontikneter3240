requirejs.config({
    //urlArgs: "bust=" + (new Date()).getTime(),
    baseUrl: "./App",
    paths: {
        text: "../node_modules/requirejs-text/text",
        durandal: "../node_modules/durandal/js",
        plugins: "../node_modules/durandal/js/plugins",
        transitions: "../node_modules/durandal/js/transitions",
        //inversify: "./node_modules/inversify/dist/inversify",
        //dexie: "../../node_modules/dexie/dist/dexie",
        bluebird: "../node_modules/bluebird/js/browser/bluebird",
        //"jquery": "/jquery/dist/jquery.js",
        //'signalr': '../node_modules/signalr/jquery.signalR',
        contextMenu: "../node_modules/jquery-contextmenu/dist/jquery.contextMenu.min",
        uiPosition: "../node_modules/jquery-contextmenu/dist/jquery.ui.position.min",
        src: "../App/src"
    },
    shim: {
        //"jquery": { exports: "$" },
        //"signalr": { deps: ["jquery"] },
        //"signalr.hubs": { deps: ["signalr"] }
    }
});

define('jquery',
    function () {
        return jQuery;
    });

define('knockout', ko);

define([
    'src/spaApplication', "bluebird", "durandal/system", "durandal/app", "durandal/viewLocator", "plugins/router",
    "plugins/widget", "plugins/http", "contextMenu", "uiPosition"
],
    function (application) {

        //https://github.com/aurelia/templating/issues/448
        Promise.config({
            longStackTraces: false,  // <----- I added this.
            warnings: {
                wForgottenReturn: false
            }
        });
    });