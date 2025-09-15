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
define(["require", "exports", "../../models/series-configuration.model", "../../../../services/logger", "../../../../services/connector"], function (require, exports, series_configuration_model_1, Logger, Connector) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartsUpdateService = void 0;
    var ChartsUpdateService = /** @class */ (function () {
        function ChartsUpdateService(chartsConfigurationService, provider) {
            var _this = this;
            this.chartsConfigurationService = chartsConfigurationService;
            this.provider = provider;
            this.connector = new Connector();
            this.statisticsSubscriptions = [];
            this.signals = [];
            this.cursorsSubscriptions = [];
            this.cursorsSignals = [];
            this.hidden = false;
            this.chartLoading = ko.observable(true);
            this.dateAxisChanged = function (ev) { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    this.chartLoading(true);
                    _.delay(function () { return __awaiter(_this, void 0, void 0, function () {
                        var start, end, count, startTime_1, endTime_1, cartData, items, startIndex, endIndex, valueCountToReplace, data, error_1;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 7, , 8]);
                                    if (!ev.target.minZoomed) {
                                        this.chartLoading(false);
                                        return [2 /*return*/];
                                    }
                                    if (!ev.target.maxZoomed) {
                                        this.chartLoading(false);
                                        return [2 /*return*/];
                                    }
                                    start = new Date(ev.target.minZoomed);
                                    end = new Date(ev.target.maxZoomed);
                                    if (ev.target.zoomFactor <= 1) {
                                        // remove added zoom data on zoom reset.
                                        if (this.provider.seriesUpdates.length !== this.chartsConfigurationService.getData().length) {
                                            this.chartsConfigurationService.resetData(this.provider.seriesUpdates);
                                            return [2 /*return*/];
                                        }
                                        this.chartLoading(false);
                                        return [2 /*return*/];
                                    }
                                    count = null;
                                    return [4 /*yield*/, this.provider.requestCountAsync(start, end)];
                                case 1:
                                    count = _b.sent();
                                    if (!(count !== null)) return [3 /*break*/, 5];
                                    startTime_1 = start.getTime();
                                    endTime_1 = end.getTime();
                                    cartData = this.chartsConfigurationService.getData().slice();
                                    items = cartData.filter(function (x) {
                                        if (!x.timestamp)
                                            return false;
                                        return x.timestamp.getTime() >= startTime_1 && x.timestamp.getTime() <= endTime_1;
                                    });
                                    startIndex = cartData.indexOf(_.first(items));
                                    endIndex = cartData.indexOf(_.last(items));
                                    valueCountToReplace = (endIndex - startIndex) + 1;
                                    if (!((valueCountToReplace < count) && (startIndex > 0 && endIndex > 0))) return [3 /*break*/, 3];
                                    return [4 /*yield*/, this.provider.requestZoomUpdateAsync(start, end)];
                                case 2:
                                    data = _b.sent();
                                    (_a = cartData).splice.apply(_a, __spread([startIndex, valueCountToReplace], this.transformData(data, this.provider.series().map(function (x) { return x.name; }))));
                                    cartData.sort(function (a, b) {
                                        return (new Date(a.timestamp).getTime()) - (new Date(b.timestamp).getTime());
                                    });
                                    this.chartsConfigurationService.resetData(cartData);
                                    return [3 /*break*/, 4];
                                case 3:
                                    this.chartLoading(false);
                                    _b.label = 4;
                                case 4: return [3 /*break*/, 6];
                                case 5:
                                    this.chartLoading(false);
                                    _b.label = 6;
                                case 6: return [3 /*break*/, 8];
                                case 7:
                                    error_1 = _b.sent();
                                    Logger.error(this, error_1);
                                    this.chartLoading(false);
                                    return [3 /*break*/, 8];
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); }, 100);
                    return [2 /*return*/];
                });
            }); };
        }
        Object.defineProperty(ChartsUpdateService.prototype, "isHidden", {
            //  .extend({ rateLimit: { timeout: 100, method: "notifyWhenChangesStop" } });
            get: function () {
                return this.hidden;
            },
            enumerable: false,
            configurable: true
        });
        ChartsUpdateService.prototype.subscribe = function () {
            var _this = this;
            var hidden;
            var visibilityChange;
            if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
                hidden = "hidden";
                visibilityChange = "visibilitychange";
            }
            else if (typeof document.msHidden !== "undefined") {
                hidden = "msHidden";
                visibilityChange = "msvisibilitychange";
            }
            else if (typeof document.webkitHidden !== "undefined") {
                hidden = "webkitHidden";
                visibilityChange = "webkitvisibilitychange";
            }
            document.addEventListener(visibilityChange, function () {
                if (document[hidden]) {
                    _this.hidden = true;
                }
                else {
                    _this.hidden = false;
                }
            }, false);
            this.seriesSubscription = this.provider.series.subscribe(function () {
                _this.disposeStatisticsSubscription();
                _this.disposeCursorSubscription();
                _this.chartsConfigurationService.createChart();
                _this.subscribeStatisticsSignals();
                _this.subscribeCursorSignals();
            });
            this.rangesSubscription = this.provider.regions.subscribe(function (x) {
                var e_1, _a, e_2, _b;
                var items = x;
                var added = items.filter(function (x) { return x.status === "added" && !('moved' in x); });
                var deleted = items.filter(function (x) { return x.status === "deleted" && !('moved' in x); });
                try {
                    for (var deleted_1 = __values(deleted), deleted_1_1 = deleted_1.next(); !deleted_1_1.done; deleted_1_1 = deleted_1.next()) {
                        var item = deleted_1_1.value;
                        _this.chartsConfigurationService.removeRange(item.value.name, item.value.axis);
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
                    for (var added_1 = __values(added), added_1_1 = added_1.next(); !added_1_1.done; added_1_1 = added_1.next()) {
                        var add = added_1_1.value;
                        var item = add.value;
                        _this.chartsConfigurationService.addRange(item);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (added_1_1 && !added_1_1.done && (_b = added_1.return)) _b.call(added_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                //    this.createChart();
            }, null, "arrayChange");
            this.seriesSubscription = this.provider.axes.subscribe(function () {
                _this.disposeStatisticsSubscription();
                _this.disposeCursorSubscription();
                _this.chartsConfigurationService.createChart();
                _this.subscribeStatisticsSignals();
                _this.subscribeCursorSignals();
            });
            this.startValuesSubscription = this.provider.subscribeStartValues(function (update) {
                var e_3, _a;
                var regions = _.filter(_this.provider.regions(), function (item) { return item.startType === series_configuration_model_1.RangeConfigurationType.Signal && item.start === update.name; });
                try {
                    for (var regions_1 = __values(regions), regions_1_1 = regions_1.next(); !regions_1_1.done; regions_1_1 = regions_1.next()) {
                        var range = regions_1_1.value;
                        _this.chartsConfigurationService.updateStartRanges(range.name, update.value, range.axis);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (regions_1_1 && !regions_1_1.done && (_a = regions_1.return)) _a.call(regions_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            });
            this.endValuesSubscription = this.provider.subscribeEndValues(function (update) {
                var e_4, _a;
                var regions = _.filter(_this.provider.regions(), function (item) { return item.endType === series_configuration_model_1.RangeConfigurationType.Signal && item.end === update.name; });
                try {
                    for (var regions_2 = __values(regions), regions_2_1 = regions_2.next(); !regions_2_1.done; regions_2_1 = regions_2.next()) {
                        var range = regions_2_1.value;
                        _this.chartsConfigurationService.updateEndRanges(range.name, update.value, range.axis);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (regions_2_1 && !regions_2_1.done && (_a = regions_2.return)) _a.call(regions_2);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            });
            this.subscribeStatisticsSignals();
            this.subscribeCursorSignals();
        };
        ChartsUpdateService.prototype.getHorizontalLineConfigurationType = function (type) {
            switch (type) {
                case series_configuration_model_1.HorizontalLineConfigurationType.IntervalAvg:
                    return "avg";
                case series_configuration_model_1.HorizontalLineConfigurationType.IntervalMax:
                    return "max";
                case series_configuration_model_1.HorizontalLineConfigurationType.IntervalMin:
                    return "min";
            }
        };
        ChartsUpdateService.prototype.addHorizontalLines = function () {
            var e_5, _a, e_6, _b;
            try {
                for (var _c = __values(this.provider.series()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var series = _d.value;
                    if (series.horizontalLines) {
                        try {
                            for (var _e = (e_6 = void 0, __values(series.horizontalLines)), _f = _e.next(); !_f.done; _f = _e.next()) {
                                var horizontalLine = _f.value;
                                var staticValue = null;
                                if (horizontalLine.type === series_configuration_model_1.HorizontalLineConfigurationType.SignalMax) {
                                    staticValue = this.provider.getSeriesData(series.signalName + "/" + series.tag).signal.Maximum;
                                }
                                if (horizontalLine.type === series_configuration_model_1.HorizontalLineConfigurationType.SignalMin) {
                                    staticValue = this.provider.getSeriesData(series.signalName + "/" + series.tag).signal.Minimum;
                                }
                                this.chartsConfigurationService.addHorizontalLine(horizontalLine, series.axis, staticValue);
                            }
                        }
                        catch (e_6_1) { e_6 = { error: e_6_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                            }
                            finally { if (e_6) throw e_6.error; }
                        }
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_5) throw e_5.error; }
            }
        };
        ChartsUpdateService.prototype.addVerticalLines = function () {
            var e_7, _a, e_8, _b;
            try {
                for (var _c = __values(this.provider.series()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var series = _d.value;
                    if (series.cursors) {
                        try {
                            for (var _e = (e_8 = void 0, __values(series.cursors)), _f = _e.next(); !_f.done; _f = _e.next()) {
                                var cursor = _f.value;
                                this.chartsConfigurationService.addVerticalLine(this.provider.name + "-" + series.name + "-" + cursor.name);
                            }
                        }
                        catch (e_8_1) { e_8 = { error: e_8_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                            }
                            finally { if (e_8) throw e_8.error; }
                        }
                    }
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_7) throw e_7.error; }
            }
        };
        //https://www.amcharts.com/demos/stacked-area/
        ChartsUpdateService.prototype.subscribeCursorSignals = function () {
            var e_9, _a;
            var _this = this;
            var _loop_1 = function (series) {
                var e_10, _a;
                if (series.cursors) {
                    var _loop_2 = function (cursor) {
                        var localSignalNameValue = "local://" + this_1.provider.name + "->" + this_1.provider.controlName + "->" + series.name + "->CURSOR->" + cursor.name + "->Value";
                        var localSignalNameTimestamp = "local://" + this_1.provider.name + "->" + this_1.provider.controlName + "->" + series.name + "->CURSOR->" + cursor.name + "->Timestamp";
                        var signalValue = this_1.connector.getSignal(localSignalNameValue);
                        var signalTimestamp = this_1.connector.getSignal(localSignalNameTimestamp);
                        this_1.cursorsSignals.push(signalValue);
                        this_1.cursorsSignals.push(signalTimestamp);
                        if (signalValue) {
                            var subscription1 = signalValue.value.subscribe(function (value) {
                                if (value !== "n/a" && signalTimestamp.value() !== "n/a") {
                                    _this.chartsConfigurationService.updateVerticalLine(_this.provider.name + "-" + series.name + "-" + cursor.name, cursor.name, signalTimestamp.value());
                                }
                            });
                            this_1.cursorsSubscriptions.push(subscription1);
                            if (signalTimestamp && signalTimestamp.value() !== "n/a") {
                                this_1.chartsConfigurationService.updateVerticalLine(this_1.provider.name + "-" + series.name + "-" + cursor.name, cursor.name, signalTimestamp.value());
                            }
                        }
                        if (signalTimestamp) {
                            var subscription2 = signalTimestamp.value.subscribe(function (value) {
                                if (value !== "n/a" && signalValue.value() !== "n/a") {
                                    _this.chartsConfigurationService.updateVerticalLine(_this.provider.name + "-" + series.name + "-" + cursor.name, cursor.name, value);
                                }
                            });
                            this_1.cursorsSubscriptions.push(subscription2);
                            if (signalValue && signalValue.value() !== "n/a") {
                                this_1.chartsConfigurationService.updateVerticalLine(this_1.provider.name + "-" + series.name + "-" + cursor.name, cursor.name, signalTimestamp.value());
                            }
                        }
                    };
                    try {
                        for (var _b = (e_10 = void 0, __values(series.cursors)), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var cursor = _c.value;
                            _loop_2(cursor);
                        }
                    }
                    catch (e_10_1) { e_10 = { error: e_10_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_10) throw e_10.error; }
                    }
                }
            };
            var this_1 = this;
            try {
                for (var _b = __values(this.provider.series()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var series = _c.value;
                    _loop_1(series);
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_9) throw e_9.error; }
            }
        };
        ChartsUpdateService.prototype.subscribeStatisticsSignals = function () {
            var e_11, _a;
            var _this = this;
            var _loop_3 = function (series) {
                var e_12, _a;
                if (series.horizontalLines) {
                    var _loop_4 = function (horizontalLine) {
                        if (horizontalLine.type === series_configuration_model_1.HorizontalLineConfigurationType.IntervalAvg || horizontalLine.type === series_configuration_model_1.HorizontalLineConfigurationType.IntervalMax || horizontalLine.type === series_configuration_model_1.HorizontalLineConfigurationType.IntervalMin) {
                            var localSignalName = "local://" + this_2.provider.name + "->" + series.signalName + "/" + series.tag + "->" + this_2.getHorizontalLineConfigurationType(horizontalLine.type);
                            var signal = this_2.connector.getSignal(localSignalName);
                            this_2.signals.push(signal);
                            if (signal) {
                                var subscription = signal.value.subscribe(function (value) {
                                    _this.chartsConfigurationService.updateHorizontalLines(horizontalLine.name, value, series.axis);
                                });
                                this_2.statisticsSubscriptions.push(subscription);
                            }
                        }
                    };
                    try {
                        for (var _b = (e_12 = void 0, __values(series.horizontalLines)), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var horizontalLine = _c.value;
                            _loop_4(horizontalLine);
                        }
                    }
                    catch (e_12_1) { e_12 = { error: e_12_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_12) throw e_12.error; }
                    }
                }
            };
            var this_2 = this;
            try {
                for (var _b = __values(this.provider.series()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var series = _c.value;
                    _loop_3(series);
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_11) throw e_11.error; }
            }
        };
        ChartsUpdateService.prototype.transformData = function (data, seriesNames) {
            var updates = [];
            for (var i = 0; i < data.length; i++) {
                var values = data[i].Values.map(function (item) { return item ? item.Value : undefined; });
                var corrections = data[i].Values.map(function (item) { return item ? item.EditedValue : undefined; });
                var timestamp = data[i].EntriesDate;
                if (seriesNames.length != values.length) {
                    Logger.info(this, "Skipped addData");
                    return;
                }
                var updateItem = {
                    timestamp: timestamp
                };
                for (var i_1 = 0; i_1 < values.length; i_1++) {
                    updateItem[seriesNames[i_1]] = corrections[i_1] || values[i_1];
                }
                updates.push(updateItem);
            }
            return this.provider.filter(updates);
        };
        ChartsUpdateService.prototype.disposeStatisticsSubscription = function () {
            var e_13, _a, _b;
            try {
                for (var _c = __values(this.statisticsSubscriptions), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var statisticsSubscription = _d.value;
                    statisticsSubscription.dispose();
                }
            }
            catch (e_13_1) { e_13 = { error: e_13_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_13) throw e_13.error; }
            }
            (_b = this.connector).unregisterSignals.apply(_b, __spread(this.signals));
            this.signals = [];
            this.statisticsSubscriptions = [];
        };
        ChartsUpdateService.prototype.disposeCursorSubscription = function () {
            var e_14, _a, _b;
            try {
                for (var _c = __values(this.cursorsSubscriptions), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var cursorSubscription = _d.value;
                    cursorSubscription.dispose();
                }
            }
            catch (e_14_1) { e_14 = { error: e_14_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_14) throw e_14.error; }
            }
            (_b = this.connector).unregisterSignals.apply(_b, __spread(this.signals));
            this.cursorsSignals = [];
            this.cursorsSubscriptions = [];
        };
        ChartsUpdateService.prototype.dispose = function () {
            this.disposeStatisticsSubscription();
            this.disposeCursorSubscription();
            this.startValuesSubscription.dispose();
            this.endValuesSubscription.dispose();
            this.seriesSubscription.dispose();
            this.rangesSubscription.dispose();
        };
        return ChartsUpdateService;
    }());
    exports.ChartsUpdateService = ChartsUpdateService;
});
//# sourceMappingURL=charts-update.service.js.map