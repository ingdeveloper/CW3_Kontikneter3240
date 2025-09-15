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
define(["require", "exports", "../services/value-conversions.service", "../component-base.model", "../services/signal-array.service", "../services/visual-states.service"], function (require, exports, ValueConversionsService, ComponentBaseModel, SignalArrayService, VisualStatesService) {
    "use strict";
    var WfBargraphComponent = /** @class */ (function (_super) {
        __extends(WfBargraphComponent, _super);
        function WfBargraphComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.signal = _this.connector.getSignal(_this.signalName);
            _this.initializeSignalArray();
            if (_this.signalArrayService.isArray) {
                _this.currentSignalValue = _this.signalArrayService.signalValue;
            }
            else {
                _this.currentSignalValue = _this.signal.value;
            }
            // The formated value will is used for value display
            _this.formattedSignalValue = _this.currentSignalValue.extend({
                numeralNumber: _this.format
            });
            _this.initializeComputeds();
            _this.initializeStates();
            //this.initializeChangedFieldAnimation();
            _this.connector.getOnlineUpdates();
            return _this;
        }
        WfBargraphComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.valueConversionsService = new ValueConversionsService();
            this.maxValueVioliation = ko.observable(false);
            this.minValueVioliation = ko.observable(false);
            this.width = ko.unwrap(this.settings.width) || "100%";
            this.height = ko.unwrap(this.settings.height) + 'px' || "";
            this.orientation = ko.unwrap(this.settings.orientation) || "horizontal left";
            this.progressBarSize = ko.unwrap(this.settings.progressBarSize) || "";
            this.settings.cssClassNormalState = ko.unwrap(this.settings.cssClass) || null;
            this.iconClass = ko.unwrap(this.settings.iconClass) || "";
            this.titleText = (ko.unwrap(this.settings.titleText) || "").stringPlaceholderResolver(this.objectID);
            this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[00]";
            this.maxRange = ko.unwrap(this.settings.maxRange) || 100;
            this.minRange = ko.unwrap(this.settings.minRange) || 0;
            this.showTickLabels = ko.observable(ko.unwrap(this.settings.showTickLabels) !== undefined ? ko.unwrap(this.settings.showTickLabels) : false);
            this.unitLabel = ko.observable(ko.unwrap(this.settings.unitLabel) !== undefined ? ko.unwrap(this.settings.unitLabel) : true);
            this.valueLabel = ko.observable(ko.unwrap(this.settings.valueLabel) !== undefined ? ko.unwrap(this.settings.valueLabel) : true);
            this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
            this.formattedSignalValue = '';
            this.currentSignalValue = ko.observable();
        };
        WfBargraphComponent.prototype.initializeComputeds = function () {
            var _this = this;
            this.axisOrientation = ko.computed(function () {
                return _this.orientation.indexOf("horizontal") !== -1 ? "bottom" : "right";
            }, this);
            this.revertAxis = ko.computed(function () {
                return _this.orientation.indexOf("right") !== -1 || _this.orientation.indexOf("top") !== -1;
            }, this);
            this.isVertical = ko.computed(function () {
                return !(_this.orientation.indexOf("horizontal") !== -1);
            }, this);
            this.maxRangeSignalName = ko.unwrap(this.settings.maxRangeSignalName) ? ko.unwrap(this.settings.maxRangeSignalName) : null;
            if (this.maxRangeSignalName)
                this.maxRangeSignal = this.connector.getSignal(this.maxRangeSignalName);
            this.minRangeSignalName = ko.unwrap(this.settings.minRangeSignalName) ? ko.unwrap(this.settings.minRangeSignalName) : null;
            if (this.minRangeSignalName)
                this.minRangeSignal = this.connector.getSignal(this.minRangeSignalName);
            this.maxRangeValue = ko.computed(function () {
                return _this.maxRangeSignal ? _.isNumber(_this.maxRangeSignal.value()) ? _this.maxRangeSignal.value() : _this.maxRange : _this.maxRange;
            });
            this.maxRangeValueFormated = this.maxRangeValue.extend({
                numeralNumber: this.format
            });
            this.minRangeValue = ko.computed(function () {
                return _this.minRangeSignal ? _.isNumber(_this.minRangeSignal.value()) ? _this.minRangeSignal.value() : _this.minRange : _this.minRange;
            });
            this.minRangeValueFormated = this.minRangeValue.extend({
                numeralNumber: this.format
            });
            this.midRangeValue = ko.computed(function () {
                return (_this.maxRangeValue() + _this.minRangeValue()) / 2;
            });
            this.midRangeValueFormated = this.midRangeValue.extend({
                numeralNumber: this.format
            });
            this.progressValue = ko.computed(function () {
                var signalValue = _this.currentSignalValue();
                // Prevent the width of progressbar to be out of range 0 - 100%
                if (signalValue > _this.maxRangeValue()) {
                    _this.maxValueVioliation(true);
                    _this.minValueVioliation(false);
                    return "100%";
                }
                else if (signalValue < _this.minRangeValue()) {
                    _this.minValueVioliation(true);
                    _this.maxValueVioliation(false);
                    return "0%";
                }
                _this.maxValueVioliation(false);
                _this.minValueVioliation(false);
                // Calculate the width in a linear conversion to 0 - 100%
                var progressWidth = _this.valueConversionsService.linearScale(_this.currentSignalValue(), _this.minRangeValue(), _this.maxRangeValue(), 0, 100);
                return progressWidth + "%";
            });
        };
        WfBargraphComponent.prototype.initializeSignalArray = function () {
            this.signalArrayService = new SignalArrayService(this.settings, this.signal);
        };
        WfBargraphComponent.prototype.initializeStates = function () {
            this.states = new VisualStatesService(this.settings);
            this.statusCssClass = this.states.statusCssClass;
        };
        //private initializeChangedFieldAnimation() {
        //    this.changedFieldAnimationService = new ChangedFieldAnimationService(this.settings, this.currentSignalValue as KnockoutObservable<any>, this.cssDisplayClass);
        //    this.cssClass = ko.computed(() => {
        //        return this.changedFieldAnimationService ? this.changedFieldAnimationService.cssClass() || "" : "";
        //    });
        //}
        WfBargraphComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.states.unregisterSignals()];
                        case 2:
                            _a.sent();
                            if (this.visualSecurityService)
                                this.visualSecurityService.dispose();
                            if (!this.maxRangeSignal) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.connector.unregisterSignals(this.maxRangeSignal)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            if (!this.minRangeSignal) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.connector.unregisterSignals(this.minRangeSignal)];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6:
                            if (!this.signal)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.connector.unregisterSignals(this.signal)];
                        case 7:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfBargraphComponent;
    }(ComponentBaseModel));
    return WfBargraphComponent;
});
//# sourceMappingURL=wf-bargraph.component.js.map