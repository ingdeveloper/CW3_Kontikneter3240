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
define(["require", "exports", "../component-base.model", "../services/changed-field-animation.service", "../services/signal-array.service", "../services/pending-changed-animation.service"], function (require, exports, ComponentBaseModel, ChangedFieldAnimationService, SignalArrayService, PendingChangedAnimationService) {
    "use strict";
    var WfInputComponent = /** @class */ (function (_super) {
        __extends(WfInputComponent, _super);
        function WfInputComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.inputSignal = _this.connector.getSignal(ko.unwrap(_this.signalName));
            _this.initializeSignalArray();
            _this.initializeWriteSecure();
            _this.initializeComputeds();
            _this.initializeAnimationServices();
            _this.connector.getOnlineUpdates();
            return _this;
        }
        WfInputComponent.prototype.formatNumber = function (current, format) {
            var numeralFormat = format || "0,0.00";
            var newValueAsNum = isNaN(current) || current === null || typeof (current) === "undefined" ? "NaN" : parseFloat(current);
            if (newValueAsNum !== "NaN") {
                return numeral(newValueAsNum).format(numeralFormat);
            }
            return newValueAsNum;
        };
        WfInputComponent.prototype.initializeAnimationServices = function () {
            var _this = this;
            this.changedFieldAnimationService = new ChangedFieldAnimationService(this.settings, this.signalValue, this.displayClassNames);
            this.pendingChangedAnimationService = new PendingChangedAnimationService(this.settings, this.inputSignal, this.displayClassNames);
            this.cssClass = ko.computed(function () {
                var changedFieldAnimation = _this.changedFieldAnimationService ? _this.changedFieldAnimationService.cssClass() || "" : "";
                var pendingChangedAnimation = _this.pendingChangedAnimationService ? _this.pendingChangedAnimationService.cssClass() || "" : "";
                return changedFieldAnimation + " " + pendingChangedAnimation;
            });
        };
        WfInputComponent.prototype.initializeWriteSecure = function () {
            this.writeSecure = ko.unwrap(this.settings.writeSecure) !== undefined ? ko.unwrap(this.settings.writeSecure) : false;
            this.writeSecureValues = ko.observable();
            this.showWriteSecure = ko.observable(false);
        };
        WfInputComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[000]";
            this.isAlphanumeric = ko.unwrap(this.settings.isAlphanumeric) !== undefined ? ko.unwrap(this.settings.isAlphanumeric) : false;
            this.iconClass = ko.unwrap(this.settings.iconClass) || null;
            this.displayClass = ko.unwrap(this.settings.displayClass) || null;
            this.isBufferedClass = ko.unwrap(this.settings.isBufferedClass) || "label-info";
            this.inputSize = ko.unwrap(this.settings.inputSize) ? "input-group-" + ko.unwrap(this.settings.inputSize) : "";
            this.label = (ko.unwrap(this.settings.label) || '').stringPlaceholderResolver(this.objectID);
            this.signalNameLabel = ko.unwrap(this.settings.signalNameLabel) !== undefined ? ko.unwrap(this.settings.signalNameLabel) : false;
            this.unitLabel = ko.unwrap(this.settings.unitLabel) !== undefined ? ko.unwrap(this.settings.unitLabel) : false;
            this.staticUnitText = (ko.unwrap(this.settings.staticUnitText) || '').stringPlaceholderResolver(this.objectID);
            this.iconStyle = ko.unwrap(this.settings.iconStyle) || '';
            this.textStyle = ko.unwrap(this.settings.textStyle) || '';
            this.popoverPosition = ko.unwrap(this.settings.popoverPosition) || 'top';
            this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
            this.uncommittedValue = ko.observable();
            this.signalValue = null;
            this.isEditing = ko.observable(false);
            this.isSelected = ko.observable(false);
            this.writeToBuffer = ko.unwrap(this.settings.writeToBuffer) !== undefined ? ko.unwrap(this.settings.writeToBuffer) : false;
            this.virtualKeyboardType = ko.observable(this.isAlphanumeric ? 'num' : 'alpha');
            this.autoDetectType = this.settings.autoDetectType || false;
        };
        WfInputComponent.prototype.initializeComputeds = function () {
            var _this = this;
            if (this.inputSignal) {
                this.inputSignalValue = ko.computed(function () {
                    _this.detectType(_this.inputSignal.value());
                    if (_this.signalArrayService.isArray) {
                        return _this.signalArrayService.signalValue();
                    }
                    else if (_this.isAlphanumeric) {
                        return _this.inputSignal.value();
                    }
                    else {
                        return _this.formatNumber(_this.inputSignal.value(), _this.format);
                    }
                });
            }
            this.isBuffered = ko.computed(function () {
                if (!_this.writeToBuffer)
                    return false;
                return _this.connector.existSignalInBuffer(_this.signalName) && !_this.connector.signalBufferIsEmpty();
            });
            this.displayClassNames = ko.computed(function () {
                return _this.isBuffered() == true ? _this.isBufferedClass : _this.displayClass;
            });
            this.signalValue = ko.computed({
                read: function () {
                    if (!_this.isEditing() && !_this.isBuffered() && !_this.showWriteSecure()) {
                        return ko.unwrap(_this.inputSignalValue);
                    }
                    else if (!_this.isEditing() && _this.isBuffered()) {
                        var value = _this.connector.readSignalsFromBuffer([_this.signalName]);
                        return value.length > 0 ? value[0] : null;
                    }
                    else if (!_this.isEditing() && _this.isBuffered()) {
                        var value = _this.connector.readSignalsFromBuffer([_this.signalName]);
                        return value.length > 0 ? value[0] : null;
                    }
                    else {
                        return ko.unwrap(_this.uncommittedValue);
                    }
                },
                write: function (value) {
                    _this.uncommittedValue(value);
                    _this.isEditing(true);
                    _this.pendingChangedAnimationService.onValueChangeRequested();
                }
            });
        };
        WfInputComponent.prototype.initializeSignalArray = function () {
            this.signalArrayService = new SignalArrayService(this.settings, this.inputSignal);
        };
        WfInputComponent.prototype.writeInputValueSecure = function (value) {
            this.isEditing(false);
            this.writeSecureValues([value]);
            this.showWriteSecure(true);
        };
        WfInputComponent.prototype.cancelWriteSecure = function () {
            this.isEditing(true);
        };
        WfInputComponent.prototype.successWriteSecure = function () {
            this.pendingChangedAnimationService.onValueChangeRequested();
        };
        WfInputComponent.prototype.writeInputValue = function () {
            return __awaiter(this, void 0, void 0, function () {
                var values, unwrapedValue, value, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.isDisabled())
                                return [2 /*return*/];
                            values = {};
                            if (!this.signalName)
                                return [2 /*return*/];
                            unwrapedValue = ko.unwrap(this.uncommittedValue);
                            this.detectType(unwrapedValue);
                            value = this.isAlphanumeric ? unwrapedValue : numeral(unwrapedValue).value();
                            values[this.signalName] = value;
                            if (this.signalArrayService.isArray) {
                                values[this.signalName] = this.signalArrayService.getWriteValues(values[this.signalName]);
                            }
                            if (!this.writeToBuffer) return [3 /*break*/, 1];
                            this.connector.writeSignalsToBuffer(values);
                            this.isEditing(false);
                            return [3 /*break*/, 4];
                        case 1:
                            if (!this.writeSecure) return [3 /*break*/, 2];
                            this.writeInputValueSecure(values[this.signalName]);
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.connector.writeSignals(values)
                            // Write signal values, warning if an error will be returned
                        ];
                        case 3:
                            result = _a.sent();
                            // Write signal values, warning if an error will be returned
                            this.isEditing(false);
                            if (!result.successful) {
                                this.connector.error("Signal write", result.errorMessage);
                            }
                            else {
                                this.pendingChangedAnimationService.onValueChangeRequested();
                            }
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfInputComponent.prototype.resetInputValue = function () {
            this.isEditing(false);
            this.pendingChangedAnimationService.onValueChangeCanceled();
        };
        WfInputComponent.prototype.keyupEventHandler = function (data, event) {
            if (event.which === 13) {
                this.writeInputValue();
            }
        };
        WfInputComponent.prototype.detectType = function (value) {
            if (!this.autoDetectType)
                return;
            if (!this.signalArrayService.isArray) {
                this.isAlphanumeric = !$.isNumeric(value);
                this.virtualKeyboardType(this.isAlphanumeric ? 'num' : 'alpha');
            }
        };
        /**
         *  Place here signal cleanup functionality.
         *
         * @protected
         * @returns
         *
         * @memberOf WfInputComponent
         */
        WfInputComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            this.changedFieldAnimationService.dispose();
                            this.pendingChangedAnimationService.dispose();
                            if (!this.inputSignal)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.connector.unregisterSignals(this.inputSignal)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfInputComponent;
    }(ComponentBaseModel));
    return WfInputComponent;
});
//# sourceMappingURL=wf-input.component.js.map