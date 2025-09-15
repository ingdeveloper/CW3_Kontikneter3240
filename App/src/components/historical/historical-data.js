define(["require", "exports", "./services/series-connector"], function (require, exports, series_connector_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HistoricalData = void 0;
    var HistoricalData = /** @class */ (function () {
        function HistoricalData() {
        }
        HistoricalData.seriesConnector = new series_connector_1.SeriesConnector();
        return HistoricalData;
    }());
    exports.HistoricalData = HistoricalData;
});
//# sourceMappingURL=historical-data.js.map