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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
define(["require", "exports", "../../../services/logger", "../../../services/signalsService", "../services/historical-data-configuration.service", "../services/historical-data-statistics.service", "../models/series.model", "../../services/time-range.service", "../services/historical-data-configuration-local.service", "./series-subscription-item"], function (require, exports, Logger, SignalsService, historical_data_configuration_service_1, historical_data_statistics_service_1, series_model_1, time_range_service_1, historical_data_configuration_local_service_1, series_subscription_item_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SeriesDataProvider = void 0;
    var SeriesDataProvider = /** @class */ (function () {
        function SeriesDataProvider(_name) {
            this._name = _name;
            this.historicalDataConfigurationService = new historical_data_configuration_service_1.HistoricalDataConfigurationService();
            this.historicalDataStatisticsService = new historical_data_statistics_service_1.HistoricalDataStatisticsService(this);
            this.lock = true;
            this._referenceCount = 0;
            this.updating = false;
            this.resolution = ko.observable(null);
            this.isLoading = ko.observable(false);
            this.updates = ko.observable([]);
            this._seriesUpdates = [];
            this.seriesData = {};
            this.requestRefresh = ko.observable(null)
                .extend({ rateLimit: { timeout: 1000, method: "notifyWhenChangesStop" } });
            this.timestamps = ko.observableArray([]);
            this.configuration = ko.observable({});
            this.timeConfiguration = ko.observable({});
            this.timeSeriesMode = ko.observable({});
            this.configurationSettings = ko.observable({});
            this.start = ko.observable(null);
            this.end = ko.observable(null);
        }
        Object.defineProperty(SeriesDataProvider.prototype, "seriesUpdates", {
            get: function () {
                return this._seriesUpdates;
            },
            enumerable: false,
            configurable: true
        });
        SeriesDataProvider.prototype.getSeriesData = function (key) {
            if (key in this.seriesData) {
                return this.seriesData[key].item;
            }
            else {
                return null;
            }
        };
        Object.defineProperty(SeriesDataProvider.prototype, "seriesDataKeys", {
            get: function () {
                return Object.keys(this.seriesData);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SeriesDataProvider.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SeriesDataProvider.prototype, "ids", {
            get: function () {
                var ids = [];
                for (var key in this.seriesData) {
                    ids.push(this.seriesData[key].item.id);
                }
                return ids;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SeriesDataProvider.prototype, "isUpdating", {
            get: function () {
                return this.updating;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SeriesDataProvider.prototype, "lastTimestamp", {
            get: function () {
                if (this.timestamps() == null || !this.timestamps().length) {
                    return null;
                }
                return _.max(this.timestamps());
            },
            enumerable: false,
            configurable: true
        });
        SeriesDataProvider.prototype.getLogId = function (signal, tag) {
            var definitionLog = _.find(signal.Logs, function (log) {
                return log.LogTag === tag;
            });
            return definitionLog.ID || null;
        };
        SeriesDataProvider.prototype.subscribeSeriesAsync = function (signalName, tag) {
            return __awaiter(this, void 0, void 0, function () {
                var key, filter, signals, signal, id, series;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            key = signalName + "/" + tag;
                            if (!!(key in this.seriesData)) return [3 /*break*/, 2];
                            filter = {
                                ServerNames: [],
                                AliasNames: [signalName],
                                LogTags: [],
                                ResultsFilter: SignalDefinitionResultsFilter.Basic | SignalDefinitionResultsFilter.Extended | SignalDefinitionResultsFilter.Group | SignalDefinitionResultsFilter.Logs
                            };
                            return [4 /*yield*/, SignalsService.getSignalDefinitions(filter, 0, 1)];
                        case 1:
                            signals = _a.sent();
                            signal = _.first(signals);
                            try {
                                id = this.getLogId(signal, tag);
                                series = { id: id, corrections: [], values: [], signal: signal, tag: tag };
                                this.seriesData[key] = new series_subscription_item_1.SeriesSubscriptionItem(series);
                            }
                            catch (error) {
                                console.warn("The Signal Tag combination does not exsist: " + signalName + "/" + tag);
                                delete this.seriesData[key];
                            }
                            finally {
                                this.requestData();
                            }
                            _a.label = 2;
                        case 2:
                            this.historicalDataStatisticsService.addLocalSignals(key);
                            if (this.seriesData[key]) {
                                this.seriesData[key].addSubscriber();
                                return [2 /*return*/, this.seriesData[key]];
                            }
                            return [2 /*return*/, null];
                    }
                });
            });
        };
        SeriesDataProvider.prototype.unSubscribeSeriesAsync = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (key in this.seriesData) {
                        this.seriesData[key].releaseSubscriber();
                        if (!this.seriesData[key].hasSubscribers()) {
                            this.historicalDataStatisticsService.removeLocalSignalsAsync(key);
                            delete this.seriesData[key];
                            this.requestData();
                        }
                    }
                    return [2 /*return*/];
                });
            });
        };
        Object.defineProperty(SeriesDataProvider.prototype, "configurationName", {
            get: function () {
                return this.configurationSettings().configurationName;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SeriesDataProvider.prototype, "configurationNamespace", {
            get: function () {
                return this.configurationSettings().configurationNamespace || "";
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SeriesDataProvider.prototype, "initialConfiguration", {
            get: function () {
                return this.configurationSettings().initialConfiguration;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SeriesDataProvider.prototype, "clientsideConfiguration", {
            get: function () {
                return this.configurationSettings().clientsideConfiguration;
            },
            enumerable: false,
            configurable: true
        });
        SeriesDataProvider.prototype.addData = function (data, seriesNames) {
            var _a;
            var updates = [];
            for (var i = 0; i < data.length; i++) {
                var values = data[i].Values.map(function (item) { return item ? item.Value : undefined; });
                var corrections = data[i].Values.map(function (item) { return item ? item.EditedValue : undefined; });
                var timestamp = data[i].EntriesDate;
                if (seriesNames.length != values.length) {
                    Logger.info(this, "Skipped addData");
                    return;
                }
                this.addSingelData(timestamp, values, corrections, seriesNames);
                var updateItem = {
                    timestamp: timestamp
                };
                for (var j = 0; j < values.length; j++) {
                    var value = corrections[j] || values[j];
                    updateItem[seriesNames[j]] = value;
                    if (value != undefined) {
                        this.historicalDataStatisticsService.updateLastValue(seriesNames[j], value, timestamp);
                    }
                }
                updates.push(updateItem);
            }
            this.timestamps.valueHasMutated();
            (_a = this._seriesUpdates).push.apply(_a, __spread(updates));
            this.updates(updates);
        };
        SeriesDataProvider.prototype.removeData = function (start) {
            var index = _.findIndex(this.timestamps(), function (date) { return date >= start; });
            if (index < 0)
                return;
            for (var key in this.seriesData) {
                this.seriesData[key].item.values.splice(0, index - 1);
                this.seriesData[key].item.corrections.splice(0, index - 1);
            }
            this._seriesUpdates.splice(0, index - 1);
            this.timestamps().splice(0, index - 1);
            this.timestamps.valueHasMutated();
        };
        SeriesDataProvider.prototype.addSingelData = function (timestamp, values, corrections, seriesNames) {
            if (timestamp) {
                for (var i = 0; i < seriesNames.length; i++) {
                    this.seriesData[seriesNames[i]].item.values.push(values[i]);
                    this.seriesData[seriesNames[i]].item.corrections.push(corrections[i]);
                }
                this.timestamps().push(timestamp);
            }
        };
        SeriesDataProvider.prototype.requestData = function () {
            this.isLoading(true);
            this.requestRefresh(new Date());
        };
        SeriesDataProvider.prototype.startGettingUpdates = function () {
            this.updating = true;
        };
        SeriesDataProvider.prototype.updateStatisticsData = function (data, seriesNames) {
            this.historicalDataStatisticsService.updateData(data, seriesNames);
        };
        SeriesDataProvider.prototype.backAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var range, diff, end, start;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            range = time_range_service_1.TimeRangeService.getRangeDates(this.configuration().timeRanges, this.configuration().timeRange, this.configuration().start, this.configuration().end, this.configuration().startOffsetInterval, this.configuration().startOffset, this.configuration().endOffsetInterval, this.configuration().endOffset);
                            diff = moment(range.endDate).diff(range.startDate, "milliseconds");
                            end = moment(range.startDate).toDate();
                            start = moment(range.startDate)
                                .subtract(diff, "milliseconds")
                                .toDate();
                            this.configuration().start = start;
                            this.configuration().end = end;
                            this.configuration().timeRanges = CalendarTimeRanges.Custom;
                            this.updateTimeSeriesMode(series_model_1.TimeSeriesMode.Offline);
                            return [4 /*yield*/, this.updateSeriesTimeConfigurationAsync(this.configuration())];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SeriesDataProvider.prototype.forwardAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var range, diff, start, end;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            range = time_range_service_1.TimeRangeService.getRangeDates(this.configuration().timeRanges, this.configuration().timeRange, this.configuration().start, this.configuration().end, this.configuration().startOffsetInterval, this.configuration().startOffset, this.configuration().endOffsetInterval, this.configuration().endOffset);
                            diff = moment(range.endDate).diff(range.startDate, "milliseconds");
                            start = moment(range.endDate).toDate();
                            end = moment(range.endDate)
                                .add(diff, "milliseconds")
                                .toDate();
                            this.configuration().start = start;
                            this.configuration().end = end;
                            this.configuration().timeRanges = CalendarTimeRanges.Custom;
                            this.updateTimeSeriesMode(series_model_1.TimeSeriesMode.Offline);
                            return [4 /*yield*/, this.updateSeriesTimeConfigurationAsync(this.configuration())];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SeriesDataProvider.prototype.updateTimeSeriesMode = function (timeSeriesMode) {
            this.configuration().timeSeriesMode = timeSeriesMode;
            this.timeSeriesMode(timeSeriesMode);
            this.configuration.valueHasMutated();
        };
        SeriesDataProvider.prototype.updateSeriesTimeConfigurationAsync = function (configuration) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.configuration().timeRanges = configuration.timeRanges;
                    this.configuration().timeRange = configuration.timeRange;
                    this.configuration().start = configuration.start;
                    this.configuration().end = configuration.end;
                    this.configuration().startOffset = configuration.startOffset;
                    this.configuration().startOffsetInterval = configuration.startOffsetInterval;
                    this.configuration().endOffset = configuration.endOffset;
                    this.configuration().endOffsetInterval = configuration.endOffsetInterval;
                    this.removeAllData();
                    this.timeConfiguration(configuration);
                    this.configuration.valueHasMutated();
                    if (this.updating) {
                        this.requestData();
                    }
                    return [2 /*return*/];
                });
            });
        };
        SeriesDataProvider.prototype.removeAllData = function () {
            for (var key in this.seriesData) {
                this.seriesData[key].item.values = [];
                this.seriesData[key].item.corrections = [];
            }
            this.timestamps.removeAll();
            this._seriesUpdates = [];
            this.updates([]);
        };
        SeriesDataProvider.prototype.updateConfigurationTarget = function (name, namespace) {
            if (namespace === void 0) { namespace = ""; }
            this.configurationSettings().configurationName = name;
            this.configurationSettings().configurationNamespace = namespace;
            this.configurationSettings.valueHasMutated();
        };
        SeriesDataProvider.prototype.loadNewConfigurationAsync = function (configuration) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.removeAllData();
                    this.configuration(configuration);
                    this.timeConfiguration(configuration);
                    this.timeSeriesMode(this.configuration().timeSeriesMode);
                    return [2 /*return*/];
                });
            });
        };
        SeriesDataProvider.prototype.listConfigurationsAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.historicalDataConfigurationService.listAsync(this.configurationNamespace)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        SeriesDataProvider.prototype.deleteConfigurationAsync = function (id, name) {
            if (name === void 0) { name = null; }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.historicalDataConfigurationService.deleteAsync(this.clientsideConfiguration ? name : id, this.configurationNamespace)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SeriesDataProvider.prototype.updateConfigurationAsync = function (name, configuration) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.historicalDataConfigurationService.updateAsync(name, configuration, this.configurationNamespace)];
                        case 1:
                            _a.sent();
                            this.updateConfigurationTarget(name, this.configurationNamespace);
                            return [2 /*return*/];
                    }
                });
            });
        };
        SeriesDataProvider.prototype.getConfigurationAsync = function (name, namespace) {
            if (namespace === void 0) { namespace = null; }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.historicalDataConfigurationService.getAsync(name, namespace || this.configurationNamespace)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        SeriesDataProvider.prototype.createConfigurationAsync = function (name, configuration) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.historicalDataConfigurationService.createAsync(name, configuration, this.configurationNamespace)];
                        case 1:
                            _a.sent();
                            this.updateConfigurationTarget(name, this.configurationNamespace);
                            return [2 /*return*/];
                    }
                });
            });
        };
        SeriesDataProvider.prototype.reloadHistoricalDataConfigurationService = function () {
            if (this.clientsideConfiguration) {
                this.historicalDataConfigurationService = new historical_data_configuration_local_service_1.HistoricalDataConfigurationLocalService();
            }
            else {
                this.historicalDataConfigurationService = new historical_data_configuration_service_1.HistoricalDataConfigurationService();
            }
        };
        SeriesDataProvider.prototype.dispose = function () {
            this.historicalDataStatisticsService.dispose();
        };
        SeriesDataProvider.prototype.addSubscriber = function () {
            this._referenceCount++;
            Logger.info(this, "Subscribed to " + this._name + " SeriesDataProvider [total subscriptions: " + this._referenceCount + "]");
        };
        SeriesDataProvider.prototype.releaseSubscriber = function () {
            this._referenceCount = Math.max(this._referenceCount - 1, 0);
            Logger.info(this, "Unsubscribed from " + this._name + " SeriesDataProvider [total subscriptions: " + this._referenceCount + "]");
        };
        SeriesDataProvider.prototype.hasSubscribers = function () {
            return this._referenceCount > 0;
        };
        return SeriesDataProvider;
    }());
    exports.SeriesDataProvider = SeriesDataProvider;
});
//# sourceMappingURL=series-data-provider.js.map