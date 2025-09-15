requirejs.config({
    //urlArgs: "bust=" + (new Date()).getTime(),
    baseUrl: "./App",
    paths: {
        text: "../node_modules/requirejs-text/text",
        src: "../App/src",
        bluebird: "../node_modules/bluebird/js/browser/bluebird"
    }
});

define('jquery', function () {
    return jQuery;
});

define('knockout', ko);

define(['src/standaloneApplication', "bluebird"], function (application) {

    //https://github.com/aurelia/templating/issues/448
    Promise.config({
            longStackTraces: false,  // <----- I added this.
            warnings: {
                    wForgottenReturn: false
                }
        });
});