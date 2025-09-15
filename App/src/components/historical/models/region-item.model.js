define(["require", "exports", "../services/charts-configuration/charts-coloring.service", "../../../services/connector"], function (require, exports, charts_coloring_service_1, Connector) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RegionItem = void 0;
    var RegionItem = /** @class */ (function () {
        function RegionItem(provider, regions, item, isPersisted) {
            var _this = this;
            if (item === void 0) { item = {}; }
            if (isPersisted === void 0) { isPersisted = false; }
            this.provider = provider;
            this.regions = regions;
            this.connector = new Connector();
            // dialog values
            this.startType = ko.observable("0");
            this.endType = ko.observable("0");
            this.start = ko.observable(null)
                .extend({ required: true });
            this.end = ko.observable(null)
                .extend({ required: true });
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
            this.axis = ko.observable(null)
                .extend({ required: true });
            this.color = ko.observable(charts_coloring_service_1.ChartsColoringService.GetColor())
                .extend({ required: true });
            this.startTypeSubscription = this.startType.subscribe(function () {
                _this.start("0");
            });
            this.endTypeSubscription = this.endType.subscribe(function () {
                _this.end("0");
            });
            this.isPersisted = ko.observable(false);
            this.isDeletable = ko.pureComputed(function () {
                if (_.find(_this.provider.series(), function (series) { return series.axis === _this.name(); }))
                    return false;
                if (_.find(_this.provider.regions(), function (range) { return range.axis === _this.name(); }))
                    return false;
                return true;
            });
            this.isPersisted(isPersisted);
            var axis = _.first(this.provider.axes());
            var axisName = axis ? axis.name : undefined;
            var name = "region_" + Math.random().toString(36).substr(2, 3);
            this.name(item.name || name);
            this.axis(item.axis || axisName);
            this.color(item.color == undefined ? charts_coloring_service_1.ChartsColoringService.GetColor(this.name() || uuid.v4()) : item.color);
            this.startType(item.startType == undefined ? "0" : item.startType.toString());
            this.endType(item.endType == undefined ? "0" : item.endType.toString());
            this.start(item.start);
            this.end(item.end);
        }
        RegionItem.prototype.isUnique = function (value) {
            var regionItem = this;
            if (regionItem.isPersisted.peek())
                return true;
            var item = _.find(this.regions.peek(), function (x) {
                if (regionItem !== x) {
                    return x.name.peek() === value;
                }
                return false;
            });
            return !item;
        };
        Object.defineProperty(RegionItem.prototype, "configuration", {
            get: function () {
                return {
                    name: this.name(),
                    axis: this.axis(),
                    color: this.color(),
                    start: this.start(),
                    startType: this.startType() == "1" ? 1 : 0,
                    end: this.end(),
                    endType: this.endType() == "1" ? 1 : 0
                };
            },
            enumerable: false,
            configurable: true
        });
        RegionItem.prototype.notifySubscribers = function () {
            this.name.notifySubscribers();
        };
        return RegionItem;
    }());
    exports.RegionItem = RegionItem;
});
//# sourceMappingURL=region-item.model.js.map