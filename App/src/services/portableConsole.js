define(["require", "exports"], function (require, exports) {
    "use strict";
    var slice = Array.prototype.slice;
    var PortableConsole = /** @class */ (function () {
        function PortableConsole() {
        }
        PortableConsole.initialize = function () {
            if (PortableConsole.initialized) {
                return;
            }
            //see http://patik.com/blog/complete-cross-browser-console-log/
            // Tell IE9 to use its built-in console
            if (Function.prototype.bind && (typeof console === 'object' || typeof console === 'function') && typeof console.log == 'object') {
                try {
                    ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd']
                        .forEach(function (method) {
                        console[method] = this.call(console[method], console);
                    }, Function.prototype.bind);
                }
                catch (ex) {
                    this.treatAsIe8 = true;
                }
            }
            PortableConsole.initialized = true;
        };
        PortableConsole.consoleExecute = function (consoleCallback, args) {
            try {
                // Modern browsers
                if (typeof console !== 'undefined' && typeof consoleCallback === 'function') {
                    // Opera 11
                    if (window.opera) {
                        var i = 0;
                        while (i < args.length) {
                            consoleCallback('Item ' + (i + 1) + ': ' + args[i]);
                            i++;
                        }
                    }
                    else if ((slice.call(args)).length == 1 && typeof slice.call(args)[0] === 'string') { // all other browsers
                        consoleCallback((slice.call(args)).toString());
                    }
                    else {
                        consoleCallback.apply(console, slice.call(args));
                    }
                }
                // IE8
                else if ((!Function.prototype.bind || PortableConsole.treatAsIe8) && typeof console != 'undefined' && typeof consoleCallback == 'object') {
                    Function.prototype.call.call(consoleCallback, console, slice.call(args));
                }
                // IE7 and lower, and other old browsers
            }
            catch (ignore) {
            }
        };
        PortableConsole.log = function () {
            PortableConsole.consoleExecute(console.log, arguments);
        };
        PortableConsole.info = function () {
            PortableConsole.consoleExecute(console.info, arguments);
        };
        PortableConsole.warn = function () {
            PortableConsole.consoleExecute(console.warn, arguments);
        };
        PortableConsole.error = function () {
            PortableConsole.consoleExecute(console.error, arguments);
        };
        PortableConsole.treatAsIe8 = false;
        PortableConsole.initialized = false;
        return PortableConsole;
    }());
    return PortableConsole;
});
//# sourceMappingURL=portableConsole.js.map