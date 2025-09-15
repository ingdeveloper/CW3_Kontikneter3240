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
define(["require", "exports", "./baseApplication"], function (require, exports, baseApplication_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.application = exports.StandaloneApplication = void 0;
    var StandaloneApplication = /** @class */ (function (_super) {
        __extends(StandaloneApplication, _super);
        function StandaloneApplication() {
            var _this = _super.call(this) || this;
            ko.applyBindings(_this, window.document.body);
            return _this;
        }
        return StandaloneApplication;
    }(baseApplication_1.BaseApplication));
    exports.StandaloneApplication = StandaloneApplication;
    exports.application = new StandaloneApplication();
});
//# sourceMappingURL=standaloneApplication.js.map