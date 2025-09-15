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
define(["require", "exports", "../services/value-conversions.service", "../component-base.model", "../services/signal-array.service"], function (require, exports, ValueConversionsService, ComponentBaseModel, SignalArrayService) {
    "use strict";
    var WfGauge1Component = /** @class */ (function (_super) {
        __extends(WfGauge1Component, _super);
        function WfGauge1Component(params) {
            var _this = _super.call(this, params) || this;
            _this.currentSignalValue = ko.observable();
            _this.maxValueVioliation = ko.observable(false);
            _this.minValueVioliation = ko.observable(false);
            if (!_this.signalName) {
                _this.needleAngle = ko.observable(0);
            }
            _this.signal = _this.connector.getSignal(_this.signalName);
            _this.initializeSignalArray();
            if (_this.signalArrayService.isArray) {
                _this.currentSignalValue = _this.signalArrayService.signalValue;
            }
            else {
                _this.currentSignalValue = _this.signal.value;
            }
            // The formated value will be used for value display
            _this.formattedSignalValue = _this.currentSignalValue.extend({ numeralNumber: _this.format });
            _this.connector.getOnlineUpdates();
            _this.initializeComputeds();
            return _this;
        }
        WfGauge1Component.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.valueConversionsService = new ValueConversionsService();
            //#region Properties
            this.r2d = Math.PI / 180;
            this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : '0,0.[00]';
            //this.height = ko.unwrap(settings.width) !== undefined ? ko.unwrap(settings.width) : 200;
            this.width = ko.unwrap(this.settings.width) !== undefined ? ko.unwrap(this.settings.width) : 200;
            this.height = this.width;
            this.showValueLabel = ko.unwrap(this.settings.showValueLabel) !== undefined ? ko.unwrap(this.settings.showValueLabel) : true;
            this.radius = Math.min(this.width, this.height) / 2;
            this.innerRadius = ko.unwrap(this.settings.innerRadius) !== undefined ? ko.unwrap(this.settings.innerRadius) : 0.55;
            this.backgroundFillColor = ko.unwrap(this.settings.backgroundFillColor) || '#5cb85c';
            this.lowRangeFillColor = ko.unwrap(this.settings.lowRangeFillColor) || '#f0ad4e';
            this.highRangeFillColor = ko.unwrap(this.settings.highRangeFillColor) || '#d9534f';
            this.needleFillColor = ko.unwrap(this.settings.needleFillColor) || '#555555';
            this.iconColor = ko.unwrap(this.settings.iconColor) ? ko.unwrap(this.settings.iconColor) : '#ffffff';
            this.iconBackgroundColor = ko.unwrap(this.settings.iconBackgroundColor) || '#999999';
            this.iconClass = ko.unwrap(this.settings.iconClass) ? ko.unwrap(this.settings.iconClass) : 'wf wf-speed-gauge wf-2x';
            this.iconStyle = ko.unwrap(this.settings.iconStyle) || "";
            this.majorTicks = ko.unwrap(this.settings.majorTicks) !== undefined ? (ko.unwrap(this.settings.majorTicks) - 1) : 5;
            this.minorTicks = ko.unwrap(this.settings.minorTicks) !== undefined ? ko.unwrap(this.settings.minorTicks) : 5;
            this.minRange = ko.unwrap(this.settings.minRange) !== undefined ? ko.unwrap(this.settings.minRange) : 0;
            this.maxRange = ko.unwrap(this.settings.maxRange) !== undefined ? ko.unwrap(this.settings.maxRange) : 100;
            this.startAngle = ko.unwrap(this.settings.startAngle) !== undefined ? ko.unwrap(this.settings.startAngle) : -90;
            this.endAngle = ko.unwrap(this.settings.endAngle) !== undefined ? ko.unwrap(this.settings.endAngle) : 90;
            //#endregion
            this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
            this.majorTicks = ko.unwrap(this.settings.majorTicks) !== undefined ? (ko.unwrap(this.settings.majorTicks) - 1) : 5;
            this.minorTicks = ko.unwrap(this.settings.minorTicks) !== undefined ? ko.unwrap(this.settings.minorTicks) : 5;
            this.majorTicksSignalName = ko.unwrap(this.settings.majorTicksSignalName) ? ko.unwrap(this.settings.majorTicksSignalName) : null;
            if (this.majorTicksSignalName)
                this.majorTicksSignal = this.connector.getSignal(this.majorTicksSignalName);
            this.minorTicksSignalName = ko.unwrap(this.settings.minorTicksSignalName) ? ko.unwrap(this.settings.minorTicksSignalName) : null;
            if (this.minorTicksSignalName)
                this.minorTicksSignal = this.connector.getSignal(this.minorTicksSignalName);
            this.maxRangeSignalName = ko.unwrap(this.settings.maxRangeSignalName) ? ko.unwrap(this.settings.maxRangeSignalName) : null;
            if (this.maxRangeSignalName)
                this.maxRangeSignal = this.connector.getSignal(this.maxRangeSignalName);
            this.minRangeSignalName = ko.unwrap(this.settings.minRangeSignalName) ? ko.unwrap(this.settings.minRangeSignalName) : null;
            if (this.minRangeSignalName)
                this.minRangeSignal = this.connector.getSignal(this.minRangeSignalName);
            this.lowRangeStartSignalName = ko.unwrap(this.settings.lowRangeStartSignalName) ? ko.unwrap(this.settings.lowRangeStartSignalName) : null;
            if (this.lowRangeStartSignalName)
                this.lowRangeStartSignal = this.connector.getSignal(this.lowRangeStartSignalName);
            this.lowRangeEndSignalName = ko.unwrap(this.settings.lowRangeEndSignalName) ? ko.unwrap(this.settings.lowRangeEndSignalName) : null;
            if (this.lowRangeEndSignalName)
                this.lowRangeEndSignal = this.connector.getSignal(this.lowRangeEndSignalName);
            this.highRangeStartSignalName = ko.unwrap(this.settings.highRangeStartSignalName) ? ko.unwrap(this.settings.highRangeStartSignalName) : null;
            if (this.highRangeStartSignalName)
                this.highRangeStartSignal = this.connector.getSignal(this.highRangeStartSignalName);
            this.highRangeEndSignalName = ko.unwrap(this.settings.highRangeEndSignalName) ? ko.unwrap(this.settings.highRangeEndSignalName) : null;
            if (this.highRangeEndSignalName)
                this.highRangeEndSignal = this.connector.getSignal(this.highRangeEndSignalName);
            this.majorTicksSignalName = ko.unwrap(this.settings.majorTicksSignalName) ? ko.unwrap(this.settings.majorTicksSignalName) : null;
            if (this.majorTicksSignalName)
                this.majorTicksSignal = this.connector.getSignal(this.majorTicksSignalName);
            this.minorTicksSignalName = ko.unwrap(this.settings.minorTicksSignalName) ? ko.unwrap(this.settings.minorTicksSignalName) : null;
            if (this.minorTicksSignalName)
                this.minorTicksSignal = this.connector.getSignal(this.minorTicksSignalName);
        };
        WfGauge1Component.prototype.initializeComputeds = function () {
            var _this = this;
            this.marginBottom = ko.pureComputed(function () {
                if (_this.showValueLabel === false) {
                    return -_this.width / 4 + 'px';
                }
                else {
                    return 'auto';
                }
            });
            this.maxRangeValue = ko.computed(function () {
                return _this.maxRangeSignal ? _.isNumber(_this.maxRangeSignal.value()) ? _this.maxRangeSignal.value() : _this.maxRange : _this.maxRange;
            });
            this.minRangeValue = ko.computed(function () {
                return _this.minRangeSignal ? _.isNumber(_this.minRangeSignal.value()) ? _this.minRangeSignal.value() : _this.minRange : _this.minRange;
            });
            this.lowRangeStart = ko.computed(function () {
                var lowRangeStart = _this.lowRangeStartSignal ? _.isNumber(_this.lowRangeStartSignal.value()) ? _this.lowRangeStartSignal.value() : _this.settings.lowRangeStart : _this.settings.lowRangeStart;
                return ko.unwrap(lowRangeStart) !== undefined ? ko.unwrap(lowRangeStart) : _this.maxRangeValue() * 0.6;
            });
            this.lowRangeEnd = ko.computed(function () {
                var lowRangeEnd = _this.lowRangeEndSignal ? _.isNumber(_this.lowRangeEndSignal.value()) ? _this.lowRangeEndSignal.value() : _this.settings.lowRangeEnd : _this.settings.lowRangeEnd;
                return ko.unwrap(lowRangeEnd) !== undefined ? ko.unwrap(lowRangeEnd) : _this.maxRangeValue() * 0.8;
            });
            this.highRangeStart = ko.computed(function () {
                var highRangeStart = _this.highRangeStartSignal ? _.isNumber(_this.highRangeStartSignal.value()) ? _this.highRangeStartSignal.value() : _this.settings.highRangeStart : _this.settings.highRangeStart;
                return ko.unwrap(highRangeStart) !== undefined ? ko.unwrap(highRangeStart) : _this.maxRangeValue() * 0.8;
            });
            this.highRangeEnd = ko.computed(function () {
                var highRangeEnd = _this.highRangeEndSignal ? _.isNumber(_this.highRangeEndSignal.value()) ? _this.highRangeEndSignal.value() : _this.settings.highRangeEnd : _this.settings.highRangeEnd;
                return ko.unwrap(highRangeEnd) !== undefined ? ko.unwrap(highRangeEnd) : _this.maxRangeValue();
            });
            this.lowRangeStartAngle = ko.computed(function () {
                return _this.valueConversionsService.linearScale(_this.lowRangeStart(), _this.minRangeValue(), _this.maxRangeValue(), _this.startAngle, _this.endAngle);
            });
            this.lowRangeEndAngle = ko.computed(function () {
                return _this.valueConversionsService.linearScale(_this.lowRangeEnd(), _this.minRangeValue(), _this.maxRangeValue(), _this.startAngle, _this.endAngle);
            });
            this.highRangeStartAngle = ko.computed(function () {
                return _this.valueConversionsService.linearScale(_this.highRangeStart(), _this.minRangeValue(), _this.maxRangeValue(), _this.startAngle, _this.endAngle);
            });
            this.highRangeEndAngle = ko.computed(function () {
                return _this.valueConversionsService.linearScale(_this.highRangeEnd(), _this.minRangeValue(), _this.maxRangeValue(), _this.startAngle, _this.endAngle);
            });
            this.majorTicksValue = ko.computed(function () {
                return _this.majorTicksSignal ? _.isNumber(_this.majorTicksSignal.value()) ? _this.majorTicksSignal.value() : _this.majorTicks : _this.majorTicks;
            });
            this.minorTicksValue = ko.computed(function () {
                return _this.minorTicksSignal ? _.isNumber(_this.minorTicksSignal.value()) ? _this.minorTicksSignal.value() : _this.minorTicks : _this.minorTicks;
            });
            this.majorTicksArray = ko.computed(function () {
                return _this.majorTicksValue() <= 0 ? [] : _.union(_.range(_this.startAngle, _this.endAngle + (_this.endAngle - _this.startAngle) / _this.majorTicksValue(), (_this.endAngle - _this.startAngle) / _this.majorTicksValue()), [_this.endAngle]);
            });
            this.minorTicksArray = ko.computed(function () {
                return _this.majorTicksValue() * _this.minorTicksValue() <= 0 ? [] : _.range(_this.startAngle, _this.endAngle, (_this.endAngle - _this.startAngle) / (_this.majorTicksValue() * _this.minorTicksValue()));
            });
            this.needleAngle = ko.pureComputed(function () {
                var value = _this.currentSignalValue();
                // Prevent the needle angle to be higher as the max angle of the gauge (endAngle)
                if (value > _this.maxRangeValue()) {
                    _this.maxValueVioliation(true);
                    _this.minValueVioliation(false);
                    return 'rotate(' + _this.endAngle + 'deg)';
                }
                if (value < _this.minRangeValue()) {
                    _this.minValueVioliation(true);
                    _this.maxValueVioliation(false);
                    return 'rotate(' + _this.startAngle + 'deg)';
                }
                _this.maxValueVioliation(false);
                _this.minValueVioliation(false);
                // Otherwise recalculate the needle angle
                var degree = _this.valueConversionsService.linearScale(_this.currentSignalValue(), _this.minRangeValue(), _this.maxRangeValue(), _this.startAngle, _this.endAngle);
                return 'rotate(' + degree + 'deg)';
            }, this);
            this.lowRangeValidation = ko.computed(function () {
                if (_this.lowRangeEnd() < _this.lowRangeStart())
                    console.warn("lowRangeEnd " + _this.lowRangeEnd() + " should be greater as lowRangeStart " + _this.lowRangeStart());
            }, this);
            this.highRangeValidation = ko.computed(function () {
                if (_this.highRangeEnd() < _this.highRangeStart())
                    console.warn("highRangeEnd " + _this.highRangeEnd() + " should be greater as highRangeStart " + _this.highRangeStart());
            }, this);
            this.rangeValidation = ko.computed(function () {
                if (_this.maxRangeValue() < _this.minRangeValue())
                    console.warn("maxRange " + _this.maxRangeValue() + " should be greater as minRange " + _this.minRangeValue());
            }, this);
        };
        WfGauge1Component.prototype.initializeSignalArray = function () {
            this.signalArrayService = new SignalArrayService(this.settings, this.signal);
        };
        WfGauge1Component.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _super.prototype.dispose.call(this);
                            if (!this.maxRangeSignal) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.connector.unregisterSignals(this.maxRangeSignal)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            if (!this.minRangeSignal) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.connector.unregisterSignals(this.majorTicksSignal)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            if (!this.majorTicksSignal) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.connector.unregisterSignals(this.minRangeSignal)];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6:
                            if (!this.minorTicksSignal) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.connector.unregisterSignals(this.minorTicksSignal)];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8:
                            if (!this.lowRangeStartSignal) return [3 /*break*/, 10];
                            return [4 /*yield*/, this.connector.unregisterSignals(this.lowRangeStartSignal)];
                        case 9:
                            _a.sent();
                            _a.label = 10;
                        case 10:
                            if (!this.lowRangeEndSignal) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.connector.unregisterSignals(this.lowRangeEndSignal)];
                        case 11:
                            _a.sent();
                            _a.label = 12;
                        case 12:
                            if (!this.highRangeStartSignal) return [3 /*break*/, 14];
                            return [4 /*yield*/, this.connector.unregisterSignals(this.highRangeStartSignal)];
                        case 13:
                            _a.sent();
                            _a.label = 14;
                        case 14:
                            if (!this.highRangeEndSignal) return [3 /*break*/, 16];
                            return [4 /*yield*/, this.connector.unregisterSignals(this.highRangeEndSignal)];
                        case 15:
                            _a.sent();
                            _a.label = 16;
                        case 16:
                            if (!this.signal)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.connector.unregisterSignals(this.signal)];
                        case 17:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfGauge1Component;
    }(ComponentBaseModel));
    return WfGauge1Component;
});
//# sourceMappingURL=wf-gauge-1.component.js.map