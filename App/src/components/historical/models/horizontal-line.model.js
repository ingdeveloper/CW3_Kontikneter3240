define(["require", "exports", "./series-configuration.model", "../services/charts-configuration/charts-coloring.service", "../../../services/connector"], function (require, exports, series_configuration_model_1, charts_coloring_service_1, Connector) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HorizontalLine = void 0;
    var HorizontalLine = /** @class */ (function () {
        function HorizontalLine(lines, item) {
            var _this = this;
            if (item === void 0) { item = {}; }
            this.lines = lines;
            this.connector = new Connector();
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
            this.color = ko.observable(charts_coloring_service_1.ChartsColoringService.GetColor())
                .extend({ required: true });
            this.offset = ko.observable();
            this.type = ko.observable(series_configuration_model_1.HorizontalLineConfigurationType.Value)
                .extend({ required: true });
            this.value = ko.observable()
                .extend({
                required: {
                    onlyIf: function () {
                        return _this.type() === series_configuration_model_1.HorizontalLineConfigurationType.Value;
                    }
                }
            });
            var name = "line_" + Math.random().toString(36).substr(2, 3);
            this.name(item.name == undefined ? name : item.name);
            this.offset(item.offset == undefined ? null : item.offset.toString());
            this.type(item.type == undefined ? series_configuration_model_1.HorizontalLineConfigurationType.Value : item.type);
            this.color(item.color == undefined ? charts_coloring_service_1.ChartsColoringService.GetColor(this.name() || uuid.v4()) : item.color);
            this.value(item.value == undefined ? null : item.value);
        }
        HorizontalLine.prototype.isUnique = function (value) {
            var axisItem = this;
            var item = _.find(this.lines.peek(), function (x) {
                if (axisItem !== x) {
                    return x.name.peek() === value;
                }
                return false;
            });
            return !item;
        };
        Object.defineProperty(HorizontalLine.prototype, "configuration", {
            get: function () {
                return {
                    color: this.color(),
                    name: this.name(),
                    offset: this.offset(),
                    type: this.type(),
                    value: this.value()
                };
            },
            enumerable: false,
            configurable: true
        });
        HorizontalLine.prototype.notifySubscribers = function () {
            this.name.notifySubscribers();
        };
        return HorizontalLine;
    }());
    exports.HorizontalLine = HorizontalLine;
});
//# sourceMappingURL=horizontal-line.model.js.map