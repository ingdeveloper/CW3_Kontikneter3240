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
define(["require", "exports", "../component-base.model"], function (require, exports, ComponentBaseModel) {
    "use strict";
    var WfComboboxComponent = /** @class */ (function (_super) {
        __extends(WfComboboxComponent, _super);
        function WfComboboxComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.updateStatus = function (data) { return __awaiter(_this, void 0, void 0, function () {
                var values, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            values = {};
                            values[data.signalName] = data.value;
                            if (_.size(values) === 0)
                                return [2 /*return*/];
                            if (!this.writeToBuffer) return [3 /*break*/, 1];
                            this.connector.writeSignalsToBuffer(values);
                            return [3 /*break*/, 4];
                        case 1:
                            if (!this.writeSecure) return [3 /*break*/, 2];
                            this.writeInputValueSecure(data);
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
            }); };
            _this.initializeWriteSecure();
            return _this;
        }
        WfComboboxComponent.prototype.initializeSettings = function () {
            var _this = this;
            _super.prototype.initializeSettings.call(this);
            this.symbolicTextNormalState = (ko.unwrap(this.settings.symbolicTextNormalState) ? ko.unwrap(this.settings.symbolicTextNormalState) : "Select an option").stringPlaceholderResolver(this.objectID);
            this.cssClassNormalState = ko.unwrap(this.settings.cssClassNormalState) ? ko.unwrap(this.settings.cssClassNormalState) : "";
            this.cssClass = ko.unwrap(this.settings.cssClass) ? ko.unwrap(this.settings.cssClass) : "btn-default";
            this.iconStyle = ko.unwrap(this.settings.iconStyle) || '';
            this.textStyle = ko.unwrap(this.settings.textStyle) || '';
            this.buttonStyle = ko.unwrap(this.settings.buttonStyle) || '';
            this.dropdownAlignment = ko.unwrap(this.settings.dropdownAlignment) || "left";
            this.dropdownDirection = ko.unwrap(this.settings.dropdownDirection) === "up" ? "dropup" : "";
            this.writeItems = [];
            this.signalWriteItems = [];
            this.stateProperties = {
                'symbolicTextNormalState': ko.unwrap(this.symbolicTextNormalState),
                states: []
            };
            this.stateIconProperties = {
                'cssClassNormalState': ko.unwrap(this.cssClassNormalState),
                states: []
            };
            this.writeToBuffer = ko.unwrap(this.settings.writeToBuffer) !== undefined ? ko.unwrap(this.settings.writeToBuffer) : false;
            // Combine all Properties-Arrays together     
            var writeItems = _.zip(this.resolvePlaceHolder(this.settings.symbolicTexts, this.objectID), this.resolvePlaceHolder(this.settings.signalNames, this.objectID), this.settings.signalValues, this.settings.iconClass);
            // Generate properties objects for current state display and icon display (stateText and state CssClass widgets)
            _.each(writeItems, function (item, i) {
                var ii = i + 1;
                _this.signalWriteItems[i] = {
                    symbolicText: item[0],
                    signalName: item[1],
                    value: item[2],
                    icon: item[3]
                };
                var stateProperty = {
                    signalName: item[1],
                    maskSignal: item[2],
                    symbolicText: item[0]
                };
                var stateIconProperty = {
                    signalName: item[1],
                    maskSignal: item[2],
                    cssClassName: item[3]
                };
                _this.stateProperties.states.push(stateProperty);
                _this.stateIconProperties.states.push(stateIconProperty);
            });
            this.stateIconProperties["writeToBuffer"] = this.writeToBuffer;
            this.stateProperties["writeToBuffer"] = this.writeToBuffer;
        };
        WfComboboxComponent.prototype.initializeWriteSecure = function () {
            this.writeSecure = ko.unwrap(this.settings.writeSecure) !== undefined ? ko.unwrap(this.settings.writeSecure) : false;
            this.writeSecureValues = ko.observable();
            this.writeSecureSignalNames = ko.observable();
            this.showWriteSecure = ko.observable(false);
        };
        WfComboboxComponent.prototype.writeInputValueSecure = function (data) {
            if (this.isDisabled())
                return;
            this.writeSecureValues([data.value]);
            this.writeSecureSignalNames([data.signalName]);
            this.showWriteSecure(true);
        };
        WfComboboxComponent.prototype.resolvePlaceHolder = function (signalNames, objectID) {
            for (var i = 0; i < signalNames.length; i++)
                signalNames[i] = (ko.unwrap(signalNames[i]) || "").stringPlaceholderResolver(this.objectID);
            return signalNames;
        };
        WfComboboxComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfComboboxComponent;
    }(ComponentBaseModel));
    return WfComboboxComponent;
});
//# sourceMappingURL=wf-combobox.component.js.map