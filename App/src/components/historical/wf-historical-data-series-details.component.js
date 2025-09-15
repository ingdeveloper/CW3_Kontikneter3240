var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "../component-base.model", "./historical-data", "../../services/connectorEnums"], function (require, exports, ComponentBaseModel, historical_data_1, connectorEnums_1) {
    "use strict";
    var SeriesDetailsDisplayMode;
    (function (SeriesDetailsDisplayMode) {
        SeriesDetailsDisplayMode[SeriesDetailsDisplayMode["Row"] = 0] = "Row";
        SeriesDetailsDisplayMode[SeriesDetailsDisplayMode["Column"] = 1] = "Column";
        SeriesDetailsDisplayMode[SeriesDetailsDisplayMode["Card"] = 2] = "Card";
    })(SeriesDetailsDisplayMode || (SeriesDetailsDisplayMode = {}));
    var WfHistoricalDataSeriesDetailsComponent = /** @class */ (function (_super) {
        __extends(WfHistoricalDataSeriesDetailsComponent, _super);
        function WfHistoricalDataSeriesDetailsComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.series = ko.observable([]);
            _this.seriesNames = [];
            _this.getProvidersAsync();
            return _this;
        }
        WfHistoricalDataSeriesDetailsComponent.prototype.getProvidersAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this;
                            return [4 /*yield*/, historical_data_1.HistoricalData.seriesConnector.subscribeAsyncByConfiguration(this.groupName, this.controlName, this.buildCommonConfiguration(), this.buildChartConfiguration())];
                        case 1:
                            _a.provider = _b.sent();
                            this.provider.startGettingUpdates();
                            this.subsciption = this.provider.series.subscribe(function (value) {
                                _this.series(value);
                            });
                            this.series(this.provider.series());
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfHistoricalDataSeriesDetailsComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.groupName = ko.unwrap(this.settings.groupName) || ko.unwrap(this.id);
            this.controlName = ko.unwrap(this.settings.controlName) || ko.unwrap(this.id);
            this.displayMode = ko.unwrap(this.settings.displayMode) != undefined ? ko.unwrap(this.settings.displayMode) : SeriesDetailsDisplayMode.Row;
            this.fields = ko.unwrap(this.settings.fields) != undefined ? ko.unwrap(this.settings.fields) : ["SeriesName", "SignalAlias", "LastValue", "LastTimestamp"];
            this.timeSeriesMode = ko.unwrap(this.settings.timeSeriesMode) !== undefined ? ko.unwrap(this.settings.timeSeriesMode) : connectorEnums_1.TimeSeriesMode.Offline;
            this.timeRanges = ko.unwrap(this.settings.timeRanges) !== undefined ? ko.unwrap(this.settings.timeRanges) : CalendarTimeRanges.Actual;
            this.timeRange = ko.unwrap(this.settings.timeRange) !== undefined ? ko.unwrap(this.settings.timeRange) : null;
            this.start = ko.unwrap(this.settings.start) !== undefined ? ko.unwrap(this.settings.start) : null;
            this.end = ko.unwrap(this.settings.end) !== undefined ? ko.unwrap(this.settings.end) : null;
            this.startOffset = ko.unwrap(this.settings.startOffset) !== undefined ? ko.unwrap(this.settings.startOffset) : "minutes";
            this.startOffsetInterval = ko.unwrap(this.settings.startOffsetInterval) !== undefined ? ko.unwrap(this.settings.startOffsetInterval) : 15;
            this.endOffset = ko.unwrap(this.settings.endOffset) !== undefined ? ko.unwrap(this.settings.endOffset) : "minutes";
            this.endOffsetInterval = ko.unwrap(this.settings.endOffsetInterval) !== undefined ? ko.unwrap(this.settings.endOffsetInterval) : 0;
            this.seriesConfiguration = ko.unwrap(this.settings.series) !== undefined ? ko.unwrap(this.settings.series) : [];
            this.ignoreChartConfiguration = ko.unwrap(this.settings.ignoreChartConfiguration) !== undefined ? ko.unwrap(this.settings.ignoreChartConfiguration) : true;
            this.ignoreCommonConfiguration = ko.unwrap(this.settings.ignoreCommonConfiguration) !== undefined ? ko.unwrap(this.settings.ignoreCommonConfiguration) : true;
        };
        WfHistoricalDataSeriesDetailsComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    historical_data_1.HistoricalData.seriesConnector.unSubscribe(this.groupName, this.controlName);
                    this.subsciption.dispose();
                    return [2 /*return*/];
                });
            });
        };
        WfHistoricalDataSeriesDetailsComponent.prototype.buildCommonConfiguration = function () {
            if (this.ignoreCommonConfiguration) {
                return null;
            }
            return {
                end: this.end,
                endOffset: this.endOffset,
                endOffsetInterval: this.endOffsetInterval,
                start: this.start,
                startOffsetInterval: this.startOffsetInterval,
                startOffset: this.startOffset,
                timeRange: this.timeRange,
                timeRanges: this.timeRanges
            };
        };
        WfHistoricalDataSeriesDetailsComponent.prototype.buildChartConfiguration = function () {
            if (this.ignoreChartConfiguration) {
                return null;
            }
            return {
                series: this.seriesConfiguration,
                timeSeriesMode: this.timeSeriesMode
            };
        };
        WfHistoricalDataSeriesDetailsComponent.prototype.isStaticField = function (name) {
            switch (name) {
                case "SeriesName":
                case "SignalAlias":
                case "SignalDescription":
                case "SignalMax":
                case "SignalMin":
                case "SignalName":
                case "Unit":
                    return true;
            }
            return false;
        };
        WfHistoricalDataSeriesDetailsComponent.prototype.isDynamicField = function (name) {
            switch (name) {
                case "LastTimestamp":
                case "LastValue":
                case "SeriesAvg":
                case "SeriesMin":
                case "SeriesMax":
                    return true;
            }
            return false;
        };
        WfHistoricalDataSeriesDetailsComponent.prototype.getDynamicFieldSignalName = function (name, item) {
            if (!item) {
                return "";
            }
            switch (name) {
                case "LastTimestamp":
                    return "local://" + this.groupName + "->" + item.signalName + "/" + item.tag + "->last-timestamp";
                case "LastValue":
                    return "local://" + this.groupName + "->" + item.signalName + "/" + item.tag + "->last-value";
                case "SeriesAvg":
                    return "local://" + this.groupName + "->" + item.signalName + "/" + item.tag + "->avg";
                case "SeriesMin":
                    return "local://" + this.groupName + "->" + item.signalName + "/" + item.tag + "->min";
                case "SeriesMax":
                    return "local://" + this.groupName + "->" + item.signalName + "/" + item.tag + "->max";
            }
        };
        WfHistoricalDataSeriesDetailsComponent.prototype.getStaticFieldValue = function (name, seriesName) {
            var series = _.find(this.series(), function (item) { return item.name === seriesName; });
            if (!series)
                return "";
            var key = series.signalName + "/" + series.tag;
            var seriesData = this.provider.getSeriesData(key);
            if (!seriesData)
                return "";
            switch (name) {
                case "SeriesName":
                    return series.name;
                case "SignalAlias":
                    return seriesData.signal.AliasName;
                case "SignalDescription":
                    return seriesData.signal.Description;
                case "SignalMax":
                    return seriesData.signal.Maximum;
                case "SignalMin":
                    return seriesData.signal.Minimum;
                case "SignalName":
                    return seriesData.signal.Name;
                case "Unit":
                    return seriesData.signal.Unit;
                default:
                    return "";
            }
        };
        return WfHistoricalDataSeriesDetailsComponent;
    }(ComponentBaseModel));
    return WfHistoricalDataSeriesDetailsComponent;
});
//# sourceMappingURL=wf-historical-data-series-details.component.js.map