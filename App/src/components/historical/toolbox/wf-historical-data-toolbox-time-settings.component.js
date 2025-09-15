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
define(["require", "exports", "../../component-base.model", "../historical-data", "../models/series.model"], function (require, exports, ComponentBaseModel, historical_data_1, series_model_1) {
    "use strict";
    var WfHistoricalDataToolboxTimeSettingsComponent = /** @class */ (function (_super) {
        __extends(WfHistoricalDataToolboxTimeSettingsComponent, _super);
        function WfHistoricalDataToolboxTimeSettingsComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.isLoading = ko.observable(false);
            _this.dialogSettings = ko.observable(false);
            _this.start = ko.observable();
            _this.end = ko.observable();
            _this.selectedRange = ko.observable();
            _this.timeRangeDate = ko.observable();
            _this.startOffset = ko.observable();
            _this.startOffsetInterval = ko.observable();
            _this.endOffset = ko.observable();
            _this.endOffsetInterval = ko.observable();
            _this.dialogSettings.subscribe(function (x) {
                if (x === false) {
                    _this.restoreOnlineMode();
                }
            });
            _this.getProvidersAsync();
            return _this;
        }
        WfHistoricalDataToolboxTimeSettingsComponent.prototype.snapshotOnlineMode = function () {
            this.timeSeriesMode = this.provider.timeSeriesMode();
            if (this.timeSeriesMode === series_model_1.TimeSeriesMode.Online) {
                this.provider.updateTimeSeriesMode(series_model_1.TimeSeriesMode.Offline);
            }
        };
        WfHistoricalDataToolboxTimeSettingsComponent.prototype.restoreOnlineMode = function () {
            if (this.timeSeriesMode !== null) {
                this.provider.updateTimeSeriesMode(this.timeSeriesMode);
            }
        };
        WfHistoricalDataToolboxTimeSettingsComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.css = this.settings.css || "btn btn-default";
            this.showLabel = this.settings.showLabel || false;
        };
        WfHistoricalDataToolboxTimeSettingsComponent.prototype.getProvidersAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this;
                            return [4 /*yield*/, historical_data_1.HistoricalData.seriesConnector.subscribeAsync(this.settings.groupName, this.settings.controlName)];
                        case 1:
                            _a.provider = _b.sent();
                            this.subscription = this.provider.timeConfiguration.subscribe(function (configuration) {
                                _this.getTimeSettings(configuration);
                            });
                            this.getTimeSettings(this.provider.timeConfiguration());
                            this.loadingSubscription = this.provider.isLoading.subscribe(function (value) {
                                _this.isLoading(value);
                            });
                            this.isLoading(this.provider.isLoading());
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfHistoricalDataToolboxTimeSettingsComponent.prototype.getTimeSettings = function (configuration) {
            this.start(configuration.start ? new Date(configuration.start) : configuration.start);
            this.end(configuration.end ? new Date(configuration.end) : configuration.end);
            this.selectedRange(configuration.timeRanges);
            this.timeRangeDate(configuration.timeRange ? new Date(configuration.timeRange) : configuration.timeRange);
            this.startOffset(configuration.startOffset);
            this.startOffsetInterval(configuration.startOffsetInterval);
            this.endOffset(configuration.endOffset);
            this.endOffsetInterval(configuration.endOffsetInterval);
        };
        WfHistoricalDataToolboxTimeSettingsComponent.prototype.updateTimeSettingsAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.provider.updateSeriesTimeConfigurationAsync({
                                startOffsetInterval: this.startOffsetInterval(),
                                timeRange: this.timeRangeDate(),
                                end: this.end(),
                                endOffset: this.endOffset(),
                                start: this.start(),
                                endOffsetInterval: this.endOffsetInterval(),
                                startOffset: this.startOffset(),
                                timeRanges: this.selectedRange()
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfHistoricalDataToolboxTimeSettingsComponent.prototype.onSettings = function () {
            this.dialogSettings(false);
            this.updateTimeSettingsAsync();
        };
        WfHistoricalDataToolboxTimeSettingsComponent.prototype.showSettings = function () {
            this.snapshotOnlineMode();
            this.dialogSettings(true);
        };
        WfHistoricalDataToolboxTimeSettingsComponent.prototype.closeSettings = function () {
            this.dialogSettings(false);
        };
        WfHistoricalDataToolboxTimeSettingsComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var dialog;
                return __generator(this, function (_a) {
                    this.subscription.dispose();
                    historical_data_1.HistoricalData.seriesConnector.unSubscribe(this.settings.groupName, this.settings.controlName);
                    dialog = $(document).find('#modal-time-settings-' + ko.unwrap(this.id));
                    dialog.remove();
                    this.loadingSubscription.dispose();
                    return [2 /*return*/];
                });
            });
        };
        return WfHistoricalDataToolboxTimeSettingsComponent;
    }(ComponentBaseModel));
    return WfHistoricalDataToolboxTimeSettingsComponent;
});
//# sourceMappingURL=wf-historical-data-toolbox-time-settings.component.js.map