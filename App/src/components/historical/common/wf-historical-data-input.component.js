define(["require", "exports"], function (require, exports) {
    "use strict";
    var WfHistoricalDataInputeComponent = /** @class */ (function () {
        function WfHistoricalDataInputeComponent(params) {
            this.nullable = false;
            this.value = params.value;
            this.disable = params.disable || ko.observable(false);
            this.symbolicText = params.symbolicText || "I4SCADA_Color";
            this.type = params.type || "text";
            if (this.value.rules && !_.find(this.value.rules(), function (x) { return x.rule === "required"; })) {
                this.nullable = true;
            }
        }
        WfHistoricalDataInputeComponent.prototype.onReset = function () {
            this.value(null);
        };
        return WfHistoricalDataInputeComponent;
    }());
    return WfHistoricalDataInputeComponent;
});
//# sourceMappingURL=wf-historical-data-input.component.js.map