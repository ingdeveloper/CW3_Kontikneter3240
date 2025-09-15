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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
define(["require", "exports", "../../../services/logger", "../models/series-configuration.model", "../services/historical-data-range-signal.service", "../filters/historical-data.filter", "../services/historical-data-cursors.service"], function (require, exports, Logger, series_configuration_model_1, historical_data_range_signal_service_1, historical_data_filter_1, historical_data_cursors_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SeriesChartDataProvider = void 0;
    var SeriesChartDataProvider = /** @class */ (function () {
        function SeriesChartDataProvider(_name, _provider, seriesConnector) {
            var _this = this;
            this._name = _name;
            this._provider = _provider;
            this.seriesConnector = seriesConnector;
            // private readonly connector = new Connector();
            this.historicalDataRangeSignalService = new historical_data_range_signal_service_1.HistoricalDataRangeSignalService();
            this.historicalDataCursorsService = new historical_data_cursors_service_1.HistoricalDataCursorsService(this);
            this.configuration = ko.observable({});
            this.legend = ko.observable({});
            this.export = ko.observable({});
            this.scrollbar = ko.observable({});
            this.axes = ko.observableArray([]);
            this.regions = ko.observableArray([]);
            this.series = ko.observableArray([]);
            this._referenceCount = 0;
            this.updates = ko.observable([]);
            this.seriesSubscription = this.series.subscribe(function (x) { return __awaiter(_this, void 0, void 0, function () {
                var items, deleted, added;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            items = x;
                            deleted = items.filter(function (x) { return x.status === "deleted" && !('moved' in x); });
                            added = items.filter(function (x) { return x.status === "added" && !('moved' in x); });
                            return [4 /*yield*/, this.onRemovedSeriesAsync(deleted)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.onAddedSeriesAsync(added)];
                        case 2:
                            _a.sent();
                            if (deleted.length > 0 || added.length > 0) {
                                this.series.valueHasMutated();
                            }
                            return [2 /*return*/];
                    }
                });
            }); }, null, "arrayChange");
            this.axesSubscription = this.axes.subscribe(function (x) {
                var e_1, _a, e_2, _b;
                var items = x;
                var deleted = items.filter(function (x) { return x.status === "deleted" && !('moved' in x); });
                var added = items.filter(function (x) { return x.status === "added" && !('moved' in x); });
                var _loop_1 = function (axis) {
                    var newValue = _.find(added, function (x) { return x.index === axis.index; }).value;
                    _this.onRenameAxis(axis.value.name, newValue.name);
                };
                try {
                    for (var deleted_1 = __values(deleted), deleted_1_1 = deleted_1.next(); !deleted_1_1.done; deleted_1_1 = deleted_1.next()) {
                        var axis = deleted_1_1.value;
                        _loop_1(axis);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (deleted_1_1 && !deleted_1_1.done && (_a = deleted_1.return)) _a.call(deleted_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                try {
                    for (var deleted_2 = __values(deleted), deleted_2_1 = deleted_2.next(); !deleted_2_1.done; deleted_2_1 = deleted_2.next()) {
                        var axis = deleted_2_1.value;
                        _this.onRemoveAxis(axis.value.name);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (deleted_2_1 && !deleted_2_1.done && (_b = deleted_2.return)) _b.call(deleted_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }, null, "arrayChange");
            this.rangesSubscription = this.regions.subscribe(function (x) {
                var items = x;
                var deleted = items.filter(function (x) { return x.status === "deleted" && !('moved' in x); });
                if (deleted.length > 0) {
                    _this.onRemoveRegions();
                }
            }, null, "arrayChange");
            this.updateSubscription = this.provider.updates.subscribe(function (value) {
                var updates = _this.buildSeriesUpdates(value);
                updates = _this.filter(updates);
                _this.updates(updates);
            });
            this.resolution = this.provider.resolution;
        }
        Object.defineProperty(SeriesChartDataProvider.prototype, "ids", {
            get: function () {
                var e_3, _a;
                var ids = [];
                try {
                    for (var _b = __values(this.series()), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var series = _c.value;
                        var seriedData = this.provider.getSeriesData(series.signalName + "/" + series.tag);
                        if (seriedData) {
                            ids.push(seriedData.id);
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                return ids;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SeriesChartDataProvider.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SeriesChartDataProvider.prototype, "providerName", {
            get: function () {
                return this.provider.name;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SeriesChartDataProvider.prototype, "isUpdating", {
            get: function () {
                return this.provider.isUpdating;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SeriesChartDataProvider.prototype, "seriesUpdates", {
            get: function () {
                return this.buildSeriesUpdates(this.provider.seriesUpdates);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SeriesChartDataProvider.prototype, "provider", {
            get: function () {
                return this._provider;
            },
            enumerable: false,
            configurable: true
        });
        SeriesChartDataProvider.prototype.buildSeriesUpdates = function (data) {
            var e_4, _a, e_5, _b, e_6, _c;
            if (data == null)
                return data;
            var dictonary = {};
            try {
                for (var _d = __values(this.series()), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var series = _e.value;
                    dictonary[series.name] = series.signalName + "/" + series.tag;
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_4) throw e_4.error; }
            }
            var result = [];
            try {
                for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                    var item = data_1_1.value;
                    var object = {};
                    try {
                        for (var _f = (e_6 = void 0, __values(Object.keys(dictonary))), _g = _f.next(); !_g.done; _g = _f.next()) {
                            var key = _g.value;
                            if (key in dictonary) {
                                if (item[dictonary[key]] !== undefined) {
                                    object[key] = item[dictonary[key]];
                                }
                            }
                        }
                    }
                    catch (e_6_1) { e_6 = { error: e_6_1 }; }
                    finally {
                        try {
                            if (_g && !_g.done && (_c = _f.return)) _c.call(_f);
                        }
                        finally { if (e_6) throw e_6.error; }
                    }
                    if (Object.keys(object).length > 0) {
                        object.timestamp = item.timestamp;
                        result.push(object);
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (data_1_1 && !data_1_1.done && (_b = data_1.return)) _b.call(data_1);
                }
                finally { if (e_5) throw e_5.error; }
            }
            return result;
        };
        SeriesChartDataProvider.prototype.onAddedSeriesAsync = function (added) {
            return __awaiter(this, void 0, void 0, function () {
                var added_1, added_1_1, series, e_7_1;
                var e_7, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 5, 6, 7]);
                            added_1 = __values(added), added_1_1 = added_1.next();
                            _b.label = 1;
                        case 1:
                            if (!!added_1_1.done) return [3 /*break*/, 4];
                            series = added_1_1.value;
                            return [4 /*yield*/, this.provider.subscribeSeriesAsync(series.value.signalName, series.value.tag)];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            added_1_1 = added_1.next();
                            return [3 /*break*/, 1];
                        case 4: return [3 /*break*/, 7];
                        case 5:
                            e_7_1 = _b.sent();
                            e_7 = { error: e_7_1 };
                            return [3 /*break*/, 7];
                        case 6:
                            try {
                                if (added_1_1 && !added_1_1.done && (_a = added_1.return)) _a.call(added_1);
                            }
                            finally { if (e_7) throw e_7.error; }
                            return [7 /*endfinally*/];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        SeriesChartDataProvider.prototype.onRemovedSeriesAsync = function (added) {
            return __awaiter(this, void 0, void 0, function () {
                var promises, added_2, added_2_1, series, promises_1, promises_1_1, promise, e_8_1;
                var e_9, _a, e_8, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            promises = [];
                            try {
                                for (added_2 = __values(added), added_2_1 = added_2.next(); !added_2_1.done; added_2_1 = added_2.next()) {
                                    series = added_2_1.value;
                                    this.historicalDataCursorsService.removeLocalSignalsAsync(series.value.signalName + "/" + series.value.tag);
                                    promises.push(this.provider.unSubscribeSeriesAsync(series.value.signalName + "/" + series.value.tag));
                                }
                            }
                            catch (e_9_1) { e_9 = { error: e_9_1 }; }
                            finally {
                                try {
                                    if (added_2_1 && !added_2_1.done && (_a = added_2.return)) _a.call(added_2);
                                }
                                finally { if (e_9) throw e_9.error; }
                            }
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 6, 7, 8]);
                            promises_1 = __values(promises), promises_1_1 = promises_1.next();
                            _c.label = 2;
                        case 2:
                            if (!!promises_1_1.done) return [3 /*break*/, 5];
                            promise = promises_1_1.value;
                            return [4 /*yield*/, promise];
                        case 3:
                            _c.sent();
                            _c.label = 4;
                        case 4:
                            promises_1_1 = promises_1.next();
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 8];
                        case 6:
                            e_8_1 = _c.sent();
                            e_8 = { error: e_8_1 };
                            return [3 /*break*/, 8];
                        case 7:
                            try {
                                if (promises_1_1 && !promises_1_1.done && (_b = promises_1.return)) _b.call(promises_1);
                            }
                            finally { if (e_8) throw e_8.error; }
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        SeriesChartDataProvider.prototype.filter = function (data) {
            var e_10, _a;
            var _loop_2 = function (series) {
                var digitalFilter = new historical_data_filter_1.HistoricalDataDigitalFilter(series.digitalBit);
                var invertFilter = new historical_data_filter_1.HistoricalDataInvertFilter();
                if (series.digital === true) {
                    var filtered = digitalFilter.filter(data.map(function (x) { return x[series.name]; }));
                    for (var index = 0; index < data.length; index++) {
                        data[index][series.name] = filtered[index];
                    }
                }
                if (series.invertDigitalRepresentation === true) {
                    var filtered = invertFilter.filter(data.map(function (x) { return x[series.name]; }));
                    for (var index = 0; index < data.length; index++) {
                        data[index][series.name] = filtered[index];
                    }
                }
            };
            try {
                for (var _b = __values(this.series()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var series = _c.value;
                    _loop_2(series);
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_10) throw e_10.error; }
            }
            return data;
        };
        SeriesChartDataProvider.prototype.updateCursorData = function (series, coursor, data, date) {
            this.historicalDataCursorsService.updateData(series, coursor, data, date);
        };
        SeriesChartDataProvider.prototype.getCursorFilterData = function () {
            var e_11, _a, e_12, _b;
            var filter = [];
            try {
                for (var _c = __values(this.series()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var series = _d.value;
                    if (series.cursors) {
                        try {
                            for (var _e = (e_12 = void 0, __values(series.cursors)), _f = _e.next(); !_f.done; _f = _e.next()) {
                                var cursor = _f.value;
                                var seriesData = this.provider.getSeriesData(series.signalName + "/" + series.tag);
                                if (seriesData) {
                                    filter.push({ series: seriesData, name: series.name, cursor: cursor });
                                }
                            }
                        }
                        catch (e_12_1) { e_12 = { error: e_12_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                            }
                            finally { if (e_12) throw e_12.error; }
                        }
                    }
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_11) throw e_11.error; }
            }
            return filter;
        };
        SeriesChartDataProvider.prototype.onRenameAxis = function (oldName, newName) {
            var e_13, _a, e_14, _b;
            if (oldName != newName) {
                if (this.configuration().series) {
                    var newSeries = this.configuration().series;
                    try {
                        for (var newSeries_1 = __values(newSeries), newSeries_1_1 = newSeries_1.next(); !newSeries_1_1.done; newSeries_1_1 = newSeries_1.next()) {
                            var series = newSeries_1_1.value;
                            if (series.axis === oldName) {
                                series.axis = newName;
                            }
                        }
                    }
                    catch (e_13_1) { e_13 = { error: e_13_1 }; }
                    finally {
                        try {
                            if (newSeries_1_1 && !newSeries_1_1.done && (_a = newSeries_1.return)) _a.call(newSeries_1);
                        }
                        finally { if (e_13) throw e_13.error; }
                    }
                    this.updateSeriesConfigurationAsync(newSeries);
                }
                if (this.configuration().regions) {
                    var newRegions = this.configuration().regions;
                    try {
                        for (var newRegions_1 = __values(newRegions), newRegions_1_1 = newRegions_1.next(); !newRegions_1_1.done; newRegions_1_1 = newRegions_1.next()) {
                            var region = newRegions_1_1.value;
                            if (region.axis === oldName) {
                                region.axis = newName;
                            }
                        }
                    }
                    catch (e_14_1) { e_14 = { error: e_14_1 }; }
                    finally {
                        try {
                            if (newRegions_1_1 && !newRegions_1_1.done && (_b = newRegions_1.return)) _b.call(newRegions_1);
                        }
                        finally { if (e_14) throw e_14.error; }
                    }
                    this.updateRegionConfiguration(newRegions);
                }
            }
        };
        SeriesChartDataProvider.prototype.onRemoveAxis = function (name) {
            var e_15, _a, e_16, _b;
            var axis = _.find(this.axes(), function (x) { return x.name === name; });
            if (axis) {
                //update
                return;
            }
            var series = _.filter(this.series(), function (x) { return x.axis === name; });
            var regions = _.filter(this.regions(), function (x) { return x.axis === name; });
            try {
                for (var series_1 = __values(series), series_1_1 = series_1.next(); !series_1_1.done; series_1_1 = series_1.next()) {
                    var item = series_1_1.value;
                    this.series.remove(item);
                    var index = this.configuration().series.indexOf(item);
                    if (index >= 0)
                        this.configuration().series.splice(index, 1);
                }
            }
            catch (e_15_1) { e_15 = { error: e_15_1 }; }
            finally {
                try {
                    if (series_1_1 && !series_1_1.done && (_a = series_1.return)) _a.call(series_1);
                }
                finally { if (e_15) throw e_15.error; }
            }
            try {
                for (var regions_1 = __values(regions), regions_1_1 = regions_1.next(); !regions_1_1.done; regions_1_1 = regions_1.next()) {
                    var item = regions_1_1.value;
                    this.regions.remove(item);
                    var index = this.configuration().regions.indexOf(item);
                    if (index >= 0)
                        this.configuration().regions.splice(index, 1);
                }
            }
            catch (e_16_1) { e_16 = { error: e_16_1 }; }
            finally {
                try {
                    if (regions_1_1 && !regions_1_1.done && (_b = regions_1.return)) _b.call(regions_1);
                }
                finally { if (e_16) throw e_16.error; }
            }
            this.configuration.valueHasMutated();
        };
        SeriesChartDataProvider.prototype.onRemoveRegions = function () {
            this.updateRangeSignals(this.regions());
        };
        SeriesChartDataProvider.prototype.createSeriesAsync = function (configuration) {
            if (configuration === void 0) { configuration = null; }
            return __awaiter(this, void 0, void 0, function () {
                var config;
                return __generator(this, function (_a) {
                    Logger.info(this, "Createing Series for " + this.name + ".");
                    this.provider.lock = true;
                    if (configuration) {
                        config = configuration.slice();
                        this.configuration().series = config;
                        this.series(config);
                    }
                    if (this.series()) {
                        this.historicalDataCursorsService.removeAllLocalSignals();
                        this.historicalDataCursorsService.addLocalSignals();
                    }
                    this.configuration.valueHasMutated();
                    this.provider.lock = false;
                    return [2 /*return*/];
                });
            });
        };
        SeriesChartDataProvider.prototype.addSubscriber = function () {
            this._referenceCount++;
            Logger.info(this, "Subscribed to " + this._name + " SeriesChartDataProvider [total subscriptions: " + this._referenceCount + "]");
        };
        SeriesChartDataProvider.prototype.releaseSubscriber = function () {
            this._referenceCount = Math.max(this._referenceCount - 1, 0);
            Logger.info(this, "Unsubscribed from " + this._name + " SeriesChartDataProvider [total subscriptions: " + this._referenceCount + "]");
        };
        SeriesChartDataProvider.prototype.hasSubscribers = function () {
            return this._referenceCount > 0;
        };
        SeriesChartDataProvider.prototype.requestCountAsync = function (start, end) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.seriesConnector.requestCountAsync(this, start, end)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        SeriesChartDataProvider.prototype.requestZoomUpdateAsync = function (start, end) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.seriesConnector.requestSpecificDataAsync(this, start, end)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        SeriesChartDataProvider.prototype.updateSeriesConfigurationAsync = function (configuration) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.createSeriesAsync(configuration)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SeriesChartDataProvider.prototype.updateAxesConfiguration = function (configuration) {
            var config = configuration.slice();
            this.configuration().axes = config;
            this.axes(config);
            this.configuration.valueHasMutated();
        };
        SeriesChartDataProvider.prototype.updateRegionConfiguration = function (configuration) {
            var config = configuration.slice();
            this.configuration().regions = config;
            this.regions(config);
            this.configuration.valueHasMutated();
            this.updateRangeSignals(config);
        };
        SeriesChartDataProvider.prototype.subscribeStartValues = function (callback, target, event) {
            return this.historicalDataRangeSignalService.subscribeStartValues(callback, target, event);
        };
        SeriesChartDataProvider.prototype.subscribeEndValues = function (callback, target, event) {
            return this.historicalDataRangeSignalService.subscribeEndValues(callback, target, event);
        };
        SeriesChartDataProvider.prototype.updateRangeSignals = function (configuration) {
            var e_17, _a;
            this.historicalDataRangeSignalService.removeAllEndSignals();
            this.historicalDataRangeSignalService.removeAllStartSignals();
            try {
                for (var configuration_1 = __values(configuration), configuration_1_1 = configuration_1.next(); !configuration_1_1.done; configuration_1_1 = configuration_1.next()) {
                    var config = configuration_1_1.value;
                    if (config.startType === series_configuration_model_1.RangeConfigurationType.Signal) {
                        this.historicalDataRangeSignalService.addStartSignal(config.start);
                    }
                    if (config.endType === series_configuration_model_1.RangeConfigurationType.Signal) {
                        this.historicalDataRangeSignalService.addEndSignal(config.end);
                    }
                }
            }
            catch (e_17_1) { e_17 = { error: e_17_1 }; }
            finally {
                try {
                    if (configuration_1_1 && !configuration_1_1.done && (_a = configuration_1.return)) _a.call(configuration_1);
                }
                finally { if (e_17) throw e_17.error; }
            }
        };
        SeriesChartDataProvider.prototype.loadNewConfigurationAsync = function (configuration) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.configuration(configuration);
                            this.axes(this.configuration().axes);
                            this.regions(this.configuration().regions);
                            this.legend(this.configuration().legend);
                            this.export(this.configuration().export);
                            this.scrollbar(this.configuration().scrollbar);
                            return [4 /*yield*/, this.createSeriesAsync(this.configuration().series)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SeriesChartDataProvider.prototype.dispose = function () {
            this.axesSubscription.dispose();
            this.seriesSubscription.dispose();
            this.rangesSubscription.dispose();
            this.updateSubscription.dispose();
            this.historicalDataCursorsService.dispose();
            this.historicalDataRangeSignalService.dispose();
        };
        return SeriesChartDataProvider;
    }());
    exports.SeriesChartDataProvider = SeriesChartDataProvider;
});
//# sourceMappingURL=series-chart-data-provider.js.map