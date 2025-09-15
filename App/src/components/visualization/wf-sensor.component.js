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
define(["require", "exports", "../services/visual-states.service", "../services/changed-field-animation.service", "../component-base.model", "../services/signal-array.service"], function (require, exports, VisualStatesService, ChangedFieldAnimationService, ComponentBaseModel, SignalArrayService) {
    "use strict";
    var WfSensorComponent = /** @class */ (function (_super) {
        __extends(WfSensorComponent, _super);
        function WfSensorComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.initializeStates();
            if (_this.signalName)
                _this.signal = _this.connector.getSignal(ko.unwrap(_this.signalName));
            if (_this.setpointSignalName)
                _this.setpointSignal = _this.connector.getSignal(ko.unwrap(_this.setpointSignalName));
            _this.initializeSignalArray();
            if (_this.signalName) {
                if (_this.signalArrayService.isArray) {
                    _this.signalValue = _this.signalArrayService.signalValue;
                }
                else {
                    _this.signalValue = _this.signal.value.extend({ numeralNumber: _this.format });
                }
            }
            if (_this.setpointSignalName) {
                if (_this.signalArraySetpointService.isArray) {
                    _this.setpointSignalValue = _this.signalArraySetpointService.signalValue;
                }
                else {
                    _this.setpointSignalValue = _this.setpointSignal.value.extend({ numeralNumber: _this.format });
                }
            }
            _this.initializeChangedFieldAnimation();
            _this.connector.getOnlineUpdates();
            return _this;
        }
        WfSensorComponent.prototype.initializeStates = function () {
            this.states = new VisualStatesService(this.settings);
            this.statusCssClass = this.states.statusCssClass;
        };
        WfSensorComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.valueLabelPosition = ko.unwrap(this.settings.valueLabelPosition) || "right";
            this.sensorShape = ko.unwrap(this.settings.sensorShape) || "circle"; // square
            this.tooltipText = (ko.unwrap(this.connector.translate(this.settings.tooltipText)()) || "").stringPlaceholderResolver(this.objectID);
            this.signalName = (ko.unwrap(this.settings.signalName) || "").stringPlaceholderResolver(this.objectID);
            this.setpointSignalName = (ko.unwrap(this.settings.setpointSignalName) || "").stringPlaceholderResolver(this.objectID);
            this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[00]";
            this.staticUnitText = (ko.unwrap(this.settings.staticUnitText) || "").stringPlaceholderResolver(this.objectID);
            this.sensorText = (ko.unwrap(this.settings.sensorText) || "T").stringPlaceholderResolver(this.objectID);
            this.unitLabel = ko.unwrap(this.settings.unitLabel) !== undefined ? ko.unwrap(this.settings.unitLabel) : true;
            this.pointerLength = ko.unwrap(this.settings.pointerLength) !== undefined ? ko.unwrap(this.settings.pointerLength) : 20;
            this.pointerRotation = ko.unwrap(this.settings.pointerRotation) || 0;
        };
        WfSensorComponent.prototype.initializeChangedFieldAnimation = function () {
            var _this = this;
            this.settings.additionalCssForAnimation = 'wf-sensor-value-' + this.valueLabelPosition;
            if (this.signalName) {
                this.changedFieldAnimationService = new ChangedFieldAnimationService(this.settings, this.signalValue, 'wf-sensor-value-' + this.valueLabelPosition);
            }
            if (this.setpointSignalName) {
                this.changedFieldAnimationServiceSetpoint = new ChangedFieldAnimationService(this.settings, this.setpointSignalValue, 'wf-sensor-value-' + this.valueLabelPosition);
            }
            this.cssClass = ko.computed(function () {
                return (_this.signalName ? _this.changedFieldAnimationService.cssClass() || "" : "") + " " + (_this.setpointSignalName ? _this.changedFieldAnimationServiceSetpoint.cssClass() || "" : "");
            });
        };
        WfSensorComponent.prototype.initializeSignalArray = function () {
            this.signalArrayService = new SignalArrayService(this.settings, this.signal);
            this.signalArraySetpointService = new SignalArrayService(this.settings, this.setpointSignal);
        };
        WfSensorComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.changedFieldAnimationService) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.changedFieldAnimationService.dispose()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            if (!this.changedFieldAnimationServiceSetpoint) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.changedFieldAnimationServiceSetpoint.dispose()];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 5:
                            _a.sent();
                            if (!!this.signal) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.connector.unregisterSignals(this.signal)];
                        case 6:
                            _a.sent();
                            _a.label = 7;
                        case 7:
                            if (!!this.setpointSignal) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.connector.unregisterSignals(this.setpointSignal)];
                        case 8:
                            _a.sent();
                            _a.label = 9;
                        case 9: return [4 /*yield*/, this.states.unregisterSignals()];
                        case 10:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfSensorComponent;
    }(ComponentBaseModel));
    return WfSensorComponent;
});
//# sourceMappingURL=wf-sensor.component.js.map