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
define(["require", "exports", "../services/value-conversions.service", "../component-base.model", "../services/signal-array.service"], function (require, exports, ValueConversionsService, ComponentBaseModel, SignalArrayService) {
    "use strict";
    var WfRotationContainerComponent = /** @class */ (function (_super) {
        __extends(WfRotationContainerComponent, _super);
        function WfRotationContainerComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.initializeComputeds();
            _this.signal = _this.connector.getSignal(_this.signalName);
            _this.initializeSignalArray();
            if (_this.signalName) {
                if (_this.signalArrayService.isArray) {
                    _this.currentSignalValue = _this.signalArrayService.signalValue;
                }
                else {
                    _this.currentSignalValue = _this.signal.value;
                }
            }
            _this.connector.getOnlineUpdates();
            return _this;
        }
        WfRotationContainerComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.valueConversionsService = new ValueConversionsService();
            this.minRange = ko.unwrap(this.settings.minRange) ? ko.unwrap(this.settings.minRange) : 0;
            this.maxRange = ko.unwrap(this.settings.maxRange) ? ko.unwrap(this.settings.maxRange) : 100;
            this.startAngle = ko.unwrap(this.settings.startAngle) !== undefined ? ko.unwrap(this.settings.startAngle) : 0;
            this.endAngle = ko.unwrap(this.settings.endAngle) ? ko.unwrap(this.settings.endAngle) : 360;
            this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
        };
        WfRotationContainerComponent.prototype.initializeComputeds = function () {
            var _this = this;
            // Stop here and return if no signalName was configured
            if (!this.signalName) {
                this.needleAngle = ko.observable(0);
                return;
            }
            // Calc and return the deg value
            this.needleAngle = ko.pureComputed(function () {
                var value = _this.currentSignalValue();
                if (value > _this.maxRange) {
                    return 'rotate(' + _this.endAngle + 'deg)';
                }
                if (value < _this.minRange) {
                    return 'rotate(' + _this.startAngle + 'deg)';
                }
                var degree = _this.valueConversionsService.linearScale(_this.currentSignalValue(), _this.minRange, _this.maxRange, _this.startAngle, _this.endAngle);
                return 'rotate(' + degree + 'deg)';
            });
        };
        WfRotationContainerComponent.prototype.initializeSignalArray = function () {
            this.signalArrayService = new SignalArrayService(this.settings, this.signal);
        };
        WfRotationContainerComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            if (!this.signal) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.connector.unregisterSignals(this.signal)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return WfRotationContainerComponent;
    }(ComponentBaseModel));
    return WfRotationContainerComponent;
});
//# sourceMappingURL=wf-rotation-container.component.js.map