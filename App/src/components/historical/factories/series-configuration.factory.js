define(["require", "exports", "../models/series.model"], function (require, exports, series_model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SeriesChartConfigurationFactory = exports.SeriesConfigurationFactory = void 0;
    var SeriesConfigurationFactory = /** @class */ (function () {
        function SeriesConfigurationFactory() {
        }
        SeriesConfigurationFactory.prototype.create = function (configuration) {
            configuration = _.defaults(configuration, {
                timeSeriesMode: series_model_1.TimeSeriesMode.Offline,
                timeRanges: null,
                timeRange: null,
                start: null,
                end: null,
                startOffset: null,
                startOffsetInterval: null,
                endOffset: null,
                endOffsetInterval: null
            });
            return configuration;
        };
        return SeriesConfigurationFactory;
    }());
    exports.SeriesConfigurationFactory = SeriesConfigurationFactory;
    var SeriesChartConfigurationFactory = /** @class */ (function () {
        function SeriesChartConfigurationFactory() {
        }
        SeriesChartConfigurationFactory.prototype.create = function (configuration) {
            configuration = _.defaults(configuration, {
                description: null,
                series: [],
                regions: [],
                axes: [],
                legend: { show: true },
                export: {},
                scrollbar: { showX: false, showY: false },
                minPolylineStep: 0.5,
                layoutVertical: false
            });
            return configuration;
        };
        return SeriesChartConfigurationFactory;
    }());
    exports.SeriesChartConfigurationFactory = SeriesChartConfigurationFactory;
});
//# sourceMappingURL=series-configuration.factory.js.map