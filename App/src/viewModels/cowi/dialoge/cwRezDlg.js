define(["require", "exports", "plugins/dialog"], function (require, exports, dialog) {
    "use strict";
    var CwRezDlg = /** @class */ (function () {
        function CwRezDlg(txtHead, txtBody, headColor, buttons) {
            this.txtHead = txtHead;
            this.txtBody = txtBody;
            this.headColor = headColor
                ? ko.observable(d3.rgb("" + headColor))
                : ko.observable(d3.rgb("LightGray"));
            this.buttons = buttons
                ? ko.observableArray(buttons)
                : ko.observableArray([
                    {
                        name: "Default",
                        text: "Ok",
                        btnClassName: "btn btn-default",
                    },
                ]);
            this.initialize();
        }
        CwRezDlg.prototype.initialize = function () {
            this.id = ko.observable(Date.now());
            this.componentName = "dialog-content" + ko.unwrap(this.id);
            ko.components.register(this.componentName, {
                viewModel: function () { },
                template: "<div/>",
            });
        };
        CwRezDlg.prototype.close = function (param) {
            dialog.close(this, [param, this.dispose.bind(this)]);
        };
        CwRezDlg.prototype.dispose = function () {
            ko.components.unregister(this.componentName);
            $(document)
                .find("#modal-dialog-container-" + ko.unwrap(this.id))
                .remove();
        };
        return CwRezDlg;
    }());
    return CwRezDlg;
});
//# sourceMappingURL=cwRezDlg.js.map