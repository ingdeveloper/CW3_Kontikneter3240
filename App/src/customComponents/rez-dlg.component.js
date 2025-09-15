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
define(["require", "exports", "../viewModels/cowi/rezepturEnums", "./component-rezept-base.model"], function (require, exports, rezepturEnums_1, RezBase) {
    "use strict";
    // --------------------------------------------
    // Standardrezeptdialog mit PA- und Rez- Liste
    // --------------------------------------------
    var RezeptDialogStd = /** @class */ (function (_super) {
        __extends(RezeptDialogStd, _super);
        function RezeptDialogStd(params) {
            var _this = this;
            params.kennung = rezepturEnums_1.FnktKennung.standard;
            _this = _super.call(this, params) || this;
            return _this;
        }
        return RezeptDialogStd;
    }(RezBase));
    return RezeptDialogStd;
});
//# sourceMappingURL=rez-dlg.component.js.map