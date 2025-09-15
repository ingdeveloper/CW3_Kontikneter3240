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
define(["require", "exports", "../component-base.model", "../services/visual-states.service", "../services/signal-array.service"], function (require, exports, ComponentBaseModel, VisualStatesService, SignalArrayService) {
    "use strict";
    // Component properties
    var WfSvgPathComponent = /** @class */ (function (_super) {
        __extends(WfSvgPathComponent, _super);
        function WfSvgPathComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.height = null;
            _this.width = null;
            _this.shouldNavigateToUrl = ko.pureComputed(function () {
                if (!_this.navigationUrl)
                    return false;
                var indexOfParamsSeparator = _this.navigationUrl.indexOf("?");
                var result = _this.navigationUrl.substring(0, indexOfParamsSeparator > -1 ? indexOfParamsSeparator : _this.navigationUrl.length).length > 0;
                return result;
            }, _this);
            _this.tooltipVisible = ko.observable();
            _this.initializeStates();
            _this.signal = _this.connector.getSignal(_this.signalName);
            _this.initializeSignalArray();
            _this.initializeSignals();
            _this.connector.getOnlineUpdates();
            return _this;
        }
        WfSvgPathComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.height = ko.unwrap(this.settings.height) !== undefined ? ko.unwrap(this.settings.height) : null;
            this.width = ko.unwrap(this.settings.width) !== undefined ? ko.unwrap(this.settings.width) : null;
            this.viewBox = ko.unwrap(this.settings.viewBox);
            // this.style = ko.computed(() => {
            //     if(this.settings.viewBox){
            //         return 'width: ' + this.width +'px;' + 'height: ' + this.height +'px;'
            //     }
            //     else return "";
            // },this);
            this.pathData = ko.unwrap(this.settings.pathData) || "M1 1 199 1 199 99 1 99 Z";
            this.navigationUrl = ko.unwrap(this.settings.navigationUrl) || "";
            this.pathCssClass = ko.unwrap(this.settings.pathCssClass) || "wf-svg-path";
            this.labelText = (ko.unwrap(this.connector.translate(ko.unwrap(this.settings.labelText))()) || "").stringPlaceholderResolver(this.objectID);
            this.subLabelText = (ko.unwrap(this.connector.translate(ko.unwrap(this.settings.subLabelText))()) || "").stringPlaceholderResolver(this.objectID);
            this.tooltipEnabled = ko.unwrap(this.settings.tooltipEnabled) !== undefined ? ko.unwrap(this.settings.tooltipEnabled) : false;
            this.tooltipVisible = ko.observable(false);
            this.tooltipTitle = ko.unwrap(this.settings.tooltipTitle) || "";
            this.isDateTime = ko.unwrap(this.settings.isDateTime) !== undefined ? ko.unwrap(this.settings.isDateTime) : false;
            this.dateTimeFormat = ko.unwrap(this.settings.dateTimeFormat) ? ko.unwrap(this.settings.dateTimeFormat) : "";
            this.isAlphanumeric = ko.unwrap(this.settings.isAlphanumeric) !== undefined ? ko.unwrap(this.settings.isAlphanumeric) : false;
            this.unitLabel = ko.unwrap(this.settings.unitLabel) !== undefined ? ko.unwrap(this.settings.unitLabel) : false;
            this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
            this.signalValue = '';
        };
        WfSvgPathComponent.prototype.initializeSignals = function () {
            var _this = this;
            if (this.signalArrayService.isArray) {
                this.signalValue = this.signalArrayService.signalValue;
            }
            else if (this.isAlphanumeric) {
                this.signalValue = this.signal.value;
            }
            else if (this.isDateTime) {
                this.signalValue = this.signal.value.extend({
                    date: {
                        format: this.dateTimeFormat
                    }
                });
            }
            else {
                this.signalValue = ko.computed(function () {
                    return _this.signal.value() * _this.signalArrayService.signalValueFactor;
                }, this).extend({ numeralNumber: this.signalArrayService.format });
            }
        };
        WfSvgPathComponent.prototype.initializeSignalArray = function () {
            this.signalArrayService = new SignalArrayService(this.settings, this.signal);
        };
        WfSvgPathComponent.prototype.initializeStates = function () {
            this.states = new VisualStatesService(this.settings);
            this.statusCssClass = this.states.multipleCss;
        };
        WfSvgPathComponent.prototype.mouseover = function () {
            if (!this.tooltipEnabled)
                return;
            this.tooltipVisible(true);
        };
        ;
        WfSvgPathComponent.prototype.mouseout = function () {
            if (!this.tooltipEnabled)
                return;
            this.tooltipVisible(false);
        };
        ;
        WfSvgPathComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            if (!this.signal)
                                return [2 /*return*/];
                            return [2 /*return*/, this.connector.unregisterSignals(this.signal)];
                    }
                });
            });
        };
        ;
        return WfSvgPathComponent;
    }(ComponentBaseModel));
    return WfSvgPathComponent;
});
//# sourceMappingURL=wf-svg-path.component.js.map