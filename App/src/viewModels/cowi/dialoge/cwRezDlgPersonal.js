define(["require", "exports", "plugins/dialog"], function (require, exports, dialog) {
    "use strict";
    var cwRezDlgPersonal = /** @class */ (function () {
        function cwRezDlgPersonal() {
            this.reinigpersonal = ko.observable();
        }
        cwRezDlgPersonal.prototype.compositionComplete = function () {
            var _this = this;
            var self = this;
            // Timeout auf Focus setzen, weil sonst der Befehl zu früh gesetzt wird, Problem ist Bootstrap
            setTimeout(function () {
                $("#personal4711").focus();
            }, 300);
            // Btn. enable´n nur wenn Valide Eingabe war
            var $input = $("#personal4711"); //[0]// as HTMLInputElement;
            var $button = $('.modal-footer .btn[type="submit"]');
            $input.on("input", function () {
                $button.prop("disabled", !this.checkValidity());
            });
            $("#form").submit(function (event) {
                event.preventDefault();
                dialog.close(_this, _this.reinigpersonal().replace(",", "."));
            });
        };
        cwRezDlgPersonal.prototype.close = function () {
            dialog.close(this, null);
        };
        return cwRezDlgPersonal;
    }());
    return cwRezDlgPersonal;
});
//# sourceMappingURL=cwRezDlgPersonal.js.map