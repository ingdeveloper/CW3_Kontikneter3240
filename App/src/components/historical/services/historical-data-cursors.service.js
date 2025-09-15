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
define(["require", "exports", "../../../services/connector"], function (require, exports, Connector) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HistoricalDataCursorsService = void 0;
    var HistoricalDataCursorsService = /** @class */ (function () {
        function HistoricalDataCursorsService(provider) {
            this.provider = provider;
            this.connector = new Connector();
            this.localSignals = [];
        }
        HistoricalDataCursorsService.prototype.getLocalSignalName = function (seriesName, cursorName, postfix) {
            return "local://" + this.provider.providerName + "->" + this.provider.name + "->" + seriesName + "->CURSOR->" + cursorName + "->" + postfix;
        };
        HistoricalDataCursorsService.prototype.addLocalSignal = function (localSignalName) {
            if (!this.localSignals.find(function (item) { return item.signalName() === localSignalName; })) {
                var signal = this.connector.getSignal(localSignalName);
                this.localSignals.push(signal);
            }
        };
        HistoricalDataCursorsService.prototype.removeLocalSignalAsync = function (localSignalName) {
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
        HistoricalDataCursorsService.prototype.addLocalSignals = function () {
            var e_1, _a, e_2, _b;
            try {
                for (var _c = __values(this.provider.series()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var series = _d.value;
                    if (series && series.cursors) {
                        try {
                            for (var _e = (e_2 = void 0, __values(series.cursors)), _f = _e.next(); !_f.done; _f = _e.next()) {
                                var cursor = _f.value;
                                this.addLocalSignal(this.getLocalSignalName(series.name, cursor.name, "Value"));
                                this.addLocalSignal(this.getLocalSignalName(series.name, cursor.name, "Timestamp"));
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        HistoricalDataCursorsService.prototype.removeAllLocalSignals = function () {
            var e_3, _a;
            try {
                for (var _b = __values(this.localSignals), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var signal = _c.value;
                    this.removeLocalSignalAsync(signal.signalName());
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        };
        HistoricalDataCursorsService.prototype.removeLocalSignalsAsync = function (seriesName) {
            return __awaiter(this, void 0, void 0, function () {
                var series, _a, _b, cursor, e_4_1;
                var e_4, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            series = this.provider.series().find(function (item) { return item.name === seriesName; });
                            if (!(series && series.cursors)) return [3 /*break*/, 9];
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 7, 8, 9]);
                            _a = __values(series.cursors), _b = _a.next();
                            _d.label = 2;
                        case 2:
                            if (!!_b.done) return [3 /*break*/, 6];
                            cursor = _b.value;
                            return [4 /*yield*/, this.removeLocalSignalAsync(this.getLocalSignalName(series.name, cursor.name, "Value"))];
                        case 3:
                            _d.sent();
                            return [4 /*yield*/, this.removeLocalSignalAsync(this.getLocalSignalName(series.name, cursor.name, "Timestamp"))];
                        case 4:
                            _d.sent();
                            _d.label = 5;
                        case 5:
                            _b = _a.next();
                            return [3 /*break*/, 2];
                        case 6: return [3 /*break*/, 9];
                        case 7:
                            e_4_1 = _d.sent();
                            e_4 = { error: e_4_1 };
                            return [3 /*break*/, 9];
                        case 8:
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_4) throw e_4.error; }
                            return [7 /*endfinally*/];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        HistoricalDataCursorsService.prototype.updateData = function (series, coursor, data, date) {
            this.updateLocalSignals(series, coursor, data.EditedValue2 || data.EditedValue || data.Value2 || data.Value, date);
        };
        HistoricalDataCursorsService.prototype.updateLocalSignals = function (series, cursor, value, timestamp) {
            var _this = this;
            var valueSignal = this.localSignals.find(function (item) { return item.signalName() === _this.getLocalSignalName(series, cursor, "Value"); });
            var timestampsignal = this.localSignals.find(function (item) { return item.signalName() === _this.getLocalSignalName(series, cursor, "Timestamp"); });
            if (valueSignal) {
                valueSignal.value(value);
            }
            if (timestampsignal) {
                timestampsignal.value(timestamp);
            }
        };
        HistoricalDataCursorsService.prototype.dispose = function () {
            this.removeAllLocalSignals();
        };
        return HistoricalDataCursorsService;
    }());
    exports.HistoricalDataCursorsService = HistoricalDataCursorsService;
});
//# sourceMappingURL=historical-data-cursors.service.js.map