var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./signal"], function (require, exports, Signal) {
    "use strict";
    var NullSignal = /** @class */ (function (_super) {
        __extends(NullSignal, _super);
        function NullSignal() {
            var _this = _super.call(this, null, null) || this;
            _this.value = ko.pureComputed({
                read: function () { return null; },
                write: function (value) {
                }
            });
            return _this;
        }
        return NullSignal;
    }(Signal));
    return NullSignal;
});
//# sourceMappingURL=nullSignal.js.map