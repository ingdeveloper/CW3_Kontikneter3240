define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HistoricalDataInvertFilter = exports.HistoricalDataDigitalFilter = void 0;
    var HistoricalDataDigitalFilter = /** @class */ (function () {
        function HistoricalDataDigitalFilter(digitalBit) {
            this.digitalBit = digitalBit;
            this.digitalBit = digitalBit === null ? 0 : digitalBit;
        }
        HistoricalDataDigitalFilter.prototype.filter = function (data) {
            var _this = this;
            return data.map(function (update) {
                if (update === null) {
                    return null;
                }
                if ((update & _this.digitalBit) === _this.digitalBit) {
                    return 1;
                }
                return 0;
            });
        };
        return HistoricalDataDigitalFilter;
    }());
    exports.HistoricalDataDigitalFilter = HistoricalDataDigitalFilter;
    var HistoricalDataInvertFilter = /** @class */ (function () {
        function HistoricalDataInvertFilter() {
        }
        HistoricalDataInvertFilter.prototype.filter = function (data) {
            return data.map(function (update) {
                if (update === null) {
                    return null;
                }
                if (update === 0) {
                    return 1;
                }
                return 0;
            });
        };
        return HistoricalDataInvertFilter;
    }());
    exports.HistoricalDataInvertFilter = HistoricalDataInvertFilter;
});
//# sourceMappingURL=historical-data.filter.js.map