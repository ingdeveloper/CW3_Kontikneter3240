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
    var cwRezDlgAblZoneOfen = /** @class */ (function (_super) {
        __extends(cwRezDlgAblZoneOfen, _super);
        function cwRezDlgAblZoneOfen(AnlagenNr, PaData) {
            var _this = _super.call(this, AnlagenNr, PaData) || this;
            /** Verbindungstatus zur WF-Datenbank */
            _this.visibGrundrezept = ko.observable(true);
            return _this;
        }
        cwRezDlgAblZoneOfen.prototype.compositionComplete = function () {
            _super.prototype.compositionComplete.call(this);
            var self = this;
            $("input[name='ofenautostart']").on("change", function (e) {
                // Alle Radio-Buttons in der Gruppe
                $("input[name='ofenautostart']").each(function () {
                    var ch = $("#ofenStart").is(":checked");
                    $("#sendRezept").prop("checked", ch);
                    // Bedienbarkeit des Grundrezeptes anpassen
                    var cssVal = ch ? "none" : "auto";
                    $("#sendRezept").closest(".input-group")
                        .css("pointer-events", cssVal)
                        .css("user-select", cssVal);
                    $("#sendRezept").closest(".row")
                        .attr("title", ch ? "beim Ofenstart-Autostart nur die Option 'Übertragen' erlaubt." : "");
                    // Sichtbarkeit des Grundrezeptes anpassen
                    self.visibGrundrezept(!ch);
                });
            });
            // Vorbelegen auf 'kein Autostart'
            $("#keinOfenStart").prop("checked", true).trigger("change");
        };
        cwRezDlgAblZoneOfen.prototype.accept = function () {
            dialog.close(this, [
                "accept",
                {
                    start: this.DateTimeUtil.startZeit,
                    stop: this.DateTimeUtil.stoppZeit,
                    leistung: $("#inPaLeistung").val(),
                    zone: this.ablieferNr,
                    grundrezept: $("#sendRezept").length
                        ? $("#sendRezept").is(":checked")
                        : !this.visibGrundrezept(),
                    rework: false,
                    ofenautostart: $("#ofenStart").is(":checked"),
                },
            ]);
        };
        return cwRezDlgAblZoneOfen;
    }(AblieferzoneBase));
    return cwRezDlgAblZoneOfen;
});
//# sourceMappingURL=cwRezDlgAblZoneOfen.js.map