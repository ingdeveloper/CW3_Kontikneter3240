define(["require", "exports", "plugins/dialog"], function (require, exports, dialog) {
    "use strict";
    var CwLogInOutMsg = /** @class */ (function () {
        function CwLogInOutMsg(txtHead, txtBody, bckColor) {
            this.bckCl = ko.observable(d3.rgb("tomato"));
            this.param1 = txtHead;
            this.param2 = txtBody;
            // optionale Farbe
            if (bckColor !== void 0) {
                this.bckCl(d3.rgb(bckColor));
            }
        }
        CwLogInOutMsg.prototype.close = function () {
            dialog.close(this, "close");
        };
        return CwLogInOutMsg;
    }());
    return CwLogInOutMsg;
});
//# sourceMappingURL=cwLogInOutMsg.js.map