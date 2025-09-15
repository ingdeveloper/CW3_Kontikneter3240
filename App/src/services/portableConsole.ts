declare var window: any;

var slice = Array.prototype.slice;

class PortableConsole {
    private static treatAsIe8: boolean = false;
    private static initialized: boolean = false;

    private static initialize() {
        if (PortableConsole.initialized) {
            return;
        }

        //see http://patik.com/blog/complete-cross-browser-console-log/
        // Tell IE9 to use its built-in console
        if (Function.prototype.bind && (typeof console === 'object' || typeof console === 'function') && typeof console.log == 'object') {

            try {
                ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd']
                    .forEach(function (method: string) {
                    console[method] = this.call(console[method], console);
                }, Function.prototype.bind);
            } catch (ex) {
                this.treatAsIe8 = true;
            }
        }

        PortableConsole.initialized = true;
    }

    private static consoleExecute(consoleCallback: any, args: IArguments) {
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
                } else if ((slice.call(args)).length == 1 && typeof slice.call(args)[0] === 'string') { // all other browsers
                    consoleCallback((slice.call(args)).toString());
                } else {
                    consoleCallback.apply(console, slice.call(args));
                }
            }
            // IE8
            else if ((!Function.prototype.bind || PortableConsole.treatAsIe8) && typeof console != 'undefined' && typeof consoleCallback == 'object') {
                Function.prototype.call.call(consoleCallback, console, slice.call(args));
            }

            // IE7 and lower, and other old browsers
        } catch (ignore) {
        }
    }

    static log() {
        PortableConsole.consoleExecute(console.log, arguments);
    }

    static info() {
        PortableConsole.consoleExecute(console.info, arguments);
    }

    static warn() {
        PortableConsole.consoleExecute(console.warn, arguments);
    }

    static error() {
        PortableConsole.consoleExecute(console.error, arguments);
    }
}

export = PortableConsole;