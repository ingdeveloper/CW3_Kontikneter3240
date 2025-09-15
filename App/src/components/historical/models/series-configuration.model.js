define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ValuePosition = exports.InterpolationTypes = exports.ChartType = exports.SeriesDisplayType = exports.RangeConfigurationType = exports.HorizontalLineConfigurationType = void 0;
    var HorizontalLineConfigurationType;
    (function (HorizontalLineConfigurationType) {
        HorizontalLineConfigurationType[HorizontalLineConfigurationType["SignalMin"] = 0] = "SignalMin";
        HorizontalLineConfigurationType[HorizontalLineConfigurationType["SignalMax"] = 1] = "SignalMax";
        HorizontalLineConfigurationType[HorizontalLineConfigurationType["Value"] = 2] = "Value";
        HorizontalLineConfigurationType[HorizontalLineConfigurationType["IntervalMin"] = 3] = "IntervalMin";
        HorizontalLineConfigurationType[HorizontalLineConfigurationType["IntervalMax"] = 4] = "IntervalMax";
        HorizontalLineConfigurationType[HorizontalLineConfigurationType["IntervalAvg"] = 5] = "IntervalAvg";
    })(HorizontalLineConfigurationType = exports.HorizontalLineConfigurationType || (exports.HorizontalLineConfigurationType = {}));
    var RangeConfigurationType;
    (function (RangeConfigurationType) {
        RangeConfigurationType[RangeConfigurationType["Value"] = 0] = "Value";
        RangeConfigurationType[RangeConfigurationType["Signal"] = 1] = "Signal";
    })(RangeConfigurationType = exports.RangeConfigurationType || (exports.RangeConfigurationType = {}));
    var SeriesDisplayType;
    (function (SeriesDisplayType) {
        SeriesDisplayType[SeriesDisplayType["Name"] = 0] = "Name";
        SeriesDisplayType[SeriesDisplayType["Alias"] = 1] = "Alias";
        SeriesDisplayType[SeriesDisplayType["Description"] = 2] = "Description";
    })(SeriesDisplayType = exports.SeriesDisplayType || (exports.SeriesDisplayType = {}));
    var ChartType;
    (function (ChartType) {
        ChartType[ChartType["Line"] = 0] = "Line";
        ChartType[ChartType["StackedLine"] = 1] = "StackedLine";
        ChartType[ChartType["Dots"] = 2] = "Dots";
        ChartType[ChartType["LineDots"] = 3] = "LineDots";
        ChartType[ChartType["Step"] = 4] = "Step";
        ChartType[ChartType["Bar"] = 5] = "Bar";
        ChartType[ChartType["StackedBar"] = 6] = "StackedBar";
    })(ChartType = exports.ChartType || (exports.ChartType = {}));
    var InterpolationTypes;
    (function (InterpolationTypes) {
        InterpolationTypes[InterpolationTypes["None"] = 0] = "None";
        InterpolationTypes[InterpolationTypes["Linear"] = 1] = "Linear";
        InterpolationTypes[InterpolationTypes["CubicSpline"] = 2] = "CubicSpline";
        InterpolationTypes[InterpolationTypes["Differential"] = 3] = "Differential";
    })(InterpolationTypes = exports.InterpolationTypes || (exports.InterpolationTypes = {}));
    var ValuePosition;
    (function (ValuePosition) {
        ValuePosition[ValuePosition["Outside"] = 0] = "Outside";
        ValuePosition[ValuePosition["Inside"] = 1] = "Inside";
    })(ValuePosition = exports.ValuePosition || (exports.ValuePosition = {}));
});
//# sourceMappingURL=series-configuration.model.js.map