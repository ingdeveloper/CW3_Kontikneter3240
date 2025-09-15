define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ErrorCode = void 0;
    var ErrorCode = /** @class */ (function () {
        function ErrorCode(xhr) {
            this.error = xhr.statusText;
            this.code = xhr.status;
            this.xhr = xhr;
        }
        ErrorCode.prototype.toString = function () {
            return "[" + this.code + "] " + this.error;
        };
        return ErrorCode;
    }());
    exports.ErrorCode = ErrorCode;
});
//# sourceMappingURL=error-code.js.map