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
define(["require", "exports", "../component-base.model"], function (require, exports, ComponentBaseModel) {
    "use strict";
    var SetpointChartComponent = /** @class */ (function (_super) {
        __extends(SetpointChartComponent, _super);
        function SetpointChartComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.xAxesLineName = ko.observable("");
            _this.yAxesLineName = ko.observable("");
            _this.xAxesLineSymbolicText = "";
            _this.yAxesLineSymbolicText = "";
            _this.xAxesPropertyName = "";
            _this.yAxesPropertyName = "";
            return _this;
        }
        SetpointChartComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.min = this.settings.min !== undefined ? ko.unwrap(this.settings.min) : null;
            this.max = this.settings.max !== undefined ? ko.unwrap(this.settings.max) : null;
            this.xAxesSignalNames = this.settings.xAxesSignalNames !== undefined ? ko.unwrap(this.settings.xAxesSignalNames) : [];
            this.yAxesSignalNames = this.settings.yAxesSignalNames !== undefined ? ko.unwrap(this.settings.yAxesSignalNames) : [];
            this.xAxesLineSignalName = this.settings.xAxesLineSignalName !== undefined ? ko.unwrap(this.settings.xAxesLineSignalName).stringPlaceholderResolver(this.objectID) : null;
            this.yAxesLineSignalName = this.settings.yAxesLineSignalName !== undefined ? ko.unwrap(this.settings.yAxesLineSignalName).stringPlaceholderResolver(this.objectID) : null;
            this.xAxesValues = this.settings.xAxesValues !== undefined ? ko.unwrap(this.settings.xAxesValues) : [];
            this.yAxesValues = this.settings.yAxesValues !== undefined ? ko.unwrap(this.settings.yAxesValues) : [];
            this.xAxesArraySignalName = this.settings.xAxesArraySignalName !== undefined ? ko.unwrap(this.settings.xAxesArraySignalName).stringPlaceholderResolver(this.objectID) : null;
            this.yAxesArraySignalName = this.settings.yAxesArraySignalName !== undefined ? ko.unwrap(this.settings.yAxesArraySignalName).stringPlaceholderResolver(this.objectID) : null;
            this.yAxesSymbolicText = this.settings.yAxesSymbolicText !== undefined ? ko.unwrap(this.settings.yAxesSymbolicText) : "";
            this.xAxesSymbolicText = this.settings.xAxesSymbolicText !== undefined ? ko.unwrap(this.settings.xAxesSymbolicText) : "";
            var defaultLabelSymbolicText = " ";
            this.labelSymbolicText = this.settings.labelSymbolicText !== undefined ? ko.unwrap(this.settings.labelSymbolicText) === "" ? defaultLabelSymbolicText : ko.unwrap(this.settings.labelSymbolicText) : defaultLabelSymbolicText;
            this.height = this.settings.height || 350;
            this.color = this.settings.color !== undefined ? ko.unwrap(this.settings.color) : "#ff0000";
            this.xAxesLinePropertyName = ko.unwrap(this.settings.xAxesLinePropertyName) || "AliasName";
            this.yAxesLinePropertyName = ko.unwrap(this.settings.yAxesLinePropertyName) || "AliasName";
            this.xAxesLineSymbolicText = ko.unwrap(this.settings.xAxesLineSymbolicText) || "";
            this.yAxesLineSymbolicText = ko.unwrap(this.settings.xAxesLineSymbolicText) || "";
            this.xAxesPropertyName = ko.unwrap(this.settings.xAxesPropertyName) || "";
            this.yAxesPropertyName = ko.unwrap(this.settings.yAxesPropertyName) || "";
            this.showAxesTextInTooltip = ko.unwrap(this.settings.showAxesTextInTooltip) || false;
            this.initializeChart();
            this.initializeAsync();
        };
        SetpointChartComponent.prototype.initializeChart = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    this.trigger = ko.observable(false);
                    this.xColumnSignals = [];
                    this.yColumnSignals = [];
                    this.xAxesLineSignal = null;
                    this.yAxesLineSignal = null;
                    this.xArrayColumnSignal = null;
                    this.yArrayColumnSignal = null;
                    this.xAxesName = ko.observable(this.xAxesSymbolicText);
                    this.yAxesName = ko.observable(this.yAxesSymbolicText);
                    this.xLines = ko.computed(function () {
                        _this.trigger();
                        var lines = [];
                        if (_this.xAxesLineSignal) {
                            var value = _this.xAxesLineSignal.value();
                            lines.push({ value: value, text: _this.xAxesLineName(), position: "start" });
                        }
                        return lines;
                    });
                    this.yLines = ko.computed(function () {
                        _this.trigger();
                        var lines = [];
                        if (_this.yAxesLineSignal) {
                            var value = _this.yAxesLineSignal.value();
                            lines.push({ value: value, text: _this.yAxesLineName(), position: "start" });
                        }
                        return lines;
                    });
                    this.xColumns = ko.computed(function () {
                        _this.trigger();
                        var columName = "x";
                        if (_.isArray(_this.xAxesValues) && _this.xAxesValues.length > 0) {
                            return _this.buildStaticColumns(columName, _this.xAxesValues);
                        }
                        if (_this.xAxesArraySignalName !== null && _this.xAxesArraySignalName !== "") {
                            return _this.buildArrayColumns(columName, _this.xArrayColumnSignal);
                        }
                        return _this.buildColumns(columName, _this.xColumnSignals);
                    });
                    this.yColumns = ko.computed(function () {
                        _this.trigger();
                        var columName = _this.connector.translate(_this.labelSymbolicText).peek();
                        if (_.isArray(_this.yAxesValues) && _this.yAxesValues.length > 0) {
                            return _this.buildStaticColumns(columName, _this.yAxesValues);
                        }
                        if (_this.yAxesArraySignalName !== null && _this.yAxesArraySignalName !== "") {
                            return _this.buildArrayColumns(columName, _this.yArrayColumnSignal);
                        }
                        return _this.buildColumns(columName, _this.yColumnSignals);
                    });
                    this.c3Chart = ko.computed(function () { return _this.getC3ChartObject(); }).extend({ rateLimit: 200 });
                    this.getColumnSignals(this.yAxesSignalNames, this.yColumnSignals, this.yAxesArraySignalName, this.yArrayColumnSignal);
                    this.getColumnSignals(this.xAxesSignalNames, this.xColumnSignals, this.xAxesArraySignalName, this.xArrayColumnSignal);
                    if (this.xAxesLineSignalName !== null && this.xAxesLineSignalName !== "") {
                        this.xAxesLineSignal = this.connector.getSignal(this.xAxesLineSignalName);
                    }
                    if (this.yAxesLineSignalName !== null && this.yAxesLineSignalName !== "") {
                        this.yAxesLineSignal = this.connector.getSignal(this.yAxesLineSignalName);
                    }
                    return [2 /*return*/];
                });
            });
        };
        SetpointChartComponent.prototype.extractSignalDefinitionProperty = function (signalDefinition, propertyName) {
            if (!propertyName)
                return "";
            if (!signalDefinition)
                return "";
            //Simple property of SignalDefinitionDTO
            if (_.indexOf(propertyName, '.') === -1)
                return !isNullOrUndefined(signalDefinition[propertyName]) ? signalDefinition[propertyName] : "";
            var options = propertyName.split(".");
            var subDefinition = signalDefinition[options[0]];
            if (!subDefinition)
                return "";
            return subDefinition[options[1]] || ""; //DTO property of SignalDefinitionDTO
        };
        SetpointChartComponent.prototype.initializeAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getSignalDefinitionPropertyAsync()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.connector.getOnlineUpdates()];
                        case 2:
                            _a.sent();
                            this.languageSubscription = this.connector.currentLanguageId.subscribe(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.getSignalDefinitionPropertyAsync()];
                                        case 1:
                                            _a.sent();
                                            this.trigger(!this.trigger());
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            this.trigger(!this.trigger());
                            return [2 /*return*/];
                    }
                });
            });
        };
        SetpointChartComponent.prototype.getSignalDefinitionPropertyAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var yAxesLineNamePromise, xAxesLineNamePromise, yAxesNamePromise, xAxesNamePromise, yAxesLineName, xAxesLineName, yAxesName, xAxesName;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            yAxesLineNamePromise = this.getSignalDefinitionAxesAsync(this.yAxesLineSignalName, this.yAxesLinePropertyName, this.yAxesLineSymbolicText);
                            xAxesLineNamePromise = this.getSignalDefinitionAxesAsync(this.xAxesLineSignalName, this.xAxesLinePropertyName, this.xAxesLineSymbolicText);
                            yAxesNamePromise = this.getSignalDefinitionAxesAsync(this.getSignalForAxesName(this.yAxesValues, this.yAxesArraySignalName, this.yColumnSignals), this.yAxesPropertyName, this.yAxesSymbolicText);
                            xAxesNamePromise = this.getSignalDefinitionAxesAsync(this.getSignalForAxesName(this.xAxesValues, this.xAxesArraySignalName, this.xColumnSignals), this.xAxesPropertyName, this.xAxesSymbolicText);
                            return [4 /*yield*/, yAxesLineNamePromise];
                        case 1:
                            yAxesLineName = _a.sent();
                            return [4 /*yield*/, xAxesLineNamePromise];
                        case 2:
                            xAxesLineName = _a.sent();
                            return [4 /*yield*/, yAxesNamePromise];
                        case 3:
                            yAxesName = _a.sent();
                            return [4 /*yield*/, xAxesNamePromise];
                        case 4:
                            xAxesName = _a.sent();
                            this.yAxesLineName(yAxesLineName);
                            this.xAxesLineName(xAxesLineName);
                            this.yAxesName(yAxesName);
                            this.xAxesName(xAxesName);
                            return [2 /*return*/];
                    }
                });
            });
        };
        SetpointChartComponent.prototype.getSignalForAxesName = function (axesValues, axesArraySignalName, columnSignals) {
            if (_.isArray(axesValues) && axesValues.length > 0) {
                return "";
            }
            if (axesArraySignalName !== null && axesArraySignalName !== "") {
                return axesArraySignalName;
            }
            var signal = _.first(columnSignals);
            if (signal != null) {
                return _.first(columnSignals).signalName();
            }
            return "";
        };
        SetpointChartComponent.prototype.getSignalDefinitionAxesAsync = function (signalName, propertyName, symbolicText) {
            return __awaiter(this, void 0, void 0, function () {
                var xAxesLineName;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!((signalName !== null && signalName !== "") && symbolicText == "")) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.connector.getSignalDefinition(signalName)];
                        case 1:
                            xAxesLineName = _a.sent();
                            if (propertyName !== null && propertyName !== "") {
                                return [2 /*return*/, this.extractSignalDefinitionProperty(xAxesLineName, propertyName)];
                            }
                            return [2 /*return*/, ""];
                        case 2: return [2 /*return*/, this.connector.translate(symbolicText)()];
                    }
                });
            });
        };
        SetpointChartComponent.prototype.getColumnSignals = function (signals, columnSignals, signalName, columnSignal) {
            var e_1, _a;
            if (signalName !== null && signalName !== "") {
                columnSignal = this.connector.getSignal(signalName);
            }
            else {
                try {
                    for (var signals_1 = __values(signals), signals_1_1 = signals_1.next(); !signals_1_1.done; signals_1_1 = signals_1.next()) {
                        var signalName_1 = signals_1_1.value;
                        if (signalName_1 !== null && signalName_1 !== "") {
                            var signal = this.connector.getSignal(signalName_1.stringPlaceholderResolver(this.objectID));
                            columnSignals.push(signal);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (signals_1_1 && !signals_1_1.done && (_a = signals_1.return)) _a.call(signals_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
        };
        SetpointChartComponent.prototype.getMin = function () {
            if (this.min !== null) {
                return this.min;
            }
            var min = _.min(this.yColumns());
            return min === -Infinity ? -100 : min;
        };
        SetpointChartComponent.prototype.getMax = function () {
            if (this.max !== null) {
                return this.max;
            }
            var max = _.max(this.yColumns());
            return max === Infinity ? 100 : max;
        };
        SetpointChartComponent.prototype.buildStaticColumns = function (columName, columnValues) {
            var e_2, _a;
            var columns = [
                columName
            ];
            try {
                for (var columnValues_1 = __values(columnValues), columnValues_1_1 = columnValues_1.next(); !columnValues_1_1.done; columnValues_1_1 = columnValues_1.next()) {
                    var value = columnValues_1_1.value;
                    columns.push(value);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (columnValues_1_1 && !columnValues_1_1.done && (_a = columnValues_1.return)) _a.call(columnValues_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return columns;
        };
        SetpointChartComponent.prototype.buildArrayColumns = function (columName, columnSignal) {
            var e_3, _a;
            var columns = [
                columName
            ];
            if (columnSignal) {
                var signals = columnSignal.value();
                if (_.isArray(signals)) {
                    try {
                        for (var signals_2 = __values(signals), signals_2_1 = signals_2.next(); !signals_2_1.done; signals_2_1 = signals_2.next()) {
                            var arrayValue = signals_2_1.value;
                            columns.push(arrayValue);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (signals_2_1 && !signals_2_1.done && (_a = signals_2.return)) _a.call(signals_2);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
            }
            return columns;
        };
        SetpointChartComponent.prototype.buildColumns = function (columName, columnSignals) {
            var e_4, _a;
            var columns = [
                columName
            ];
            var signals = columnSignals;
            try {
                for (var signals_3 = __values(signals), signals_3_1 = signals_3.next(); !signals_3_1.done; signals_3_1 = signals_3.next()) {
                    var signal = signals_3_1.value;
                    var value = signal.value();
                    columns.push(value === "n/a" ? 0 : value);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (signals_3_1 && !signals_3_1.done && (_a = signals_3.return)) _a.call(signals_3);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return columns;
        };
        SetpointChartComponent.prototype.getC3ChartObject = function () {
            var chart = {
                x: 'x',
                columns: [this.yColumns(), this.xColumns()],
                xLines: this.xLines(),
                yLines: this.yLines(),
                range: { max: this.getMax(), min: this.getMin() },
                type: 'line',
                colors: {},
                axes: {},
                showY: function () { return true; },
                yLabel: this.yAxesName(),
                xLabel: this.xAxesName()
            };
            var setpointTranslation = this.connector.translate(this.labelSymbolicText).peek();
            chart.colors[setpointTranslation] = this.color;
            chart.axes[setpointTranslation] = "y";
            return chart;
        };
        SetpointChartComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (this.languageSubscription) {
                                this.languageSubscription.dispose();
                            }
                            (_a = this.connector).unregisterSignals.apply(_a, __spread(this.yColumnSignals));
                            (_b = this.connector).unregisterSignals.apply(_b, __spread(this.xColumnSignals));
                            this.connector.unregisterSignals(this.yArrayColumnSignal);
                            this.connector.unregisterSignals(this.xArrayColumnSignal);
                            return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return SetpointChartComponent;
    }(ComponentBaseModel));
    return SetpointChartComponent;
});
//# sourceMappingURL=wf-setpoint-chart.component.js.map