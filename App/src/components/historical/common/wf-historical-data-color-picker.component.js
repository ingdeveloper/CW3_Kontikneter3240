define(["require", "exports", "../services/charts-configuration/charts-coloring.service"], function (require, exports, charts_coloring_service_1) {
    "use strict";
    var WfHistoricalDataColorPickeComponent = /** @class */ (function () {
        function WfHistoricalDataColorPickeComponent(params) {
            var _this = this;
            this.nullable = false;
            this.isNull = ko.observable(false);
            this.color = params.color;
            this.symbolicText = params.symbolicText || "I4SCADA_Color";
            if (this.color.rules && !_.find(this.color.rules(), function (x) { return x.rule === "required"; })) {
                this.nullable = true;
                this.isNull(this.color() == null);
            }
            this.colorSubscription = this.color.subscribe(function (value) {
                if (value == null && _this.nullable) {
                    _this.isNull(true);
                }
            });
            this.nullSubscription = this.isNull.subscribe(function (value) {
                if (value === false) {
                    _this.color(charts_coloring_service_1.ChartsColoringService.GetColor(uuid.v4()));
                }
                else {
                    _this.color(null);
                }
            });
            if (this.color() == null && this.nullable) {
                this.isNull(true);
            }
        }
        WfHistoricalDataColorPickeComponent.prototype.dispose = function () {
            this.colorSubscription.dispose();
            this.nullSubscription.dispose();
        };
        return WfHistoricalDataColorPickeComponent;
    }());
    return WfHistoricalDataColorPickeComponent;
});
//# sourceMappingURL=wf-historical-data-color-picker.component.js.map