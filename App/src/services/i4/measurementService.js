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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
define(["require", "exports", "./proxyClient", "../logger", "./subscription"], function (require, exports, ProxyClient, Logger, Subscription) {
    "use strict";
    var MeasurementService = /** @class */ (function (_super) {
        __extends(MeasurementService, _super);
        function MeasurementService() {
            var _this = _super.call(this, $.connection.measurementHub) || this;
            if (!window.usei4Connector)
                return _this;
            _this.hub = $.connection.hub.proxies.measurementhub;
            _this.subscriptions = ko.observableArray();
            if (_this.hub) {
                _this.hub.client.onMeasurement = function (measurement) { return _this.onMeasurement(measurement); };
            }
            return _this;
        }
        MeasurementService.prototype.onConnected = function () {
            var e_1, _a;
            var _this = this;
            try {
                // Resubscribe all signals
                for (var _b = __values(this.subscriptions()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var subscription = _c.value;
                    Logger.info(MeasurementService, "onConnected subscribe with id: " + subscription.state.id);
                    this.hub.server.subscribe(subscription.state.id)
                        .then(function (state) {
                        _this.onMeasurement(state);
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        MeasurementService.prototype.onMeasurement = function (measurement) {
            if (!measurement)
                return;
            var subscription = _.find(this.subscriptions(), function (x) { return x.state.id === measurement.signalId; });
            if (subscription) {
                subscription.updateState(measurement);
            }
        };
        // public subscribe(observer: any, id: Guid): Q.Promise<ISignalState> {
        //     let subscription = _.find(this.subscriptions(), x => x.state.id === id);
        //     if (!subscription) {
        //         subscription = new Subscription(id, observer);
        //         this.subscriptions.push(subscription);
        //         if ((this.hub as any).connection.state === 1)//SignalRConnectionState.connected)
        //         {
        //             Logger.info(MeasurementService, "subscribe subscribe with id: " + subscription.state.id);
        //             this.hub.server.subscribe(id)
        //                 .then(measurement => {
        //                     subscription.updateState(measurement);
        //                 });
        //         }
        //     }
        //     return Q(subscription.state);
        // }
        MeasurementService.prototype.subscribeAll = function (observer, ids) {
            return __awaiter(this, void 0, void 0, function () {
                var subscriptionMap, newSubscriptions, ids_1, ids_1_1, id, subscription, measurements, measurements_1, measurements_1_1, measurement;
                var e_2, _a, e_3, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            subscriptionMap = this.subscriptions().reduce(function (prev, current) {
                                prev[current.state.id] = current;
                                return prev;
                            }, {});
                            newSubscriptions = [];
                            try {
                                for (ids_1 = __values(ids), ids_1_1 = ids_1.next(); !ids_1_1.done; ids_1_1 = ids_1.next()) {
                                    id = ids_1_1.value;
                                    if (id && !subscriptionMap[id]) {
                                        subscription = new Subscription(id, observer);
                                        this.subscriptions.push(subscription);
                                        subscriptionMap[id] = subscription;
                                        newSubscriptions.push(id);
                                    }
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (ids_1_1 && !ids_1_1.done && (_a = ids_1.return)) _a.call(ids_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            if (!(newSubscriptions.length && this.hub.connection.state === 1) /*connected*/) return [3 /*break*/, 2]; /*connected*/
                            Logger.info(MeasurementService, "Subscribing to " + newSubscriptions.length + " signals");
                            return [4 /*yield*/, this.hub.server.subscribeAll(newSubscriptions)];
                        case 1:
                            measurements = _c.sent();
                            try {
                                for (measurements_1 = __values(measurements), measurements_1_1 = measurements_1.next(); !measurements_1_1.done; measurements_1_1 = measurements_1.next()) {
                                    measurement = measurements_1_1.value;
                                    if (measurement) {
                                        subscriptionMap[measurement.signalId].updateState(measurement);
                                    }
                                }
                            }
                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                            finally {
                                try {
                                    if (measurements_1_1 && !measurements_1_1.done && (_b = measurements_1.return)) _b.call(measurements_1);
                                }
                                finally { if (e_3) throw e_3.error; }
                            }
                            _c.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        MeasurementService.prototype.unsubscribe = function (observer, id) {
            return __awaiter(this, void 0, void 0, function () {
                var subscription;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            subscription = _.find(this.subscriptions(), function (x) { return x.state.id === id; });
                            if (!subscription)
                                return [2 /*return*/];
                            subscription.observers.remove(observer);
                            if (!!subscription.observers().length) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.hub.server.unsubscribe(id)];
                        case 1:
                            _a.sent();
                            this.subscriptions.remove(subscription);
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        MeasurementService.prototype.unsubscribeAll = function (observer, ids) {
            return __awaiter(this, void 0, void 0, function () {
                var hubIds, _loop_1, this_1, ids_2, ids_2_1, id;
                var e_4, _a;
                return __generator(this, function (_b) {
                    hubIds = [];
                    _loop_1 = function (id) {
                        var subscription = _.find(this_1.subscriptions(), function (x) { return x.state.id === id; });
                        if (!subscription)
                            return "continue";
                        subscription.observers.remove(observer);
                        if (!subscription.observers().length) {
                            hubIds.push(id);
                            this_1.subscriptions.remove(subscription);
                        }
                    };
                    this_1 = this;
                    try {
                        for (ids_2 = __values(ids), ids_2_1 = ids_2.next(); !ids_2_1.done; ids_2_1 = ids_2.next()) {
                            id = ids_2_1.value;
                            _loop_1(id);
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (ids_2_1 && !ids_2_1.done && (_a = ids_2.return)) _a.call(ids_2);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                    if (hubIds.length) {
                        this.hub.server.unsubscribeAll(hubIds);
                    }
                    return [2 /*return*/];
                });
            });
        };
        MeasurementService.prototype.read = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.hub.server.read(id)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        return MeasurementService;
    }(ProxyClient));
    return MeasurementService;
});
//# sourceMappingURL=measurementService.js.map