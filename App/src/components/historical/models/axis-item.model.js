define(["require", "exports", "../services/charts-configuration/charts-coloring.service", "./series-configuration.model", "../../../services/connector"], function (require, exports, charts_coloring_service_1, series_configuration_model_1, Connector) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AxesItem = void 0;
    var AxesItem = /** @class */ (function () {
        function AxesItem(provider, axes, item, isPersisted) {
            var _this = this;
            if (item === void 0) { item = {}; }
            if (isPersisted === void 0) { isPersisted = false; }
            this.provider = provider;
            this.axes = axes;
            this.connector = new Connector();
            // dialog values
            this.name = ko.observable(null)
                .extend({
                required: true,
                validation: [
                    {
                        validator: function (value) { return _this.isUnique(value); },
                        message: this.connector.translate("I4SCADA_is_not_unique")()
                    }
                ]
            });
            this.color = ko.observable(null)
                .extend({ required: true });
            this.thickness = ko.observable(null)
                .extend({ number: true });
            this.gridColor = ko.observable(null)
                .extend({ required: false });
            this.gridThickness = ko.observable(null)
                .extend({ number: true });
            this.valuePosition = ko.observable(series_configuration_model_1.ValuePosition.Outside)
                .extend({ required: true });
            this.showLabels = ko.observable(false);
            this.showFirstLabel = ko.observable(true);
            this.showLastLabel = ko.observable(true);
            this.useIntegerValues = ko.observable(true);
            this.inversed = ko.observable(false);
            this.opposite = ko.observable(false);
            this.digits = ko.observable(null)
                .extend({ number: true });
            this.titleRotation = ko.observable(null)
                .extend({ number: true });
            this.labelRotation = ko.observable(null)
                .extend({ number: true });
            this.logarithmic = ko.observable(false);
            this.scientific = ko.observable(false);
            this.minGridDistance = ko.observable(null)
                .extend({ number: true });
            this.min = ko.observable(null)
                .extend({ number: true });
            this.max = ko.observable(null)
                .extend({ number: true });
            this.isPersisted = ko.observable(false);
            this.isDeletable = ko.pureComputed(function () {
                if (_this.isPersisted()) {
                    if (_.find(_this.provider.series(), function (series) { return series.axis === _this.name(); }))
                        return false;
                    if (_.find(_this.provider.regions(), function (range) { return range.axis === _this.name(); }))
                        return false;
                }
                return true;
            });
            this.isPersisted(isPersisted);
            var name = "axis" + Math.random().toString(36).substr(2, 3);
            this.name(item.name == undefined ? name : item.name);
            this.color(item.color == undefined ? charts_coloring_service_1.ChartsColoringService.GetColor(this.name() || uuid.v4()) : item.color);
            this.thickness(item.thickness == undefined ? null : item.thickness.toString());
            this.gridThickness(item.gridThickness == undefined ? null : item.gridThickness.toString());
            this.gridColor(item.gridColor == undefined ? charts_coloring_service_1.ChartsColoringService.GetColor(this.name() || uuid.v4()) : item.gridColor);
            this.valuePosition(item.valuePosition == undefined ? series_configuration_model_1.ValuePosition.Outside : item.valuePosition);
            this.showLabels(item.showLabels == undefined ? true : item.showLabels);
            this.showFirstLabel(item.showFirstLabel == undefined ? true : item.showFirstLabel);
            this.showLastLabel(item.showLastLabel == undefined ? true : item.showLastLabel);
            this.useIntegerValues(item.useIntegerValues == undefined ? false : item.useIntegerValues);
            this.inversed(item.inversed == undefined ? false : item.inversed);
            this.opposite(item.opposite == undefined ? false : item.opposite);
            this.digits(item.digits == undefined ? null : item.digits.toString());
            this.minGridDistance(item.minGridDistance == undefined ? null : item.minGridDistance.toString());
            this.titleRotation(item.titleRotation == undefined ? null : item.titleRotation.toString());
            this.labelRotation(item.labelRotation == undefined ? null : item.labelRotation.toString());
            this.logarithmic(item.logarithmic == undefined ? false : item.logarithmic);
            this.scientific(item.scientific == undefined ? false : item.scientific);
            this.min(item.min == undefined ? null : item.min.toString());
            this.max(item.max == undefined ? null : item.max.toString());
        }
        AxesItem.prototype.isUnique = function (value) {
            var axisItem = this;
            if (axisItem.isPersisted.peek())
                return true;
            var item = _.find(this.axes.peek(), function (x) {
                if (axisItem === x) {
                    return false;
                }
                return x.name() === value;
            });
            return !item;
        };
        Object.defineProperty(AxesItem.prototype, "configuration", {
            get: function () {
                return {
                    name: this.name(),
                    color: this.color(),
                    gridColor: this.color(),
                    thickness: this.thickness() === "" || this.thickness() === null ? null : parseInt(this.thickness()),
                    gridThickness: this.gridThickness() === "" || this.gridThickness() === null ? null : parseInt(this.gridThickness()),
                    valuePosition: this.valuePosition() == undefined ? series_configuration_model_1.ValuePosition.Outside : this.valuePosition(),
                    showLabels: this.showLabels() == undefined ? true : this.showLabels(),
                    showFirstLabel: this.showFirstLabel() == undefined ? true : this.showFirstLabel(),
                    showLastLabel: this.showLastLabel() == undefined ? true : this.showLastLabel(),
                    useIntegerValues: this.useIntegerValues() == undefined ? false : this.useIntegerValues(),
                    logarithmic: this.logarithmic() == undefined ? false : this.logarithmic(),
                    inversed: this.inversed() == undefined ? false : this.inversed(),
                    scientific: this.scientific() == undefined ? false : this.scientific(),
                    opposite: this.opposite() == undefined ? false : this.opposite(),
                    digits: this.digits() === "" || this.digits() === null ? null : parseInt(this.digits()),
                    minGridDistance: this.minGridDistance() === "" || this.minGridDistance() === null ? null : parseInt(this.minGridDistance()),
                    titleRotation: this.titleRotation() === "" || this.titleRotation() === null ? null : parseInt(this.titleRotation()),
                    labelRotation: this.labelRotation() === "" || this.labelRotation() === null ? null : parseInt(this.labelRotation()),
                    min: this.min() === "" || this.min() === null ? null : parseInt(this.min()),
                    max: this.max() === "" || this.max() === null ? null : parseInt(this.max())
                };
            },
            enumerable: false,
            configurable: true
        });
        AxesItem.prototype.notifySubscribers = function () {
            this.name.notifySubscribers();
        };
        return AxesItem;
    }());
    exports.AxesItem = AxesItem;
});
//# sourceMappingURL=axis-item.model.js.map