var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SignalWithAlarmInfo = void 0;
    var MultipleStates;
    (function (MultipleStates) {
        MultipleStates[MultipleStates["MultipleStates"] = 4] = "MultipleStates";
    })(MultipleStates || (MultipleStates = {}));
    var SignalWithAlarmInfo = /** @class */ (function () {
        function SignalWithAlarmInfo(item, discreteValues, colors, activateOrDeactivateAlarmState) {
            var _this = this;
            if (activateOrDeactivateAlarmState === void 0) { activateOrDeactivateAlarmState = function () { }; }
            this.activateOrDeactivateAlarmState = activateOrDeactivateAlarmState;
            this.notProcessedButVisibleCount = ko.observable();
            this.processedAndVisibleCount = ko.observable();
            this.notProcessedAndNotVisibleCount = ko.observable();
            this.processedButNotVisibleCount = ko.observable();
            this.inactiveCount = ko.observable();
            this.onCount = ko.observable();
            this.acknowledgedCount = ko.observable();
            this.offCount = ko.observable();
            this.value = ko.observable();
            this.onlineAlarmStatus = ko.pureComputed(function () {
                if (_this.onCount()) {
                    return "signal-alarm-status-on " + _this.rowItemCssClass;
                }
                if (_this.acknowledgedCount()) {
                    return "signal-alarm-status-acknowledged " + _this.rowItemCssClass;
                }
                if (_this.offCount()) {
                    return "signal-alarm-status-off " + _this.rowItemCssClass;
                }
                if (_this.inactiveCount()) {
                    return "signal-alarm-status-inactive " + _this.rowItemCssClass;
                }
            });
            this.background = ko.pureComputed(function () {
                if (_this.onCount() && _this.onAlarmBackground) {
                    return _this.onAlarmBackground;
                }
                if (_this.acknowledgedCount() && _this.acknowledgedAlarmBackground) {
                    return _this.acknowledgedAlarmBackground;
                }
                if (_this.offCount() && _this.offAlarmBackground) {
                    return _this.offAlarmBackground;
                }
                if (_this.inactiveCount() && _this.inactiveAlarmBackground) {
                    return _this.inactiveAlarmBackground;
                }
            });
            this.foreground = ko.pureComputed(function () {
                if (_this.onCount() && _this.onAlarmForeground) {
                    return _this.onAlarmForeground;
                }
                if (_this.acknowledgedCount() && _this.acknowledgedAlarmForeground) {
                    return _this.acknowledgedAlarmForeground;
                }
                if (_this.offCount() && _this.offAlarmForeground) {
                    return _this.offAlarmForeground;
                }
                if (_this.inactiveCount() && _this.inactiveAlarmForeground) {
                    return _this.inactiveAlarmForeground;
                }
            });
            this.alarmProcessingAndDisplayStatus = ko.pureComputed(function () {
                var test = [
                    {
                        state: AlarmProcessingAndDisplayState.NotProcessedButVisible,
                        value: _this.notProcessedButVisibleCount()
                    },
                    {
                        state: AlarmProcessingAndDisplayState.ProcessedAndVisible,
                        value: _this.processedAndVisibleCount()
                    },
                    {
                        state: AlarmProcessingAndDisplayState.NotProcessedAndNotVisible,
                        value: _this.notProcessedAndNotVisibleCount()
                    },
                    {
                        state: AlarmProcessingAndDisplayState.ProcessedButNotVisible,
                        value: _this.processedButNotVisibleCount()
                    }
                ];
                var items = test.filter(function (x) { return x.value !== 0 && x.value !== null && x.value !== undefined; });
                if (items.length === 1) {
                    return items[0].state;
                }
                else {
                    return MultipleStates.MultipleStates;
                }
            });
            this.discreteValues = discreteValues;
            this.signalId = item.SignalId;
            this.name = item.Name;
            this.aliasName = item.AliasName;
            this.description = item.Description;
            this.unit = item.Unit;
            this.discreteValueTypeID = item.DiscreteValueTypeID;
            this.notProcessedButVisibleCount(item.NotProcessedButVisibleCount);
            this.processedAndVisibleCount(item.ProcessedAndVisibleCount);
            this.notProcessedAndNotVisibleCount(item.NotProcessedAndNotVisibleCount);
            this.processedButNotVisibleCount(item.ProcessedButNotVisibleCount);
            this.inactiveCount(item.InactiveCount);
            this.onCount(item.OnCount);
            this.acknowledgedCount(item.AcknowledgedCount);
            this.offCount(item.OffCount);
            this.alarmInfos = item.AlarmInfos;
            this.inactiveAlarmForeground = colors.inactiveAlarmForeground;
            this.inactiveAlarmBackground = colors.inactiveAlarmBackground;
            this.onAlarmForeground = colors.onAlarmForeground;
            this.onAlarmBackground = colors.onAlarmBackground;
            this.offAlarmForeground = colors.offAlarmForeground;
            this.offAlarmBackground = colors.offAlarmBackground;
            this.acknowledgedAlarmForeground = colors.acknowledgedAlarmForeground;
            this.acknowledgedAlarmBackground = colors.acknowledgedAlarmBackground;
            this.rowItemCssClass = colors.rowItemCssClass;
        }
        SignalWithAlarmInfo.prototype.getStateText = function (state) {
            var states = __assign(__assign({}, AlarmProcessingAndDisplayState), MultipleStates);
            return "I4SCADA_" + states[state];
        };
        SignalWithAlarmInfo.prototype.updateCounts = function (item) {
            this.notProcessedButVisibleCount(item.NotProcessedButVisibleCount);
            this.processedAndVisibleCount(item.ProcessedAndVisibleCount);
            this.notProcessedAndNotVisibleCount(item.NotProcessedAndNotVisibleCount);
            this.processedButNotVisibleCount(item.ProcessedButNotVisibleCount);
            this.inactiveCount(item.InactiveCount);
            this.onCount(item.OnCount);
            this.acknowledgedCount(item.AcknowledgedCount);
            this.offCount(item.OffCount);
            this.alarmInfos = item.AlarmInfos;
        };
        SignalWithAlarmInfo.prototype.updateValue = function (value) {
            var _this = this;
            this.value = value;
            this.isDateTime = ko.computed(function () {
                var date = _this.value();
                if (typeof date === 'string') {
                    var isDate = /\/Date\([0-9]{13}\+[0-9]{4}\)\//g;
                    return isDate.test(date);
                }
                return false;
            });
            return this;
        };
        SignalWithAlarmInfo.prototype.onChangeProcessingAndDisplayState = function (alarm, event) {
            return __awaiter(this, void 0, void 0, function () {
                var state;
                return __generator(this, function (_a) {
                    state = parseInt($(event.target).val());
                    this.activateOrDeactivateAlarmState(alarm.alarmInfos.map(function (x) { return x.AlarmId; }), state);
                    return [2 /*return*/];
                });
            });
        };
        return SignalWithAlarmInfo;
    }());
    exports.SignalWithAlarmInfo = SignalWithAlarmInfo;
});
//# sourceMappingURL=signal-with-alarm-info.model.js.map