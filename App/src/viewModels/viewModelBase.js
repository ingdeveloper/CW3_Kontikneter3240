define(["require", "exports", "../services/logger"], function (require, exports, Logger) {
    "use strict";
    var ViewModelBase = /** @class */ (function () {
        function ViewModelBase() {
            var _this = this;
            this.info = function (message) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                Logger.info(_this, message, args);
            };
            this.warn = function (message) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                Logger.info(_this, message, args);
            };
            this.error = function (message) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                Logger.info(_this, message, args);
            };
            this.handleError = Logger.handleError(this);
        }
        return ViewModelBase;
    }());
    return ViewModelBase;
});
//# sourceMappingURL=viewModelBase.js.map