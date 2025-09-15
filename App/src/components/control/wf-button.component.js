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
define(["require", "exports", "../services/visual-states.service", "../component-base.model", "../services/signal-array.service"], function (require, exports, VisualStatesService, ComponentBaseModel, SignalArrayService) {
    "use strict";
    var WfButtonComponent = /** @class */ (function (_super) {
        __extends(WfButtonComponent, _super);
        function WfButtonComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.isRunning = ko.observable(false);
            _this.isPressed = false;
            _this.initializeWriteSecure();
            _this.initializeStates();
            _this.initializeComputeds();
            // Stop here and return if no signalName was configured
            if (!ko.unwrap(_this.signalName)) {
                return null;
            }
            _this.signal = _this.connector.getSignal(_this.signalName);
            _this.initializeSignalArray();
            _this.connector.getOnlineUpdates();
            return _this;
        }
        WfButtonComponent.prototype.initializeStates = function () {
            var _this = this;
            this.states = new VisualStatesService(this.settings);
            this.statusCssClass = this.states.statusCssClass;
            this.tipModeState = ko.computed(function () {
                return _this.isRunning() ? 'shadow-pulse' : '';
            });
        };
        WfButtonComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.buttonText = (ko.unwrap(this.settings.buttonText) || '').stringPlaceholderResolver(this.objectID);
            this.signalPrefix = ko.unwrap(this.settings.signalPrefix) !== undefined ? ko.unwrap(this.settings.signalPrefix) : "";
            this.signalSufix = ko.unwrap(this.settings.signalSufix) !== undefined ? ko.unwrap(this.settings.signalSufix) : "";
            this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
            this.isTipModeEnabled = ko.unwrap(this.settings.isTipModeEnabled) ? ko.unwrap(this.settings.isTipModeEnabled) : false;
            this.minValue = ko.unwrap(this.settings.minValue) !== undefined ? ko.unwrap(this.settings.minValue) : 0;
            this.maxValue = ko.unwrap(this.settings.maxValue) !== undefined ? ko.unwrap(this.settings.maxValue) : 100;
            this.resetOnOverflow = ko.unwrap(this.settings.resetOnOverflow) !== undefined ? ko.unwrap(this.settings.resetOnOverflow) : false;
            this.writeValue = ko.unwrap(this.settings.writeValue) !== undefined ? ko.unwrap(this.settings.writeValue) : 1;
            this.writeUpValue = ko.unwrap(this.settings.writeUpValue) !== undefined ? ko.unwrap(this.settings.writeUpValue) : 0;
            this.writeUpDelay = ko.unwrap(this.settings.writeUpDelay) !== undefined ? ko.unwrap(this.settings.writeUpDelay) : 500;
            this.incrementMode = ko.unwrap(this.settings.incrementMode) !== undefined ? ko.unwrap(this.settings.incrementMode) : false;
            this.cssClass = ko.unwrap(this.settings.cssClass) || 'btn-default';
            this.iconClass = ko.unwrap(this.settings.iconClass) || '';
            this.buttonStyle = (ko.unwrap(this.settings.buttonStyle) || "") + "; -webkit-touch-callout: none !important; -webkit-user-select: none !important; -moz-user-select: none !important; -ms-user-select: none !important; user-select: none !important;";
            this.iconStyle = ko.unwrap(this.settings.iconStyle) || '';
            this.textStyle = ko.unwrap(this.settings.textStyle) || '';
            this.writeToBuffer = ko.unwrap(this.settings.writeToBuffer) !== undefined ? ko.unwrap(this.settings.writeToBuffer) : false;
            this.isBufferedClass = ko.unwrap(this.settings.isBufferedClass) || "btn-info";
            this.initializeWriteItems();
        };
        WfButtonComponent.prototype.initializeWriteItems = function () {
            var e_1, _a;
            this.signalNames = [];
            if (this.signalName)
                this.signalNames.push(this.signalName);
            this.writeItems = ko.unwrap(this.settings.writeItems) || [];
            if (!_.any(this.writeItems))
                return;
            try {
                for (var _b = __values(this.writeItems), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var item = _c.value;
                    item.name = (ko.unwrap(item.name) || '').stringPlaceholderResolver(this.objectID);
                    this.signalNames.push(item.name);
                    item.value = ko.unwrap(item.value) !== undefined ? ko.unwrap(item.value) : 1;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (this.signalName)
                this.writeItems.unshift({ name: this.signalName, value: this.writeValue });
        };
        WfButtonComponent.prototype.initializeWriteSecure = function () {
            this.writeSecure = ko.unwrap(this.settings.writeSecure) !== undefined ? ko.unwrap(this.settings.writeSecure) : false;
            this.writeSecureValues = ko.observable();
            this.showWriteSecure = ko.observable(false);
        };
        WfButtonComponent.prototype.initializeComputeds = function () {
            var _this = this;
            this.isBuffered = ko.computed(function () {
                if (!_this.writeToBuffer)
                    return false;
                return _this.connector.existSignalInBuffer(_this.signalName) && !_this.connector.signalBufferIsEmpty();
            });
            this.displayClassNames = ko.computed(function () {
                return _this.isBuffered() == true ? _this.isBufferedClass : _this.cssClass;
            });
        };
        WfButtonComponent.prototype.initializeSignalArray = function () {
            this.signalArrayService = new SignalArrayService(this.settings, this.signal);
        };
        WfButtonComponent.prototype.writeInputValueSecure = function (values) {
            this.writeSecureValues(values);
            this.showWriteSecure(true);
        };
        WfButtonComponent.prototype.writeInputValue = function (value, isNegative) {
            if (isNegative === void 0) { isNegative = false; }
            return __awaiter(this, void 0, void 0, function () {
                var values, writeValue, result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            values = {};
                            writeValue = ko.unwrap(value);
                            if (writeValue < this.minValue)
                                writeValue = this.incrementMode && this.resetOnOverflow ?
                                    isNegative ? this.maxValue : this.minValue :
                                    this.minValue;
                            if (writeValue > this.maxValue)
                                writeValue = this.incrementMode && this.resetOnOverflow ?
                                    isNegative ? this.maxValue : this.minValue :
                                    this.maxValue;
                            values[this.signalName] = writeValue;
                            if (isNullOrUndefined(this.signalName))
                                return [2 /*return*/];
                            if (this.signalArrayService.isArray) {
                                values[this.signalName] = this.signalArrayService.getWriteValues(values[this.signalName]);
                            }
                            if (!this.writeToBuffer) return [3 /*break*/, 1];
                            this.connector.writeSignalsToBuffer(values);
                            return [3 /*break*/, 5];
                        case 1:
                            if (!this.writeSecure) return [3 /*break*/, 2];
                            this.writeInputValueSecure([values[this.signalName]]);
                            return [3 /*break*/, 5];
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.connector.writeSignals(values)];
                        case 3:
                            result = _a.sent();
                            if (!result.successful) {
                                this.connector.error("Signal write", result.errorMessage);
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            this.connector.handleError(WfButtonComponent)(error_1);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        WfButtonComponent.prototype.writeMultipleInputValue = function () {
            return __awaiter(this, void 0, void 0, function () {
                var values, writeItems, writeItems_1, writeItems_1_1, item, result, error_2;
                var e_2, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            values = {};
                            writeItems = this.writeItems;
                            try {
                                for (writeItems_1 = __values(writeItems), writeItems_1_1 = writeItems_1.next(); !writeItems_1_1.done; writeItems_1_1 = writeItems_1.next()) {
                                    item = writeItems_1_1.value;
                                    values[item.name] = item.value;
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (writeItems_1_1 && !writeItems_1_1.done && (_a = writeItems_1.return)) _a.call(writeItems_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            if (this.resetOnOverflow) {
                                this.connector.warn(WfButtonComponent, "resetOnOverflow is not supported if you define writeItems");
                                return [2 /*return*/];
                            }
                            if (this.incrementMode) {
                                this.connector.warn(WfButtonComponent, "incrementMode is not supported if you define writeItems");
                                return [2 /*return*/];
                            }
                            if (ko.unwrap(this.settings.isArray)) {
                                //  values[this.signalName] = this.signalArrayService.getWriteValues(values[this.signalName]);
                                this.connector.warn(WfButtonComponent, "isArray is not supported if you define writeItems");
                                return [2 /*return*/];
                            }
                            if (!this.writeToBuffer) return [3 /*break*/, 1];
                            this.connector.writeSignalsToBuffer(values);
                            return [3 /*break*/, 5];
                        case 1:
                            if (!this.writeSecure) return [3 /*break*/, 2];
                            this.writeInputValueSecure(writeItems.map(function (x) { return x.value; }));
                            return [3 /*break*/, 5];
                        case 2:
                            _b.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.connector.writeSignals(values)];
                        case 3:
                            result = _b.sent();
                            if (!result.successful) {
                                this.connector.error("Signal write", result.errorMessage);
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            error_2 = _b.sent();
                            this.connector.handleError(WfButtonComponent)(error_2);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        WfButtonComponent.prototype.writeMouseDownValue = function (data, event) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.isDisabled())
                                return [2 /*return*/];
                            this.isPressed = true;
                            event.preventDefault();
                            if (!(!_.any(this.writeItems) && !this.incrementMode)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.writeInputValue(this.writeValue)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 2:
                            if (!this.incrementMode) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.incrementSignal(this.writeValue)];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, this.writeMultipleInputValue()];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6:
                            this.isRunning(true && this.isTipModeEnabled);
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfButtonComponent.prototype.writeMouseUpValue = function (data, event) {
            this.isPressed = false;
            if (this.isDisabled())
                return;
            if (!this.isTipModeEnabled)
                return;
            event.preventDefault();
            this.writeMouseUp();
        };
        WfButtonComponent.prototype.mouseleave = function (data, event) {
            if (this.isDisabled())
                return;
            if (!this.isTipModeEnabled)
                return;
            event.preventDefault();
            if (this.isPressed === true) {
                this.writeMouseUp();
            }
        };
        WfButtonComponent.prototype.writeMouseUp = function () {
            var _this = this;
            this.isPressed = false;
            if (this.incrementMode) {
                _.delay(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        this.incrementSignal(this.writeUpValue);
                        this.isRunning(false);
                        return [2 /*return*/];
                    });
                }); }, this.writeUpDelay);
            }
            else {
                _.delay(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        this.writeInputValue(this.writeUpValue);
                        this.isRunning(false);
                        return [2 /*return*/];
                    });
                }); }, this.writeUpDelay);
            }
        };
        WfButtonComponent.prototype.incrementSignal = function (value) {
            return __awaiter(this, void 0, void 0, function () {
                var signals, valueToWrite, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.signalName)
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.connector.readSignals([this.signalName])];
                        case 2:
                            signals = _a.sent();
                            if (signals[0].Result === 0 || signals) {
                                valueToWrite = signals[0].Value + (value);
                                this.writeInputValue(valueToWrite, value < 0);
                            }
                            else {
                                this.connector.warn(this, signals[0].Result.toString());
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_3 = _a.sent();
                            this.connector.handleError(WfButtonComponent)(error_3);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfButtonComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            this.states.unregisterSignals();
                            if (!this.signal)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.connector.unregisterSignals(this.signal)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfButtonComponent;
    }(ComponentBaseModel));
    return WfButtonComponent;
});
//# sourceMappingURL=wf-button.component.js.map