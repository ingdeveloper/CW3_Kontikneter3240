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
define(["require", "exports", "./cwRezDlgAblieferzone", "plugins/dialog"], function (require, exports, AblieferzoneBase, dialog) {
    "use strict";
    var cwRezDlgAblReimelt = /** @class */ (function (_super) {
        __extends(cwRezDlgAblReimelt, _super);
        function cwRezDlgAblReimelt(AnlagenNr, PaData, frgReimelt) {
            var _this = _super.call(this, AnlagenNr, PaData) || this;
            _this.visibReimelt = ko.observable();
            _this.freigabeReimelt = ko.observable(false);
            _this.visib = ko.pureComputed(function () { return (_this.visibReimelt() == 'true') && !(_this.freigabeReimelt()); });
            _this.freigabeReimelt = frgReimelt;
            return _this;
        }
        cwRezDlgAblReimelt.prototype.accept = function () {
            dialog.close(this, [
                "accept",
                {
                    start: this.DateTimeUtil.startZeit,
                    stop: this.DateTimeUtil.stoppZeit,
                    leistung: $("#inPaLeistung").val(),
                    zone: this.ablieferNr,
                    grundrezept: $("#sendRezept").is(":checked"),
                    rework: false,
                },
            ]);
        };
        return cwRezDlgAblReimelt;
    }(AblieferzoneBase));
    return cwRezDlgAblReimelt;
});
//# sourceMappingURL=cwRezDlgAblReimelt.js.map