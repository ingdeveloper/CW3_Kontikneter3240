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
    var WfSwitch3StatesComponent = /** @class */ (function (_super) {
        __extends(WfSwitch3StatesComponent, _super);
        function WfSwitch3StatesComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.initializeWriteSecure();
            _this.initializeStates();
            _this.connector.getOnlineUpdates();
            return _this;
        }
        WfSwitch3StatesComponent.prototype.initializeStates = function () {
            this.settings.stateSignalName1 = this.signalName;
            this.settings.maskSignal1 = this.onValue;
            this.settings.stateSignalName2 = this.signalName;
            this.settings.maskSignal2 = this.offValue;
            this.settings.stateSignalName3 = this.signalName;
            this.settings.maskSignal3 = this.neutralValue;
            this.states = new VisualStatesService(this.settings);
            this.statusCssClass = this.states.statusCssClass;
        };
        WfSwitch3StatesComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.onText = (ko.unwrap(this.settings.onText) || 'I4SCADA_ON').stringPlaceholderResolver(this.objectID);
            this.offText = (ko.unwrap(this.settings.offText) || 'I4SCADA_OFF').stringPlaceholderResolver(this.objectID);
            this.neutralText = (ko.unwrap(this.settings.neutralText) || 'I4SCADA_NEUTRAL').stringPlaceholderResolver(this.objectID);
            this.onValue = ko.unwrap(this.settings.onValue) !== undefined ? ko.unwrap(this.settings.onValue) : 1;
            this.offValue = ko.unwrap(this.settings.offValue) !== undefined ? ko.unwrap(this.settings.offValue) : 0;
            this.neutralValue = ko.unwrap(this.settings.neutralValue) !== undefined ? ko.unwrap(this.settings.neutralValue) : 2;
            this.cssClass = ko.unwrap(this.settings.cssClass) || 'wf-5x';
            this.onIconClass = ko.unwrap(this.settings.onIconClass) || '';
            this.offIconClass = ko.unwrap(this.settings.offIconClass) || '';
            this.neutralIconClass = ko.unwrap(this.settings.neutralIconClass) || '';
            this.textStyle = ko.unwrap(this.settings.textStyle) || '';
            this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
            this.writeToBuffer = ko.unwrap(this.settings.writeToBuffer) !== undefined ? ko.unwrap(this.settings.writeToBuffer) : false;
        };
        WfSwitch3StatesComponent.prototype.initializeWriteSecure = function () {
            this.writeSecure = ko.unwrap(this.settings.writeSecure) !== undefined ? ko.unwrap(this.settings.writeSecure) : false;
            this.writeSecureValues = ko.observable();
            this.showWriteSecure = ko.observable(false);
        };
        WfSwitch3StatesComponent.prototype.writeInputValueSecure = function (value) {
            this.writeSecureValues([value]);
            this.showWriteSecure(true);
        };
        WfSwitch3StatesComponent.prototype.writeInputValue = function (value) {
            return __awaiter(this, void 0, void 0, function () {
                var values, result;
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
                            return [3 /*break*/, 4];
                        case 1:
                            if (!this.writeSecure) return [3 /*break*/, 2];
                            this.writeInputValueSecure(values[this.signalName]);
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.connector.writeSignals(values)];
                        case 3:
                            result = _a.sent();
                            if (!result.successful) {
                                this.connector.error("Signal write", result.errorMessage);
                            }
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfSwitch3StatesComponent.prototype.dispose = function () {
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
        return WfSwitch3StatesComponent;
    }(ComponentBaseModel));
    return WfSwitch3StatesComponent;
});
//# sourceMappingURL=wf-switch-3-states.component.js.map