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
define(["require", "exports", "../../../services/connector", "../../../services/logger"], function (require, exports, Connector, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HistoricalDataStatisticsService = void 0;
    var HistoricalDataStatisticsService = /** @class */ (function () {
        function HistoricalDataStatisticsService(provider) {
            this.provider = provider;
            this.connector = new Connector();
            this.localSignals = [];
        }
        HistoricalDataStatisticsService.prototype.getLocalSignalName = function (key, postfix) {
            return "local://" + this.provider.name + "->" + key + "->" + postfix;
        };
        HistoricalDataStatisticsService.prototype.addLocalSignal = function (localSignalName) {
            if (!this.localSignals.find(function (item) { return item.signalName() === localSignalName; })) {
                var signal = this.connector.getSignal(localSignalName);
                this.localSignals.push(signal);
            }
        };
        HistoricalDataStatisticsService.prototype.removeLocalSignalAsync = function (localSignalName) {
            return __awaiter(this, void 0, void 0, function () {
                var index, signals;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            index = this.localSignals.findIndex(function (item) { return item.signalName() === localSignalName; });
                            if (!(index >= 0)) return [3 /*break*/, 2];
                            signals = this.localSignals.splice(index, 1);
                            signals[0].value(NaN);
                            return [4 /*yield*/, this.connector.unregisterSignals(localSignalName)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        HistoricalDataStatisticsService.prototype.addLocalSignals = function (key) {
            this.addLocalSignal(this.getLocalSignalName(key, "max"));
            this.addLocalSignal(this.getLocalSignalName(key, "min"));
            this.addLocalSignal(this.getLocalSignalName(key, "avg"));
            this.addLocalSignal(this.getLocalSignalName(key, "last-value"));
            this.addLocalSignal(this.getLocalSignalName(key, "last-timestamp"));
        };
        HistoricalDataStatisticsService.prototype.removeAllLocalSignalsAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, key, e_1_1;
                var e_1, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 5, 6, 7]);
                            _a = __values(this.provider.seriesDataKeys), _b = _a.next();
                            _d.label = 1;
                        case 1:
                            if (!!_b.done) return [3 /*break*/, 4];
                            key = _b.value;
                            return [4 /*yield*/, Promise.all([
                                    this.removeLocalSignalAsync(this.getLocalSignalName(key, "max")),
                                    this.removeLocalSignalAsync(this.getLocalSignalName(key, "min")),
                                    this.removeLocalSignalAsync(this.getLocalSignalName(key, "avg")),
                                    this.removeLocalSignalAsync(this.getLocalSignalName(key, "last-value")),
                                    this.removeLocalSignalAsync(this.getLocalSignalName(key, "last-timestamp"))
                                ])];
                        case 2:
                            _d.sent();
                            _d.label = 3;
                        case 3:
                            _b = _a.next();
                            return [3 /*break*/, 1];
                        case 4: return [3 /*break*/, 7];
                        case 5:
                            e_1_1 = _d.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 7];
                        case 6:
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_1) throw e_1.error; }
                            return [7 /*endfinally*/];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        HistoricalDataStatisticsService.prototype.removeLocalSignalsAsync = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.removeLocalSignalAsync(this.getLocalSignalName(key, "max")),
                                this.removeLocalSignalAsync(this.getLocalSignalName(key, "min")),
                                this.removeLocalSignalAsync(this.getLocalSignalName(key, "avg")),
                                this.removeLocalSignalAsync(this.getLocalSignalName(key, "last-value")),
                                this.removeLocalSignalAsync(this.getLocalSignalName(key, "last-timestamp"))
                            ])];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        HistoricalDataStatisticsService.prototype.updateLastValue = function (key, lastValue, lastTimestamp) {
            var _this = this;
            var lastValueSignal = this.localSignals.find(function (item) { return item.signalName() === "local://" + _this.provider.name + "->" + key + "->last-value"; });
            var lastTimestampSignal = this.localSignals.find(function (item) { return item.signalName() === "local://" + _this.provider.name + "->" + key + "->last-timestamp"; });
            if (lastValueSignal) {
                lastValueSignal.value(lastValue);
            }
            if (lastTimestampSignal) {
                lastTimestampSignal.value(lastTimestamp);
            }
        };
        HistoricalDataStatisticsService.prototype.updateData = function (data, seriesKeys) {
            for (var i = 0; i < data.length; i++) {
                var min = null;
                var max = null;
                var avg = null;
                if (data[i].Minimum
                    && data[i].Minimum.Value) {
                    min = (data[i].Minimum.Value.EditedValue2 || data[i].Minimum.Value.EditedValue) || (data[i].Minimum.Value.Value2 || data[i].Minimum.Value.Value);
                }
                if (data[i].Maximum
                    && data[i].Maximum.Value) {
                    max = (data[i].Maximum.Value.EditedValue2 || data[i].Maximum.Value.EditedValue) || (data[i].Maximum.Value.Value2 || data[i].Maximum.Value.Value);
                }
                if (data[i].Average
                    && data[i].Average.Value) {
                    avg = (data[i].Average.Value.EditedValue2 || data[i].Average.Value.EditedValue) || (data[i].Average.Value.Value2 || data[i].Average.Value.Value);
                }
                this.updateLocalSignals(seriesKeys[i], min, max, avg);
            }
        };
        HistoricalDataStatisticsService.prototype.updateLocalSignals = function (key, min, max, avg) {
            var _this = this;
            var minSignal = this.localSignals.find(function (item) { return item.signalName() === "local://" + _this.provider.name + "->" + key + "->min"; });
            var maxSignal = this.localSignals.find(function (item) { return item.signalName() === "local://" + _this.provider.name + "->" + key + "->max"; });
            var avgSignal = this.localSignals.find(function (item) { return item.signalName() === "local://" + _this.provider.name + "->" + key + "->avg"; });
            if (minSignal) {
                Logger.info(this, "Update statistics signal " + key + " min: " + min);
                minSignal.value(min);
            }
            if (maxSignal) {
                Logger.info(this, "Update statistics signal " + key + " max: " + max);
                maxSignal.value(max);
            }
            if (avgSignal) {
                Logger.info(this, "Update statistics signal " + key + " avg: " + avg);
                avgSignal.value(avg);
            }
        };
        HistoricalDataStatisticsService.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.removeAllLocalSignalsAsync()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return HistoricalDataStatisticsService;
    }());
    exports.HistoricalDataStatisticsService = HistoricalDataStatisticsService;
});
//# sourceMappingURL=historical-data-statistics.service.js.map