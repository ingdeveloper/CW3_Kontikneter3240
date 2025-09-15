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
define(["require", "exports", "../services/visual-states.service", "../component-base.model"], function (require, exports, VisualStatesService, ComponentBaseModel) {
    "use strict";
    var WfToggleButtonComponent = /** @class */ (function (_super) {
        __extends(WfToggleButtonComponent, _super);
        function WfToggleButtonComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.initializeWriteSecure();
            _this.initializeStates();
            _this.initializeComputeds();
            // Stop here and return if no signalName was configured
            if (!ko.unwrap(_this.signalName)) {
                return null;
            }
            _this.connector.getOnlineUpdates();
            return _this;
        }
        WfToggleButtonComponent.prototype.initializeStates = function () {
            this.states = new VisualStatesService(this.settings);
            this.statusCssClass = this.states.statusCssClass;
        };
        WfToggleButtonComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.buttonText = (ko.unwrap(this.settings.buttonText) || '').stringPlaceholderResolver(this.objectID);
            this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
            this.toggleValue1 = ko.unwrap(this.settings.toggleValue1) !== undefined ? ko.unwrap(this.settings.toggleValue1) : 0;
            this.toggleValue2 = ko.unwrap(this.settings.toggleValue2) !== undefined ? ko.unwrap(this.settings.toggleValue2) : 1;
            this.cssClass = ko.unwrap(this.settings.cssClass) || 'btn-default';
            this.iconClass = ko.unwrap(this.settings.iconClass) || '';
            this.buttonStyle = ko.unwrap(this.settings.buttonStyle) || '';
            this.iconStyle = ko.unwrap(this.settings.iconStyle) || '';
            this.textStyle = ko.unwrap(this.settings.textStyle) || '';
            this.writeToBuffer = ko.unwrap(this.settings.writeToBuffer) !== undefined ? ko.unwrap(this.settings.writeToBuffer) : false;
            this.isBufferedClass = ko.unwrap(this.settings.isBufferedClass) || "btn-info";
        };
        WfToggleButtonComponent.prototype.initializeComputeds = function () {
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
        WfToggleButtonComponent.prototype.initializeWriteSecure = function () {
            this.writeSecure = ko.unwrap(this.settings.writeSecure) !== undefined ? ko.unwrap(this.settings.writeSecure) : false;
            this.writeSecureValues = ko.observable();
            this.showWriteSecure = ko.observable(false);
        };
        WfToggleButtonComponent.prototype.writeInputValueSecure = function (value) {
            this.writeSecureValues([value]);
            this.showWriteSecure(true);
        };
        WfToggleButtonComponent.prototype.writeInputValue = function (value, isNegative) {
            if (isNegative === void 0) { isNegative = false; }
            return __awaiter(this, void 0, void 0, function () {
                var values, result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.isDisabled())
                                return [2 /*return*/];
                            values = {};
                            values[this.signalName] = ko.unwrap(value);
                            if (isNullOrUndefined(this.signalName))
                                return [2 /*return*/];
                            if (!this.writeToBuffer) return [3 /*break*/, 1];
                            this.connector.writeSignalsToBuffer(values);
                            return [3 /*break*/, 5];
                        case 1:
                            if (!this.writeSecure) return [3 /*break*/, 2];
                            this.writeInputValueSecure(values[this.signalName]);
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
                            this.connector.handleError(WfToggleButtonComponent)(error_1);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        WfToggleButtonComponent.prototype.toggleSignal = function () {
            return __awaiter(this, void 0, void 0, function () {
                var signals, valueToWrite, signals_1, valueToWrite, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.signalName)
                                return [2 /*return*/];
                            if (!this.isBuffered()) return [3 /*break*/, 1];
                            signals = this.connector.readSignalsFromBuffer([this.signalName]);
                            valueToWrite = signals[0] == this.toggleValue1 || signals.length === 0 ? this.toggleValue2 : this.toggleValue1;
                            this.writeInputValue(valueToWrite);
                            return [3 /*break*/, 4];
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.connector.readSignals([this.signalName])];
                        case 2:
                            signals_1 = _a.sent();
                            if (signals_1[0].Result === 0 || signals_1) {
                                valueToWrite = signals_1[0].Value == this.toggleValue1 ? this.toggleValue2 : this.toggleValue1;
                                this.writeInputValue(valueToWrite);
                            }
                            else {
                                this.connector.warn(this, signals_1[0].Result.toString());
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            this.connector.handleError(WfToggleButtonComponent)(error_2);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfToggleButtonComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.states.unregisterSignals()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfToggleButtonComponent;
    }(ComponentBaseModel));
    return WfToggleButtonComponent;
});
//# sourceMappingURL=wf-toggle-button.component.js.map