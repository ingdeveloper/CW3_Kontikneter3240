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
define(["require", "exports", "../component-base.model", "../services/changed-field-animation.service"], function (require, exports, ComponentBaseModel, ChangedFieldAnimationService) {
    "use strict";
    var WfDateTimePickerComponent = /** @class */ (function (_super) {
        __extends(WfDateTimePickerComponent, _super);
        function WfDateTimePickerComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.connector.getOnlineUpdates();
            _this.initializeWriteSecure();
            _this.initializeComputeds();
            _this.initializeChangedFieldAnimation();
            return _this;
        }
        WfDateTimePickerComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "";
            this.isUTC = ko.unwrap(this.settings.isUTC) !== undefined ? ko.unwrap(this.settings.isUTC) : false;
            this.writeUnix = ko.unwrap(this.settings.isUnix) !== undefined ? ko.unwrap(this.settings.writeUnix) : false;
            this.minDate = ko.unwrap(this.settings.minDate);
            this.maxDate = ko.unwrap(this.settings.maxDate);
            this.showClear = ko.unwrap(this.settings.showClear) !== undefined ? ko.unwrap(this.settings.showClear) : true;
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
            this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
            this.uncommittedValue = ko.observable(null);
            this.autoCommit = ko.unwrap(this.settings.autoCommit) !== undefined ? ko.unwrap(this.settings.autoCommit) : false;
            this.isEditing = ko.observable(false);
            this.isSelected = ko.observable(false);
            this.inputSignal = this.connector.getSignal(ko.unwrap(this.signalName));
            this.writeToBuffer = ko.unwrap(this.settings.writeToBuffer) !== undefined ? ko.unwrap(this.settings.writeToBuffer) : false;
        };
        WfDateTimePickerComponent.prototype.initializeChangedFieldAnimation = function () {
            var _this = this;
            this.changedFieldAnimationService = new ChangedFieldAnimationService(this.settings, this.signalValue, this.displayClassNames);
            this.cssClass = ko.computed(function () {
                return _this.changedFieldAnimationService ? _this.changedFieldAnimationService.cssClass() || "" : "";
            });
        };
        WfDateTimePickerComponent.prototype.initializeWriteSecure = function () {
            this.writeSecure = ko.unwrap(this.settings.writeSecure) !== undefined ? ko.unwrap(this.settings.writeSecure) : false;
            this.writeSecureValues = ko.observable();
            this.showWriteSecure = ko.observable(false);
        };
        WfDateTimePickerComponent.prototype.initializeComputeds = function () {
            var _this = this;
            this.isBuffered = ko.computed(function () {
                if (!_this.writeToBuffer)
                    return false;
                return _this.connector.existSignalInBuffer(_this.signalName) && !_this.connector.signalBufferIsEmpty();
            }, this);
            this.displayClassNames = ko.computed(function () {
                return _this.isBuffered() ? _this.isBufferedClass : _this.displayClass;
            }, this);
            this.inputSignalValue = ko.computed(function () {
                var inputSignalValue = ko.unwrap(_this.inputSignal.value);
                if (inputSignalValue != null && _this.inputSignal.value != null) {
                    if (_this.isUTC) {
                        var utcDate = _this.format != null && _this.format != "" ? moment.utc(inputSignalValue, _this.format) : moment.utc(inputSignalValue);
                        return utcDate;
                    }
                    else {
                        var date = _this.format != null && _this.format != "" ? moment(inputSignalValue, _this.format) : moment(inputSignalValue);
                        return date;
                    }
                }
                return null;
            });
            this.signalValue = ko.computed({
                read: function () {
                    if (_this.autoCommit)
                        return ko.unwrap(_this.inputSignalValue);
                    if (!_this.isEditing() && !_this.isBuffered() && !_this.showWriteSecure()) {
                        return ko.unwrap(_this.inputSignalValue);
                    }
                    else if (!_this.isEditing() && _this.isBuffered()) {
                        var value = _this.connector.readSignalsFromBuffer([_this.signalName]);
                        return value.length > 0 ? _this.format != null && _this.format != "" ? moment(value[0], _this.format) : moment(value[0]) : null;
                    }
                    else {
                        return _this.format != null && _this.format != "" ? moment(ko.unwrap(_this.uncommittedValue), _this.format) : moment(ko.unwrap(_this.uncommittedValue));
                    }
                },
                write: function (value) {
                    _this.uncommittedValue(value);
                    if (_this.autoCommit) {
                        _this.writeInputValue();
                        return;
                    }
                    if (_this.uncommittedValue() !== _this.inputSignalValue())
                        _this.isEditing(true);
                }
            });
            this.datepickerOptions = ko.computed(function () {
                return {
                    locale: _this.connector.getGenericCulture(ko.unwrap(_this.connector.currentLanguageId)),
                    format: _this.format,
                    minDate: _this.minDate,
                    maxDate: _this.maxDate,
                    showClear: _this.showClear
                };
            });
        };
        WfDateTimePickerComponent.prototype.writeInputValue = function () {
            return __awaiter(this, void 0, void 0, function () {
                var values, value, uncommittedValue, date, formatedDate, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.isDisabled())
                                return [2 /*return*/];
                            values = {};
                            if (!this.signalName)
                                return [2 /*return*/];
                            value = null;
                            uncommittedValue = ko.unwrap(this.uncommittedValue);
                            if (uncommittedValue) {
                                date = moment(uncommittedValue);
                                formatedDate = date.format(this.format);
                                value = this.writeUnix ? date.valueOf() : formatedDate;
                            }
                            values[this.signalName] = value;
                            if (this.writeToBuffer) {
                                this.connector.writeSignalsToBuffer(values);
                                this.isEditing(false);
                            }
                            if (!this.writeSecure) return [3 /*break*/, 1];
                            this.writeInputValueSecure(value);
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, this.connector.writeSignals(values)];
                        case 2:
                            result = _a.sent();
                            this.isEditing(false);
                            if (!result.successful) {
                                this.connector.error("Signal write", result.errorMessage);
                            }
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfDateTimePickerComponent.prototype.resetInputValue = function () {
            this.isEditing(false);
        };
        WfDateTimePickerComponent.prototype.writeInputValueSecure = function (value) {
            this.isEditing(false);
            this.writeSecureValues([value]);
            this.showWriteSecure(true);
        };
        WfDateTimePickerComponent.prototype.cancelWriteSecure = function () {
            this.isEditing(true);
        };
        WfDateTimePickerComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            if (this.visualSecurityService)
                                this.visualSecurityService.dispose();
                            this.changedFieldAnimationService.dispose();
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
        return WfDateTimePickerComponent;
    }(ComponentBaseModel));
    return WfDateTimePickerComponent;
});
//# sourceMappingURL=wf-date-time-picker.component.js.map