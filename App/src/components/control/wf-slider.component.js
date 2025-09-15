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
define(["require", "exports", "../component-base.model", "../services/signal-array.service"], function (require, exports, ComponentBaseModel, SignalArrayService) {
    "use strict";
    var WfSliderComponent = /** @class */ (function (_super) {
        __extends(WfSliderComponent, _super);
        function WfSliderComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.count = 0;
            _this.checkSettings();
            _this.setScale();
            _this.getSignalDefinition();
            _this.inputSignal = _this.connector.getSignal(ko.unwrap(_this.signalName));
            _this.initializeSignalArray();
            if (_this.signalArrayService.isArray) {
                _this.inputSignalValue = _this.signalArrayService.signalValue;
            }
            else {
                _this.inputSignalValue = _this.inputSignal.value;
            }
            _this.initializeWriteSecure();
            _this.initializeComputeds();
            _this.updateValues(_this.inputSignal.value());
            _this.connector.getOnlineUpdates();
            return _this;
        }
        WfSliderComponent.prototype.updateValues = function (newValue) {
            if (this.isBuffered())
                return;
            if (isNaN(newValue))
                return;
            this.unCommittedValue(newValue);
            this.committedValue(numeral(newValue).format(this.format));
        };
        WfSliderComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.selectedLanguageId = this.connector.currentLanguageId;
            this.minRange = ko.unwrap(this.settings.minRange) ? ko.unwrap(this.settings.minRange) : 0;
            this.maxRange = ko.unwrap(this.settings.maxRange) ? ko.unwrap(this.settings.maxRange) : 100;
            this.refresh = ko.observable(false);
            this.event = ko.unwrap(this.settings.event) || "slideStop";
            this.writeDelay = ko.unwrap(this.settings.writeDelay) || 100;
            this.signalDefinitions = ko.observable({});
            this.step = ko.unwrap(this.settings.step) || 1;
            this.majorTicks = ko.unwrap(this.settings.majorTicks) || 5;
            this.tooltip = ko.unwrap(this.settings.tooltip) || "show"; //  Accepts: 'show', 'hide', or 'always'
            this.orientation = ko.unwrap(this.settings.orientation) || "horizontal"; // Accepts 'vertical' or 'horizontal'
            this.handle = ko.unwrap(this.settings.handle) || "round"; // Accepts: 'round', 'square', 'triangle' or 'custom'
            this.scale = ko.unwrap(this.settings.scale) || "linear"; // Accepts: 'linear' and 'logarithmic'  
            this.reversed = ko.unwrap(this.settings.reversed) !== undefined ? ko.unwrap(this.settings.reversed) : false;
            this.showTickLabels = ko.unwrap(this.settings.showTickLabels) !== undefined ? ko.unwrap(this.settings.showTickLabels) : false;
            this.unitLabel = ko.unwrap(this.settings.unitLabel) !== undefined ? ko.unwrap(this.settings.unitLabel) : false;
            this.cssClass = ko.unwrap(this.settings.cssClass) || "";
            this.height = ko.unwrap(this.settings.height) || null;
            this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[00]";
            this.signalName = (ko.unwrap(this.settings.signalName) || "").stringPlaceholderResolver(this.objectID);
            this.unCommittedValue = ko.observable();
            this.committedValue = ko.observable();
            this.unit = ko.observable();
            this.tooltipText = (ko.unwrap(this.connector.translate(this.settings.tooltipText)()) || "").stringPlaceholderResolver(this.objectID);
            this.writeToBuffer = ko.unwrap(this.settings.writeToBuffer) !== undefined ? ko.unwrap(this.settings.writeToBuffer) : false;
            this.isBufferedClass = ko.unwrap(this.settings.isBufferedClass) || "slider-info";
        };
        WfSliderComponent.prototype.initializeComputeds = function () {
            var _this = this;
            this.inputSignalValue.subscribe(function (newValue) {
                _this.updateValues(newValue);
            });
            this.isBuffered = ko.computed(function () {
                if (!_this.writeToBuffer)
                    return false;
                return _this.connector.existSignalInBuffer(_this.signalName) && !_this.connector.signalBufferIsEmpty();
            });
            this.displayClassNames = ko.computed(function () {
                return _this.isBuffered() == true ? _this.isBufferedClass : _this.cssClass;
            });
        };
        WfSliderComponent.prototype.initializeWriteSecure = function () {
            this.writeSecure = ko.unwrap(this.settings.writeSecure) !== undefined ? ko.unwrap(this.settings.writeSecure) : false;
            this.writeSecureValues = ko.observable();
            this.showWriteSecure = ko.observable(false);
        };
        WfSliderComponent.prototype.initializeSignalArray = function () {
            this.signalArrayService = new SignalArrayService(this.settings, this.inputSignal);
        };
        WfSliderComponent.prototype.checkSettings = function () {
            if (!this.signalName) {
                console.error("signalName not defined");
                throw "signalName not defined";
            }
            if (this.minRange >= this.maxRange) {
                this.minRange = 0;
                this.maxRange = 100;
                console.warn("maxRange can't be smaller than minRange, used default values");
            }
            if (this.event !== "slideStop" && this.event !== "change") {
                this.event = "slideStop";
                console.warn("event not correctly set, use default value");
            }
            if (this.writeDelay < 0) {
                this.writeDelay = 100;
                console.warn("writeDelay not correctly set, use default value");
            }
            if (this.scale === "logarithmic") {
                if (this.maxRange > 800) {
                    console.warn("maxRange can't be greather than 800, if logarithmic scale is true, used 800 as value");
                    this.maxRange = 800;
                }
                if (this.minRange < 0) {
                    this.minRange = 1;
                    console.warn("negative minRange not supported if logarithmic scale is true, used default values");
                }
            }
        };
        WfSliderComponent.prototype.toValue = function (percentage) {
            var min = (this.minRange === 0) ? 0 : Math.log(this.minRange);
            var max = Math.log(this.maxRange);
            var value = Math.exp(min + (max - min) * percentage / 100);
            value = this.minRange + Math.round((value - this.minRange));
            return value;
        };
        WfSliderComponent.prototype.setScale = function () {
            var _this = this;
            if (this.showTickLabels) {
                this.ticks = _.map(_.range(this.minRange, this.maxRange + 1, (this.maxRange - this.minRange) / (this.majorTicks - 1)), function (num) {
                    return parseFloat(num);
                });
                this.ticks_labels = _.map(_.range(this.minRange, this.maxRange + 1, (this.maxRange - this.minRange) / (this.majorTicks - 1)), function (num) {
                    return (numeral(num).format(_this.format));
                });
                if (this.scale === "logarithmic") {
                    this.ticks = _.map(_.range(this.minRange, this.maxRange + 1, (this.maxRange - this.minRange) / (this.majorTicks - 1)), function (num) {
                        return parseFloat(_this.toValue((num) / ((_this.maxRange - _this.minRange) / 100)));
                    });
                    this.ticks_labels = _.map(_.range(this.minRange, this.maxRange + 1, (this.maxRange - this.minRange) / (this.majorTicks - 1)), function (num) {
                        return parseFloat(_this.toValue((num) / ((_this.maxRange - _this.minRange) / 100)));
                    });
                }
            }
            else {
                this.ticks = [];
                this.ticks_labels = [];
            }
        };
        WfSliderComponent.prototype.getSignalDefinition = function () {
            return __awaiter(this, void 0, void 0, function () {
                var definitions, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.connector.getSignalDefinitions([this.signalName])];
                        case 1:
                            definitions = _a.sent();
                            this.signalDefinitions((definitions[0] || {}));
                            this.unit(this.signalDefinitions().Unit);
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            this.connector.handleError(WfSliderComponent)(error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfSliderComponent.prototype.slideStop = function (e, data) {
            if (this.event === "slideStop") {
                this.writeInputValue(data.value);
            }
        };
        WfSliderComponent.prototype.change = function (e, data) {
            var _this = this;
            if (this.event === "change") {
                this.count += 1;
                setTimeout(function () {
                    _this.count -= 1;
                    if (_this.count <= 0) {
                        _this.writeInputValue(data.value.newValue);
                        _this.count = 0;
                    }
                }, this.writeDelay);
            }
        };
        WfSliderComponent.prototype.writeInputValueSecure = function (value) {
            this.writeSecureValues([value]);
            this.showWriteSecure(true);
        };
        WfSliderComponent.prototype.cancelWriteSecure = function () {
            this.unCommittedValue(this.committedValue());
        };
        WfSliderComponent.prototype.writeInputValue = function (value) {
            return __awaiter(this, void 0, void 0, function () {
                var values, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.isDisabled())
                                return [2 /*return*/];
                            values = {};
                            if (!this.signalName)
                                return [2 /*return*/];
                            if (this.signalDefinitions().Maximum >= value && this.signalDefinitions().Minimum <= value) {
                                values[this.signalName] = value;
                            }
                            else {
                                //console.warn(this, "out of Range");
                                if (this.signalDefinitions().Maximum < value)
                                    values[this.signalName] = this.signalDefinitions().Maximum;
                                if (this.signalDefinitions().Minimum > value)
                                    values[this.signalName] = this.signalDefinitions().Minimum;
                                this.unCommittedValue(values[this.signalName]);
                            }
                            if (this.signalArrayService.isArray) {
                                values[this.signalName] = this.signalArrayService.getWriteValues(values[this.signalName]);
                            }
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
                                this.unCommittedValue(ko.unwrap(this.inputSignalValue()));
                            }
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfSliderComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.connector.unregisterSignals(this.inputSignal)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfSliderComponent;
    }(ComponentBaseModel));
    return WfSliderComponent;
});
//# sourceMappingURL=wf-slider.component.js.map