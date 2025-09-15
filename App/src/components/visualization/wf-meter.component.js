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
    var WfMeterComponent = /** @class */ (function (_super) {
        __extends(WfMeterComponent, _super);
        function WfMeterComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.signalName = (ko.unwrap(_this.settings.signalName) || '').stringPlaceholderResolver(_this.objectID);
            _this.label = (ko.unwrap(_this.settings.label) || '').stringPlaceholderResolver(_this.objectID);
            _this.unitLabel = ko.unwrap(_this.settings.unitLabel) !== undefined ? ko.unwrap(_this.settings.unitLabel) : true;
            _this.staticUnitText = (ko.unwrap(_this.settings.staticUnitText) || '').stringPlaceholderResolver(_this.objectID);
            _this.signal = _this.connector.getSignal(_this.signalName);
            _this.initializeSignalArray();
            if (_this.signalArrayService.isArray) {
                _this.signalValue = _this.signalArrayService.signalValue;
            }
            else {
                _this.signalValue = _this.signal.value;
            }
            _this.initializeComputeds();
            _this.connector.getOnlineUpdates(); //.fail(this.connector.handleError(self));
            return _this;
        }
        WfMeterComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
        };
        WfMeterComponent.prototype.initializeComputeds = function () {
            var _this = this;
            this.fullNumbers = ko.computed(function () {
                if (_this.signalValue() === undefined || _this.signalValue() === null || _this.signalValue() === "n/a")
                    return "";
                var value = _this.signalValue().toString().split(".")[0];
                if (value !== "n/a") {
                    return value.toString().lpad("0", 7);
                }
            });
            this.decimalNumbers = ko.computed(function () {
                var value = _this.signalValue();
                if (value === undefined || value === null || _this.signalValue() === "n/a")
                    return "";
                value = (Math.round(value * 100) / 100).toFixed(2).toString().split(".")[1];
                return value;
            });
        };
        WfMeterComponent.prototype.initializeSignalArray = function () {
            this.signalArrayService = new SignalArrayService(this.settings, this.signal);
        };
        WfMeterComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            if (!this.signal)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.connector.unregisterSignals(this.signal)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfMeterComponent;
    }(ComponentBaseModel));
    return WfMeterComponent;
});
//# sourceMappingURL=wf-meter.component.js.map