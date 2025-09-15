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
define(["require", "exports", "../../../viewModels/cowi/rezepturEnums", "../../../viewModels/cowi/services/rezService"], function (require, exports, rezepturEnums_1, rezService_1) {
    "use strict";
    var WsWatchdog = /** @class */ (function () {
        function WsWatchdog() {
            this.timers = [];
            this.ws1Callbacks = new Map();
            this.ws2Callbacks = new Map();
            this.ws3Callbacks = new Map();
            this.ws4Callbacks = new Map();
            this.callbackId = 0;
        }
        WsWatchdog.getInstance = function () {
            if (!WsWatchdog.instance) {
                WsWatchdog.instance = new WsWatchdog();
            }
            return WsWatchdog.instance;
        };
        WsWatchdog.prototype.addWs1Callback = function (callback) {
            var id = this.callbackId++;
            this.ws1Callbacks.set(id, callback);
            this.checkAndStartTimers();
            return id;
        };
        WsWatchdog.prototype.addWs2Callback = function (callback) {
            var id = this.callbackId++;
            this.ws2Callbacks.set(id, callback);
            this.checkAndStartTimers();
            return id;
        };
        WsWatchdog.prototype.addWs3Callback = function (callback) {
            var id = this.callbackId++;
            this.ws3Callbacks.set(id, callback);
            this.checkAndStartTimers();
            return id;
        };
        WsWatchdog.prototype.addWs4Callback = function (callback) {
            var id = this.callbackId++;
            this.ws4Callbacks.set(id, callback);
            this.checkAndStartTimers();
            return id;
        };
        WsWatchdog.prototype.removeWs1Callback = function (id) {
            this.ws1Callbacks.delete(id);
            this.checkAndStopTimers();
        };
        WsWatchdog.prototype.removeWs2Callback = function (id) {
            this.ws2Callbacks.delete(id);
            this.checkAndStopTimers();
        };
        WsWatchdog.prototype.removeWs3Callback = function (id) {
            this.ws3Callbacks.delete(id);
            this.checkAndStopTimers();
        };
        WsWatchdog.prototype.removeWs4Callback = function (id) {
            this.ws4Callbacks.delete(id);
            this.checkAndStopTimers();
        };
        WsWatchdog.prototype.dispose = function () {
            this.stop();
        };
        WsWatchdog.prototype.start = function () {
            this.watchdog();
        };
        WsWatchdog.prototype.stop = function () {
            this.timers.forEach(function (timer) { return clearTimeout(timer); });
            this.timers = [];
        };
        WsWatchdog.prototype.checkAndStartTimers = function () {
            if (this.hasActiveCallbacks() && this.timers.length === 0) {
                this.start();
            }
        };
        WsWatchdog.prototype.checkAndStopTimers = function () {
            if (!this.hasActiveCallbacks()) {
                this.stop();
            }
        };
        WsWatchdog.prototype.hasActiveCallbacks = function () {
            return (this.ws1Callbacks.size > 0 ||
                this.ws2Callbacks.size > 0 ||
                this.ws3Callbacks.size > 0 ||
                this.ws4Callbacks.size > 0);
        };
        /** Lebenszeichen von Webservices */
        WsWatchdog.prototype.watchdog = function () {
            var _this = this;
            var createTimer = function (service, stateSetter, interval) {
                var tick = function () { return __awaiter(_this, void 0, void 0, function () {
                    var response, _a, newTimer_1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, 3, 4]);
                                return [4 /*yield*/, rezService_1.rezService.getServerTime(service)];
                            case 1:
                                response = _b.sent();
                                stateSetter(moment(response).isValid());
                                return [3 /*break*/, 4];
                            case 2:
                                _a = _b.sent();
                                stateSetter(false);
                                return [3 /*break*/, 4];
                            case 3:
                                // wichtig beim Disposen die Timer n. mehr rekursiv aufzurufen
                                if (this.hasActiveCallbacks()) {
                                    newTimer_1 = setTimeout(tick, interval);
                                    this.timers.push(newTimer_1);
                                }
                                return [7 /*endfinally*/];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                // Sofortiger Aufruf
                var newTimer = setTimeout(tick, 1);
                _this.timers.push(newTimer);
            };
            var period = 5000;
            createTimer(rezepturEnums_1.ServiceWahl.wcfSiem, this.setWs1State.bind(this), period);
            createTimer(rezepturEnums_1.ServiceWahl.WcfRezept, this.setWs2State.bind(this), period);
            createTimer(rezepturEnums_1.ServiceWahl.WsCwSAP, this.setWs3State.bind(this), period);
            createTimer(rezepturEnums_1.ServiceWahl.WsCcwBde, this.setWs4State.bind(this), period);
        };
        // Setter-Methoden für den Zustand der Webservices
        WsWatchdog.prototype.setWs1State = function (state) {
            this.ws1Callbacks.forEach(function (callback) { return callback(state); });
        };
        WsWatchdog.prototype.setWs2State = function (state) {
            this.ws2Callbacks.forEach(function (callback) { return callback(state); });
        };
        WsWatchdog.prototype.setWs3State = function (state) {
            this.ws3Callbacks.forEach(function (callback) { return callback(state); });
        };
        WsWatchdog.prototype.setWs4State = function (state) {
            this.ws4Callbacks.forEach(function (callback) { return callback(state); });
        };
        return WsWatchdog;
    }());
    return WsWatchdog;
});
//# sourceMappingURL=wsWatchdog.js.map