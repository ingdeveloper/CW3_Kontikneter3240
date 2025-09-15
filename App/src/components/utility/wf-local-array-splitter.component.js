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
define(["require", "exports", "../models/array-signal-type", "../models/array-value-type", "../models/undefined-value-handling", "../models/output-write-buffering-mode", "../utility-component-base.model"], function (require, exports, array_signal_type_1, array_value_type_1, undefined_value_handling_1, output_write_buffering_mode_1, UtilityComponentBaseModel) {
    "use strict";
    var ReadWriteState;
    (function (ReadWriteState) {
        ReadWriteState[ReadWriteState["StartingRead"] = 0] = "StartingRead";
        ReadWriteState[ReadWriteState["ReadComplete"] = 1] = "ReadComplete";
        ReadWriteState[ReadWriteState["WriteEnabled"] = 2] = "WriteEnabled";
    })(ReadWriteState || (ReadWriteState = {}));
    var WfLocalArraySplitterComponent = /** @class */ (function (_super) {
        __extends(WfLocalArraySplitterComponent, _super);
        function WfLocalArraySplitterComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.values = undefined;
            return _this;
        }
        WfLocalArraySplitterComponent.extractBetween = function (inputString, leftDelimiter, rightDelimiter) {
            var startIndex = leftDelimiter === "" ? -1 : inputString.indexOf(leftDelimiter);
            var endIndex = rightDelimiter === "" ? inputString.length : inputString.lastIndexOf(rightDelimiter);
            if (leftDelimiter !== "" && startIndex === -1)
                return undefined;
            if (rightDelimiter !== "" && endIndex === -1 || endIndex < startIndex)
                return undefined;
            return inputString.substring(startIndex + 1, endIndex);
        };
        WfLocalArraySplitterComponent.createLocalSignalMap = function (localSignals) {
            return localSignals.reduce(function (prev, signal) {
                prev[signal.signalName.peek()] = signal;
                return prev;
            }, {});
        };
        WfLocalArraySplitterComponent.prototype.initializeSettings = function () {
            var _this = this;
            _super.prototype.initializeSettings.call(this);
            this.inputSignalName = UtilityComponentBaseModel.stringParam(this.settings.inputSignalName, "").stringPlaceholderResolver(this.objectID);
            this.inputArrayType = ko.unwrap(this.settings.inputArrayType) || array_signal_type_1.ArraySignalType.Native;
            this.inputArrayLeftDelimiter = UtilityComponentBaseModel.stringParam(this.settings.inputArrayLeftDelimiter, "[");
            this.inputArrayRightDelimiter = UtilityComponentBaseModel.stringParam(this.settings.inputArrayRightDelimiter, "]");
            this.inputArrayElementSeparator = UtilityComponentBaseModel.stringParam(this.settings.inputArrayElementSeparator, ",");
            this.inputArrayElementQuote = UtilityComponentBaseModel.stringParam(this.settings.inputArrayElementQuote, "\"");
            this.inputArrayStripWhitespace = ko.unwrap(this.settings.inputArrayStripWhitespace) !== false;
            this.arrayValueType = ko.unwrap(this.settings.arrayValueType) || array_value_type_1.ArrayValueType.Decimal;
            this.arrayMaxSize = Math.max(ko.unwrap(this.settings.arrayMaxSize) || 0, 0);
            this.arrayMinSize = Math.max(ko.unwrap(this.settings.arrayMinSize) || 0, 0);
            this.arrayNameTemplate = UtilityComponentBaseModel.stringParam(this.settings.arrayNameTemplate, "{InputSignalName}{Index}").stringPlaceholderResolver(this.objectID);
            this.outputSignalName = (ko.unwrap(this.settings.outputSignalName) || "").stringPlaceholderResolver(this.objectID);
            this.outputArrayType = ko.unwrap(this.settings.outputArrayType) || array_signal_type_1.ArraySignalType.Native;
            this.outputArrayLeftDelimiter = UtilityComponentBaseModel.stringParam(this.settings.outputArrayLeftDelimiter, "[");
            this.outputArrayRightDelimiter = UtilityComponentBaseModel.stringParam(this.settings.outputArrayRightDelimiter, "]");
            this.outputArrayElementSeparator = UtilityComponentBaseModel.stringParam(this.settings.outputArrayElementSeparator, ",");
            this.outputArrayElementQuote = UtilityComponentBaseModel.stringParam(this.settings.outputArrayElementQuote, "\"");
            this.outputKeepNulls = ko.unwrap(this.settings.outputKeepNulls) !== false;
            this.undefinedValueHandling = ko.unwrap(this.settings.undefinedValueHandling) || undefined_value_handling_1.UndefinedValueHandling.UseNull;
            this.undefinedDefaultValue = ko.unwrap(this.settings.undefinedDefaultValue);
            this.outputWriteBufferingMode = ko.unwrap(this.settings.outputWriteBufferingMode) || output_write_buffering_mode_1.OutputWriteBufferingMode.None;
            this.outputWriteBufferingInterval = ko.unwrap(this.settings.outputWriteBufferingInterval) || 500;
            this.outputWriteTriggerSignalName = UtilityComponentBaseModel.stringParam(this.settings.outputWriteTriggerSignalName, "").stringPlaceholderResolver(this.objectID);
            this.writeOnRead = ko.unwrap(this.settings.writeOnRead) === true;
            this.inputSignal = this.connector.getSignal(this.inputSignalName);
            this.localSignals = ko.observableArray([]);
            this.readWriteState = ko.observable(ReadWriteState.StartingRead);
            this.signalProcess = ko.computed(function () { return _this.processInput(); });
            if (this.outputSignalName && this.outputSignalName.length) {
                this.writeOutputProcess = ko.computed(function () { return _this.processOutput(); });
            }
            this.connector.getOnlineUpdates();
        };
        WfLocalArraySplitterComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _b.sent();
                            this.signalProcess.dispose();
                            this.writeOutputProcess.dispose();
                            this.clearSamplingTimer();
                            return [4 /*yield*/, this.connector.unregisterSignals(this.inputSignalName)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, (_a = this.connector).unregisterSignals.apply(_a, __spread(this.localSignals()))];
                        case 3:
                            _b.sent();
                            if (this.trigger)
                                this.trigger.dispose();
                            if (!this.triggerSignal) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.connector.unregisterSignals(this.triggerSignal)];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        WfLocalArraySplitterComponent.prototype.processInput = function () {
            var _this = this;
            if (!this.inputSignal.hasValue())
                return;
            var inputValue = this.inputSignal.value();
            this.readWriteState(ReadWriteState.StartingRead);
            var localSignals = this.localSignals.peek();
            var localSignalMap = WfLocalArraySplitterComponent.createLocalSignalMap(localSignals);
            this.localSignals([]);
            var nativeInputArray = this.makeNativeArray(inputValue);
            var localSignalNames = [];
            var localSignalValues = {};
            var minArrayLength = Math.max(this.arrayMinSize, nativeInputArray.length);
            var maxArrayLength = this.arrayMaxSize || nativeInputArray.length;
            var desiredArrayLength = Math.min(minArrayLength, maxArrayLength);
            for (var i = 0; i < desiredArrayLength; ++i) {
                var signalName = this.makeLocalSignalName(i);
                localSignalValues[signalName] = i < nativeInputArray.length ? nativeInputArray[i] : null;
                localSignalNames.push(signalName);
            }
            this.connector.writeSignals(localSignalValues)
                .then(function () {
                _this.fillLocalSignals(localSignalNames, localSignalMap);
                _this.finalizeRead();
            });
        };
        WfLocalArraySplitterComponent.prototype.finalizeRead = function () {
            if (this.writeOnRead) {
                this.readWriteState(ReadWriteState.WriteEnabled);
            }
            else {
                this.readWriteState(ReadWriteState.ReadComplete);
            }
        };
        WfLocalArraySplitterComponent.prototype.fillLocalSignals = function (localSignalNames, localSignalMap) {
            var e_1, _a;
            try {
                for (var localSignalNames_1 = __values(localSignalNames), localSignalNames_1_1 = localSignalNames_1.next(); !localSignalNames_1_1.done; localSignalNames_1_1 = localSignalNames_1.next()) {
                    var name_1 = localSignalNames_1_1.value;
                    var prevSignal = localSignalMap[name_1];
                    if (prevSignal) {
                        this.localSignals.push(prevSignal);
                        delete localSignalMap[name_1];
                    }
                    else {
                        this.localSignals.push(this.connector.getSignal(name_1));
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (localSignalNames_1_1 && !localSignalNames_1_1.done && (_a = localSignalNames_1.return)) _a.call(localSignalNames_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.unsubscribeFromUnusedLocalSignals(localSignalMap);
        };
        WfLocalArraySplitterComponent.prototype.unsubscribeFromUnusedLocalSignals = function (localSignalMap) {
            var _a;
            var leftoverSignals = Object.keys(localSignalMap);
            (_a = this.connector).unregisterSignals.apply(_a, __spread(leftoverSignals));
        };
        WfLocalArraySplitterComponent.prototype.processOutput = function () {
            // get the local signal values to enable change notifications
            var localSignals = this.localSignals();
            var localSignalValues = localSignals.map(function (x) { return x.value(); });
            var writeCycle = this.readWriteState();
            switch (writeCycle) {
                case ReadWriteState.StartingRead:
                    return;
                case ReadWriteState.ReadComplete:
                    // in the next cycle we can start writing
                    this.readWriteState(ReadWriteState.WriteEnabled);
                    return;
                default:
                    // this only happens when the status is WriteEnabled
                    this.performWrite(localSignalValues);
                    return;
            }
        };
        WfLocalArraySplitterComponent.prototype.clearSamplingTimer = function () {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = undefined;
            }
        };
        WfLocalArraySplitterComponent.prototype.performWrite = function (signalValues) {
            if (!this.writeCallback) {
                this.initializeWriteCallback(signalValues);
            }
            this.writeCallback(signalValues);
        };
        WfLocalArraySplitterComponent.prototype.initializeWriteCallback = function (currentValues) {
            switch (this.outputWriteBufferingMode) {
                case output_write_buffering_mode_1.OutputWriteBufferingMode.None:
                    this.initializeDirectWriteCallback();
                    break;
                case output_write_buffering_mode_1.OutputWriteBufferingMode.Debounced:
                    this.initializeDebouncedWriteCallback();
                    break;
                case output_write_buffering_mode_1.OutputWriteBufferingMode.Throttle:
                    this.initializeThrottleWriteCallback();
                    break;
                case output_write_buffering_mode_1.OutputWriteBufferingMode.Sampled:
                    this.initializeSampledWriteCallback();
                    break;
                case output_write_buffering_mode_1.OutputWriteBufferingMode.WaitAll:
                    this.initializeWaitAllWriteCallback(currentValues);
                    break;
                case output_write_buffering_mode_1.OutputWriteBufferingMode.Triggered:
                    this.initializeTriggeredWriteCallback();
                    break;
            }
        };
        WfLocalArraySplitterComponent.prototype.initializeTriggeredWriteCallback = function () {
            var _this = this;
            this.writeCallback = function (values) { return _this.values = values; };
            this.triggerSignal = this.connector.getSignal(this.outputWriteTriggerSignalName);
            var initial = true;
            this.trigger = ko.computed(function () {
                _this.triggerSignal.value();
                if (initial) {
                    initial = false;
                    return;
                }
                _this.writeOutput(_this.values);
            });
        };
        WfLocalArraySplitterComponent.prototype.initializeWaitAllWriteCallback = function (initialValues) {
            var _this = this;
            this.values = initialValues;
            this.writeCallback = function (values) {
                var allChanged = _.every(values, function (value, index) { return _this.values[index] !== value; });
                if (allChanged) {
                    _this.writeOutput(values);
                    _this.values = values;
                }
            };
        };
        WfLocalArraySplitterComponent.prototype.initializeSampledWriteCallback = function () {
            var _this = this;
            this.writeCallback = function (values) {
                _this.values = values;
                if (!_this.timer) {
                    _this.timer = window.setInterval(function () { return _this.writeOutput(_this.values); }, _this.outputWriteBufferingInterval);
                }
            };
        };
        WfLocalArraySplitterComponent.prototype.initializeThrottleWriteCallback = function () {
            var _this = this;
            this.writeCallback = _.throttle(function (values) { return _this.writeOutput(values); }, this.outputWriteBufferingInterval, { leading: false });
        };
        WfLocalArraySplitterComponent.prototype.initializeDebouncedWriteCallback = function () {
            var _this = this;
            this.writeCallback = _.debounce(function (values) { return _this.writeOutput(values); }, this.outputWriteBufferingInterval);
        };
        WfLocalArraySplitterComponent.prototype.initializeDirectWriteCallback = function () {
            var _this = this;
            this.writeCallback = function (values) { return _this.writeOutput(values); };
        };
        WfLocalArraySplitterComponent.prototype.writeOutput = function (values) {
            var value = values || [];
            if (this.outputArrayType === array_signal_type_1.ArraySignalType.String) {
                value = this.makeStringArray(values);
            }
            var signals = {};
            signals[this.outputSignalName] = value;
            // noinspection JSIgnoredPromiseFromCall
            this.connector.writeSignals(signals);
        };
        WfLocalArraySplitterComponent.prototype.makeStringArray = function (values) {
            var _this = this;
            return this.outputArrayLeftDelimiter
                + values
                    .filter(function (value) { return _this.outputKeepNulls ? value : (value !== null && value !== undefined); })
                    .map(function (value) { return _this.formatOutputValue(value); }).join(this.outputArrayElementSeparator)
                + this.outputArrayRightDelimiter;
        };
        WfLocalArraySplitterComponent.prototype.formatOutputValue = function (value) {
            if (value === null || value === undefined) {
                if (this.undefinedValueHandling === undefined_value_handling_1.UndefinedValueHandling.UseNull)
                    return "null";
                value = this.undefinedDefaultValue;
            }
            var stringValue = "";
            switch (this.arrayValueType) {
                case array_value_type_1.ArrayValueType.Decimal:
                    stringValue = Number(value).toString(10);
                    break;
                case array_value_type_1.ArrayValueType.Integer:
                    stringValue = Math.floor(Number(value)).toString(10);
                    break;
                case array_value_type_1.ArrayValueType.Boolean:
                    stringValue = Boolean(value).toString();
                    break;
                default:
                    stringValue = String(value);
                    break;
            }
            return this.outputArrayElementQuote + stringValue + this.outputArrayElementQuote;
        };
        WfLocalArraySplitterComponent.prototype.makeLocalSignalName = function (index) {
            return "local://" +
                this.arrayNameTemplate
                    .replace(/{InputSignalName}/ig, this.inputSignalName)
                    .replace(/{Index}/ig, (index + 1).toString(10));
        };
        WfLocalArraySplitterComponent.prototype.makeNativeArray = function (input) {
            var _this = this;
            if (this.inputArrayType === array_signal_type_1.ArraySignalType.Native) {
                return input;
            }
            var inputString = WfLocalArraySplitterComponent.extractBetween(input, this.inputArrayLeftDelimiter, this.inputArrayRightDelimiter);
            if (inputString === undefined)
                return [];
            return inputString
                .split(this.inputArrayElementSeparator)
                .map(function (x) { return _this.extractArrayElement(x); });
        };
        WfLocalArraySplitterComponent.prototype.extractArrayElement = function (rawElement) {
            rawElement = this.inputArrayStripWhitespace ? rawElement.trim() : rawElement;
            var extracted = WfLocalArraySplitterComponent.extractBetween(rawElement, this.inputArrayElementQuote, this.inputArrayElementQuote);
            if (extracted === null || extracted === undefined || (rawElement === "null" && this.inputArrayElementQuote.length)) {
                return (this.undefinedValueHandling === undefined_value_handling_1.UndefinedValueHandling.UseNull) ? null : this.undefinedDefaultValue;
            }
            switch (this.arrayValueType) {
                case array_value_type_1.ArrayValueType.Decimal:
                    return Number.parseFloat(extracted).valueOf();
                case array_value_type_1.ArrayValueType.Integer:
                    return Number.parseInt(extracted, 10).valueOf();
                case array_value_type_1.ArrayValueType.Boolean:
                    return Boolean(extracted).valueOf();
                default:
                    return extracted;
            }
        };
        return WfLocalArraySplitterComponent;
    }(UtilityComponentBaseModel));
    return WfLocalArraySplitterComponent;
});
//# sourceMappingURL=wf-local-array-splitter.component.js.map