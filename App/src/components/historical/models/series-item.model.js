define(["require", "exports", "./series-configuration.model", "../../../services/connector", "./horizontal-line.model", "../services/charts-configuration/charts-coloring.service", "./cursor.model"], function (require, exports, series_configuration_model_1, Connector, horizontal_line_model_1, charts_coloring_service_1, cursor_model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SeriesItem = void 0;
    var SeriesItem = /** @class */ (function () {
        function SeriesItem(provider, series, item, isPersisted) {
            var _this = this;
            if (item === void 0) { item = {}; }
            if (isPersisted === void 0) { isPersisted = false; }
            this.provider = provider;
            this.series = series;
            this.item = item;
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
            this.fillColor = ko.observable(null)
                .extend({ required: false });
            this.strokeColor = ko.observable(null)
                .extend({ required: true });
            this.signalName = ko.observable(null)
                .extend({ required: true });
            this.tag = ko.observable(null)
                .extend({ required: true });
            this.axis = ko.observable(null)
                .extend({ required: true });
            this.display = ko.observable(null)
                .extend({ required: true });
            this.thickness = ko.observable(null)
                .extend({ required: true, number: true });
            this.chartType = ko.observable(null)
                .extend({ required: true, number: true });
            this.digits = ko.observable(null)
                .extend({ number: true });
            this.digital = ko.observable(null)
                .extend({ required: true });
            this.digitalBit = ko.observable(null)
                .extend({ required: true, number: true });
            this.invertDigitalRepresentation = ko.observable(null)
                .extend({ required: true });
            this.interpolation = ko.observable(null)
                .extend({ required: true });
            this.horizontalLines = ko.observableArray([]);
            this.cursors = ko.observableArray([]);
            this.isPersisted = ko.observable(false);
            this.isDeletable = ko.pureComputed(function () {
                return true;
            });
            this.isPersisted(isPersisted);
            var axis = _.first(this.provider.axes());
            var name = "series_" + Math.random().toString(36).substr(2, 3);
            this.name(item.name == undefined ? name : item.name);
            this.fillColor(item.fillColor);
            this.strokeColor(item.strokeColor == undefined ? charts_coloring_service_1.ChartsColoringService.GetColor(this.name() || uuid.v4()) : item.strokeColor);
            this.tag(item.tag);
            this.signalName(item.signalName);
            this.axis(item.axis || (axis ? axis.name : null));
            this.display(item.display == undefined ? series_configuration_model_1.SeriesDisplayType.Name : item.display);
            this.thickness(item.thickness == undefined ? "1" : item.thickness.toString());
            this.chartType(item.chartType == undefined ? series_configuration_model_1.ChartType.Line : item.chartType);
            this.setHorizontalLineConfiguration(item.horizontalLines || []);
            this.setCursorConfiguration(item.cursors || []);
            this.digital(item.digital || false);
            this.digitalBit(item.digitalBit == undefined ? "0" : item.digitalBit.toString());
            this.invertDigitalRepresentation(item.invertDigitalRepresentation || false);
            this.digits(item.digits == undefined ? null : item.digits.toString());
            this.interpolation(item.interpolation == undefined ? series_configuration_model_1.InterpolationTypes.None : item.interpolation);
        }
        SeriesItem.prototype.isUnique = function (value) {
            var seriesItem = this;
            if (seriesItem.isPersisted.peek())
                return true;
            var item = _.find(this.series.peek(), function (x) {
                if (seriesItem !== x) {
                    return x.name.peek() === value;
                }
                return false;
            });
            return !item;
        };
        Object.defineProperty(SeriesItem.prototype, "configuration", {
            get: function () {
                return {
                    name: this.name(),
                    axis: this.axis(),
                    signalName: this.signalName(),
                    tag: this.tag(),
                    fillColor: this.fillColor(),
                    strokeColor: this.strokeColor(),
                    display: this.display(),
                    thickness: parseInt(this.thickness()),
                    chartType: this.chartType(),
                    digital: this.digital(),
                    digitalBit: parseInt(this.digitalBit()),
                    invertDigitalRepresentation: this.invertDigitalRepresentation(),
                    digits: this.digits() === "" || this.digits() === null ? null : parseInt(this.digits()),
                    interpolation: this.interpolation(),
                    horizontalLines: this.horizontalLines().map(function (x) { return x.configuration; }),
                    cursors: this.cursors().map(function (x) { return x.configuration; })
                };
            },
            enumerable: false,
            configurable: true
        });
        SeriesItem.prototype.setHorizontalLineConfiguration = function (configuration) {
            var _this = this;
            this.horizontalLines((configuration || []).map(function (item) { return new horizontal_line_model_1.HorizontalLine(_this.horizontalLines, item); }));
        };
        SeriesItem.prototype.setCursorConfiguration = function (configuration) {
            var _this = this;
            this.cursors((configuration || []).map(function (item) { return new cursor_model_1.Cursor(_this.cursors, item); }));
        };
        SeriesItem.prototype.notifySubscribers = function () {
            this.name.notifySubscribers();
        };
        return SeriesItem;
    }());
    exports.SeriesItem = SeriesItem;
});
//# sourceMappingURL=series-item.model.js.map