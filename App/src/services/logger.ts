type LogCallback = (fullMessage: string) => void;

enum LogTarget {
    none,
    console,
    toast
}

enum LogLevel {
    none,
    error,
    warn,
    info,
    debug,
    success
}

class Logger {

    private static getDefaultTargets(): LogTarget[] {
        var targets: LogTarget[] = [];
        targets[LogLevel.info] = LogTarget.console;
        targets[LogLevel.warn] = LogTarget.console;
        targets[LogLevel.error] = LogTarget.toast;
        return targets;
    }

    private static getDefaultToastrCallbacks(): { (fullMessage: string): void; }[] {
        var callbacks: ((fullMessage: string) => void)[] = [];
        callbacks[LogLevel.debug] = message => {
            toastr.info(message);
        };
        callbacks[LogLevel.info] = message => {
            toastr.info(message);
        };
        callbacks[LogLevel.warn] = message => {
            toastr.warning(message);
        };
        callbacks[LogLevel.error] = message => {
            toastr.error(message);
        };
        callbacks[LogLevel.success] = message => {

            toastr.success(message);

        };
        return callbacks;
    }

    private static getDefaultSysLogCallbacks(): { (fullMessage: string): void; }[] {
        //var dynamicSystem: any = system; // necessary because system.warn does not exist in the type definition

        var callbacks: ((fullMessage: string) => void)[] = [];
        callbacks[LogLevel.info] = message => {
            //dynamicSystem.log(message);
            console.log(message);
        };
        callbacks[LogLevel.warn] = message => {
            //(dynamicSystem.warn || dynamicSystem.log)(message);
            console.warn(message);
        };
        callbacks[LogLevel.error] = message => {
            //dynamicSystem.error(message);
            console.error(message);
        };
        return callbacks;
    }

    public static targets = Logger.getDefaultTargets();
    private static toastrCallbacks: ((fullMessage: string) => void)[] = Logger.getDefaultToastrCallbacks();
    private static sysLogCallbacks: ((fullMessage: string) => void)[] = Logger.getDefaultSysLogCallbacks();

    // ReSharper disable once JsFunctionCanBeConvertedToObjectProperty
    public static info = (source: any, message: string, ...args: any[]) => {
        Logger.log(LogLevel.info, source, null, message, args);
    };
    public static warn = (source: any, message: string, ...args: any[]) => {
        Logger.log(LogLevel.warn, source, null, message, args);
    };
    public static error = (source: any, message: string, stack: any = null, ...args: any[]) => {
        stack = stack || Logger.getStack(1);
        Logger.log(LogLevel.error, source, stack, message, args);
    };
    public static handleError = (source: any): ((fullMessage: string) => void) => {
        return (errorInfo: any) => {
            errorInfo = errorInfo || "Unknown error";

            var statusText = errorInfo.message || ((errorInfo.responseJSON || {}).Message) || errorInfo.statusText || errorInfo.toString();

            if (errorInfo.responseText) {
                try {
                    var responseText = JSON.parse(errorInfo.responseText);
                    var details = "";
                    if (responseText.message) {
                        details += responseText.message;
                    }

                    if (responseText.exceptionMessage) {
                        details += ":" + responseText.exceptionMessage;
                    }

                    if (details.length > 0) {
                        details = " (" + details + ")";
                        statusText += details;
                    }

                    var innerException = responseText.innerException;
                    while (innerException) {
                        statusText += "\r\n > " + innerException.exceptionMessage;
                        innerException = innerException.innerException;
                    }
                } catch (error) {

                }
            }

            if (errorInfo.entityErrors) {
                statusText += "\r\n";
                for (var i = 0; i < errorInfo.entityErrors.length; i++) {
                    statusText += errorInfo.entityErrors[i].errorMessage + "\r\n";
                }
            }

            Logger.error(source, statusText, errorInfo.stack);
        };
    };

    public static infoToast = (message: string) => {
        Logger.logToast(LogLevel.info, null, message);
    };

    public static errorToast = (message: string) => {
        Logger.logToast(LogLevel.error, null, message);
    };

    public static warnToast = (message: string) => {
        Logger.logToast(LogLevel.warn, null, message);
    };

    public static successToast = (message: string) => {
        Logger.logToast(LogLevel.success, null, message);
    };

    private static logToast(logLevel: LogLevel, stack: string, message: string) {
        try {
            if (Logger.targets[logLevel] === LogTarget.none) {
                return;
            }
            const toastMessage = message;
            Logger.toastrCallbacks[logLevel](toastMessage);
        } catch (e) {
            // just ignore errors while logging to prevent application crashing
        }
    }

    private static getStack(skipFrameCount: number): string {
        skipFrameCount = skipFrameCount || 0;
        skipFrameCount++;

        try {
            throw new Error("dummy");
        } catch (e) {
            var stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
                .replace(/^\s+at\s+/gm, '')
                .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
                .split('\n');

            var flatStack: string = _.rest(stack, skipFrameCount).join("\r\n\t");

            return flatStack;
        }
    }

    private static log(logLevel: LogLevel, source: any, stack: string, message: string, args: any[]) {
        if (Logger.targets[logLevel] === LogTarget.none) {
            return;
        }

        if (Logger.targets[logLevel] === LogTarget.toast) {
            var toastMessage = Logger.formatToastMessage(source, message, args);
            Logger.toastrCallbacks[logLevel](toastMessage);
        }

        var fullMessage: string = Logger.formatFullMessage(source, message, args, stack);
        Logger.sysLogCallbacks[logLevel](fullMessage);
    }

    private static formatFullMessage(source: any, message: string, args: any[], stack: string): string {
        var moduleId: string = Logger.resolveSource(source);
        if (moduleId) {
            moduleId = `[${moduleId}] `;
        }

        message = (message || '');

        var formattedMessage = message.format.apply(message, args);

        if (stack) {
            return `${moduleId}${formattedMessage}\nat\n\t${stack}`;
        }
        return `${moduleId}${formattedMessage}`;
    }

    private static formatToastMessage(source: any, message: string, args: any[]): string {
        return Logger.formatFullMessage(null, message, args, null);
    }


    private static resolveSource(source: any): string {
        if (!source) return "-";

        let moduleId = Logger.getModuleId(source);
        if (moduleId) return moduleId;
        if (_.isObject(source) && source.constructor) {
            moduleId = source.constructor.name || this.getFunctionName(source.constructor) || "-";
            //system.setModuleId(source, moduleId);
            return moduleId;
        }
        if (_.isFunction(source)) {
            moduleId = source.name || this.getFunctionName(source) || "-";
            //system.setModuleId(source, moduleId);
            return moduleId;
        }

        return "-";
    }

    private static getFunctionName(source: any) {
        const funcNameRegex = /function (.{1,})\(/;
        const results = (funcNameRegex).exec(source.toString());
        return (results && results.length > 1) ? results[1] : "";
    }

    private static getModuleId(obj: any) {
        if (!obj) {
            return null;
        }

        if (typeof obj == 'function' && obj.prototype) {
            return obj.prototype.__moduleId__;
        }

        if (typeof obj == 'string') {
            return null;
        }

        return obj.__moduleId__;
    }
}

export = Logger;