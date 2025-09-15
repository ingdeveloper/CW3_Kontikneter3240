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
define(["require", "exports", "src/components/component-base.model", "src/components/services/signal-array.service"], function (require, exports, ComponentBaseModel, SignalArrayService) {
    "use strict";
    var WfWatchdogComponent = /** @class */ (function (_super) {
        __extends(WfWatchdogComponent, _super);
        function WfWatchdogComponent(params) {
            var _this = _super.call(this, params) || this;
            // Stop here if no signalName was configured
            if (!_this.signalName) {
                return _this;
            }
            _this.signal = _this.connector.getSignal(_this.signalName);
            _this.initializeSignalArray();
            if (_this.signalArrayService.isArray) {
                _this.signalValue = _this.signalArrayService.signalValue;
            }
            else {
                _this.signalValue = _this.signal.value;
            }
            _this.handleTimer();
            _this.initializeComputeds();
            _this.connector.getOnlineUpdates(); //.fail(this.connector.handleError(this));
            return _this;
        }
        WfWatchdogComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.timeout = null;
            this.watchDog = ko.observable(false);
            this.period = ko.unwrap(this.settings.period) || 2000;
            this.signalName = (ko.unwrap(this.settings.signalName) || "WFSInternal_AliveTimeStamp").stringPlaceholderResolver(this.objectID);
            this.tooltipText = (ko.unwrap(this.connector.translate(this.settings.tooltipText)()) || "").stringPlaceholderResolver(this.objectID);
            this.onlineClass = ko.unwrap(this.settings.onlineClass) || 'wf-watchdog-online wf wf-server';
            this.onlineClass2 = ko.unwrap(this.settings.onlineClass2) || this.onlineClass.replace("wf-watchdog-online", "ccw-color-dark-green"); //wf-watchdog-onlie ist grüne Farbe, diesen String ersetzen durch die neu Farbe
            this.offlineClass = ko.unwrap(this.settings.offlineClass) || 'wf-watchdog-offline wf wf-server';
            this.statusCssClass = ko.observable('wf-watchdog-default wf wf-server');
            this.signalValue = '';
        };
        WfWatchdogComponent.prototype.initializeComputeds = function () {
            var _this = this;
            if (ko.isObservable(this.signalValue)) {
                (this.signalValue).subscribe(function () {
                    _this.handleTimer();
                    // Zwei Klassen bei Signaländerung togglen
                    // console.log("ccw-wf-watchdog");
                    _this.toggleClass = !_this.toggleClass;
                    if (_this.toggleClass) {
                        _this.statusCssClass(_this.onlineClass2);
                    }
                    else {
                        _this.statusCssClass(_this.onlineClass);
                    }
                });
            }
        };
        WfWatchdogComponent.prototype.initializeSignalArray = function () {
            this.signalArrayService = new SignalArrayService(this.settings, this.signal);
        };
        WfWatchdogComponent.prototype.handleTimer = function () {
            var _this = this;
            clearTimeout(this.timeout);
            this.watchDog(false);
            this.statusCssClass(this.onlineClass);
            this.timeout = window.setTimeout(function () {
                _this.watchDog(true);
                _this.statusCssClass(_this.offlineClass);
            }, this.period);
        };
        WfWatchdogComponent.prototype.dispose = function () {
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
        return WfWatchdogComponent;
    }(ComponentBaseModel));
    return WfWatchdogComponent;
});
//# sourceMappingURL=ccw-wf-watchdog.component.js.map