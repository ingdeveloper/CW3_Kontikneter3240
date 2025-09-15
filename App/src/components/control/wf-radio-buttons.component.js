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
define(["require", "exports", "../component-base.model", "../services/signal-array.service"], function (require, exports, ComponentBaseModel, SignalArrayService) {
    "use strict";
    var WfRadioButtonsComponent = /** @class */ (function (_super) {
        __extends(WfRadioButtonsComponent, _super);
        function WfRadioButtonsComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.checkedValue = ko.observable();
            _this.initializeWriteSecure();
            if (!ko.unwrap(_this.signalName))
                return _this;
            _this.inputSignal = _this.connector.getSignal(ko.unwrap(_this.signalName));
            _this.initializeSignalArray();
            if (_this.inputSignal) {
                if (_this.signalArrayService.isArray) {
                    _this.inputSignalValue = _this.signalArrayService.signalValue;
                }
                else {
                    _this.inputSignalValue = _this.inputSignal.value;
                }
                _this.checkedValue(_this.inputSignalValue().toString());
                _this.inputSignalValue.subscribe(_this.setCheckedValue());
            }
            _this.initializeComputeds();
            _this.connector.getOnlineUpdates();
            _this.checkedValue.subscribe(function (value) {
                if (value === _this.inputSignalValue().toString())
                    return;
                _this.writeSignalValue(value);
            });
            return _this;
        }
        WfRadioButtonsComponent.prototype.setCheckedValue = function () {
            var _this = this;
            return function (newValue) {
                if (_this.isBuffered())
                    return;
                var value = newValue !== null && newValue !== undefined ? newValue.toString() : newValue;
                _this.checkedValue(value);
            };
        };
        WfRadioButtonsComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.options = this.settings.options || [];
            this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
            this.groupName = (ko.unwrap(this.settings.groupName) !== undefined ? (ko.unwrap(this.settings.groupName) || '').stringPlaceholderResolver(this.objectID) : this.signalName) + ko.unwrap(this.id);
            this.showInline = ko.unwrap(this.settings.showInline) !== undefined ? ko.unwrap(this.settings.showInline) : false;
            this.writeToBuffer = ko.unwrap(this.settings.writeToBuffer) !== undefined ? ko.unwrap(this.settings.writeToBuffer) : false;
            this.isBufferedClass = ko.unwrap(this.settings.isBufferedClass) || "text-info";
            this.extendOptions();
        };
        WfRadioButtonsComponent.prototype.initializeComputeds = function () {
            var _this = this;
            this.isBuffered = ko.computed(function () {
                if (!_this.writeToBuffer)
                    return false;
                return _this.connector.existSignalInBuffer(_this.signalName) && !_this.connector.signalBufferIsEmpty();
            });
            this.displayClassNames = ko.computed(function () {
                return _this.isBuffered() == true ? _this.isBufferedClass : "";
                ;
            });
        };
        WfRadioButtonsComponent.prototype.initializeWriteSecure = function () {
            this.writeSecure = ko.unwrap(this.settings.writeSecure) !== undefined ? ko.unwrap(this.settings.writeSecure) : false;
            this.writeSecureValues = ko.observable();
            this.writeSecureSignalName = ko.observable();
            this.showWriteSecure = ko.observable(false);
        };
        WfRadioButtonsComponent.prototype.initializeSignalArray = function () {
            this.signalArrayService = new SignalArrayService(this.settings, this.inputSignal);
        };
        WfRadioButtonsComponent.prototype.writeSignalValue = function (value) {
            return __awaiter(this, void 0, void 0, function () {
                var values, item;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.isDisabled())
                                return [2 /*return*/];
                            values = {};
                            item = this.options.find(function (option) { return option.signalValue === value; });
                            if (!ko.unwrap(this.signalName) || !item || item.writeValue === undefined)
                                return [2 /*return*/];
                            values[this.signalName] = ko.unwrap(item.writeValue);
                            if (this.signalArrayService.isArray) {
                                values[this.signalName] = this.signalArrayService.getWriteValues(values[this.signalName]);
                            }
                            if (!this.writeToBuffer) return [3 /*break*/, 1];
                            this.connector.writeSignalsToBuffer(values);
                            return [3 /*break*/, 4];
                        case 1:
                            if (!this.writeSecure) return [3 /*break*/, 2];
                            this.writeInputValueSecure(this.signalName, values[this.signalName]);
                            return [3 /*break*/, 4];
                        case 2: 
                        // Write signal values, warning if an error will be returned
                        return [4 /*yield*/, this.connector.writeSignals(values)];
                        case 3:
                            // Write signal values, warning if an error will be returned
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfRadioButtonsComponent.prototype.writeInputValueSecure = function (signalName, value) {
            this.writeSecureValues([value]);
            this.writeSecureSignalName(signalName);
            this.showWriteSecure(true);
        };
        WfRadioButtonsComponent.prototype.setCurrentSignalValue = function () {
            this.checkedValue(this.inputSignalValue());
        };
        WfRadioButtonsComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
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
        WfRadioButtonsComponent.prototype.extendOptions = function () {
            var e_1, _a;
            try {
                for (var _b = __values(this.options), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var option = _c.value;
                    option.writeValue = option.signalValue;
                    option.signalValue = option.signalValue !== null && option.signalValue !== undefined ? option.signalValue.toString() : option.signalValue;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        return WfRadioButtonsComponent;
    }(ComponentBaseModel));
    return WfRadioButtonsComponent;
});
//# sourceMappingURL=wf-radio-buttons.component.js.map