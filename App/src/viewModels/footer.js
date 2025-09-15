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
define(["require", "exports", "./viewModelBase"], function (require, exports, ViewModelBase) {
    "use strict";
    var Footer = /** @class */ (function (_super) {
        __extends(Footer, _super);
        function Footer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.date = moment();
            _this.version = window.appVersion;
            return _this;
        }
        return Footer;
    }(ViewModelBase));
    return Footer;
});
//# sourceMappingURL=footer.js.map