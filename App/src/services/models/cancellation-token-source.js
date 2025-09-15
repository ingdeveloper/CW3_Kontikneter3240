define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CancellationTokenSource = exports.CancellationToken = void 0;
    var CANCEL = Symbol();
    var CancellationToken = /** @class */ (function () {
        function CancellationToken() {
            this.cancelled = false;
        }
        CancellationToken.prototype.throwIfCancelled = function () {
            if (this.isCancelled()) {
                throw "Cancelled";
            }
        };
        CancellationToken.prototype.isCancelled = function () {
            return this.cancelled === true;
        };
        CancellationToken.prototype[CANCEL] = function () {
            this.cancelled = true;
            if (this.abort)
                this.abort();
        };
        return CancellationToken;
    }());
    exports.CancellationToken = CancellationToken;
    var CancellationTokenSource = /** @class */ (function () {
        function CancellationTokenSource() {
            this.token = new CancellationToken();
        }
        CancellationTokenSource.prototype.cancel = function () {
            this.token[CANCEL]();
        };
        return CancellationTokenSource;
    }());
    exports.CancellationTokenSource = CancellationTokenSource;
});
//# sourceMappingURL=cancellation-token-source.js.map