define(["require", "exports"], function (require, exports) {
    "use strict";
    var LogTarget;
    (function (LogTarget) {
        LogTarget[LogTarget["none"] = 0] = "none";
        LogTarget[LogTarget["console"] = 1] = "console";
        LogTarget[LogTarget["toast"] = 2] = "toast";
    })(LogTarget || (LogTarget = {}));
    var LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["none"] = 0] = "none";
        LogLevel[LogLevel["error"] = 1] = "error";
        LogLevel[LogLevel["warn"] = 2] = "warn";
        LogLevel[LogLevel["info"] = 3] = "info";
        LogLevel[LogLevel["debug"] = 4] = "debug";
        LogLevel[LogLevel["success"] = 5] = "success";
    })(LogLevel || (LogLevel = {}));
    var Logger = /** @class */ (function () {
        function Logger() {
        }
        Logger.getDefaultTargets = function () {
            var targets = [];
            targets[LogLevel.info] = LogTarget.console;
            targets[LogLevel.warn] = LogTarget.console;
            targets[LogLevel.error] = LogTarget.toast;
            return targets;
        };
        Logger.getDefaultToastrCallbacks = function () {
            var callbacks = [];
            callbacks[LogLevel.debug] = function (message) {
                toastr.info(message);
            };
            callbacks[LogLevel.info] = function (message) {
                toastr.info(message);
            };
            callbacks[LogLevel.warn] = function (message) {
                toastr.warning(message);
            };
            callbacks[LogLevel.error] = function (message) {
                toastr.error(message);
            };
            callbacks[LogLevel.success] = function (message) {
                toastr.success(message);
            };
            return callbacks;
        };
        Logger.getDefaultSysLogCallbacks = function () {
            //var dynamicSystem: any = system; // necessary because system.warn does not exist in the type definition
            var callbacks = [];
            callbacks[LogLevel.info] = function (message) {
                //dynamicSystem.log(message);
                console.log(message);
            };
            callbacks[LogLevel.warn] = function (message) {
                //(dynamicSystem.warn || dynamicSystem.log)(message);
                console.warn(message);
            };
            callbacks[LogLevel.error] = function (message) {
                //dynamicSystem.error(message);
                console.error(message);
            };
            return callbacks;
        };
        Logger.logToast = function (logLevel, stack, message) {
            try {
                if (Logger.targets[logLevel] === LogTarget.none) {
                    return;
                }
                var toastMessage = message;
                Logger.toastrCallbacks[logLevel](toastMessage);
            }
            catch (e) {
                // just ignore errors while logging to prevent application crashing
            }
        };
        Logger.getStack = function (skipFrameCount) {
            skipFrameCount = skipFrameCount || 0;
            skipFrameCount++;
            try {
                throw new Error("dummy");
            }
            catch (e) {
                var stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
                    .replace(/^\s+at\s+/gm, '')
                    .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
                    .split('\n');
                var flatStack = _.rest(stack, skipFrameCount).join("\r\n\t");
                return flatStack;
            }
        };
        Logger.log = function (logLevel, source, stack, message, args) {
            if (Logger.targets[logLevel] === LogTarget.none) {
                return;
            }
            if (Logger.targets[logLevel] === LogTarget.toast) {
                var toastMessage = Logger.formatToastMessage(source, message, args);
                Logger.toastrCallbacks[logLevel](toastMessage);
            }
            var fullMessage = Logger.formatFullMessage(source, message, args, stack);
            Logger.sysLogCallbacks[logLevel](fullMessage);
        };
        Logger.formatFullMessage = function (source, message, args, stack) {
            var moduleId = Logger.resolveSource(source);
            if (moduleId) {
                moduleId = "[" + moduleId + "] ";
            }
            message = (message || '');
            var formattedMessage = message.format.apply(message, args);
            if (stack) {
                return "" + moduleId + formattedMessage + "\nat\n\t" + stack;
            }
            return "" + moduleId + formattedMessage;
        };
        Logger.formatToastMessage = function (source, message, args) {
            return Logger.formatFullMessage(null, message, args, null);
        };
        Logger.resolveSource = function (source) {
            if (!source)
                return "-";
            var moduleId = Logger.getModuleId(source);
            if (moduleId)
                return moduleId;
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
        };
        Logger.getFunctionName = function (source) {
            var funcNameRegex = /function (.{1,})\(/;
            var results = (funcNameRegex).exec(source.toString());
            return (results && results.length > 1) ? results[1] : "";
        };
        Logger.getModuleId = function (obj) {
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
        };
        Logger.targets = Logger.getDefaultTargets();
        Logger.toastrCallbacks = Logger.getDefaultToastrCallbacks();
        Logger.sysLogCallbacks = Logger.getDefaultSysLogCallbacks();
        // ReSharper disable once JsFunctionCanBeConvertedToObjectProperty
        Logger.info = function (source, message) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            Logger.log(LogLevel.info, source, null, message, args);
        };
        Logger.warn = function (source, message) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            Logger.log(LogLevel.warn, source, null, message, args);
        };
        Logger.error = function (source, message, stack) {
            if (stack === void 0) { stack = null; }
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            stack = stack || Logger.getStack(1);
            Logger.log(LogLevel.error, source, stack, message, args);
        };
        Logger.handleError = function (source) {
            return function (errorInfo) {
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
                    }
                    catch (error) {
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
        Logger.infoToast = function (message) {
            Logger.logToast(LogLevel.info, null, message);
        };
        Logger.errorToast = function (message) {
            Logger.logToast(LogLevel.error, null, message);
        };
        Logger.warnToast = function (message) {
            Logger.logToast(LogLevel.warn, null, message);
        };
        Logger.successToast = function (message) {
            Logger.logToast(LogLevel.success, null, message);
        };
        return Logger;
    }());
    return Logger;
});
//# sourceMappingURL=logger.js.map