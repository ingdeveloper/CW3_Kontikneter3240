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
define(["require", "exports", "./component-rezept-base.model", "../viewModels/cowi/rezepturEnums"], function (require, exports, RezBase, rezepturEnums_1) {
    "use strict";
    var RezeptDialogOfen = /** @class */ (function (_super) {
        __extends(RezeptDialogOfen, _super);
        function RezeptDialogOfen(params) {
            var _this = this;
            params.kennung = rezepturEnums_1.FnktKennung.ofen;
            _this = _super.call(this, params) || this;
            return _this;
        }
        return RezeptDialogOfen;
    }(RezBase));
    return RezeptDialogOfen;
});
//# sourceMappingURL=rez-dlg-ofen.component.js.map