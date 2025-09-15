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
define(["require", "exports", "./api", "./sessionService", "./connectorService", "./signalsService"], function (require, exports, Api, SessionService, ConnectorService, SignalsService) {
    "use strict";
    var OperationDiarySource = /** @class */ (function () {
        function OperationDiarySource(filter) {
            this.filter = filter;
            this.isPollingEnabled = false;
            this.events = ko.observableArray([]);
        }
        OperationDiarySource.prototype.startPolling = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.isPollingEnabled) {
                                return [2 /*return*/];
                            }
                            this.isPollingEnabled = true;
                            if (!!this.EventsUpdatedSignal) return [3 /*break*/, 2];
                            this.EventsUpdatedSignal = SignalsService.getSignal("WFSInternal_EventUpdates");
                            return [4 /*yield*/, SignalsService.getOnlineUpdates()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            if (!this.subscription) {
                                this.subscription = this.EventsUpdatedSignal.value.subscribe(function () {
                                    _this.pollData(false);
                                });
                            }
                            _.delay(function () { return _this.pollData(); }, OperationDiarySource.updateInterval);
                            return [2 /*return*/];
                    }
                });
            });
        };
        OperationDiarySource.prototype.stopPolling = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.isPollingEnabled = false;
                            this.subscription.dispose();
                            return [4 /*yield*/, SignalsService.unregisterSignals([this.EventsUpdatedSignal])];
                        case 1:
                            _a.sent();
                            this.subscription = null;
                            this.EventsUpdatedSignal = null;
                            return [2 /*return*/];
                    }
                });
            });
        };
        OperationDiarySource.prototype.pollData = function (polling) {
            if (polling === void 0) { polling = true; }
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.isPollingEnabled) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.getWFEvents()];
                        case 1:
                            _a.sent();
                            if (polling) {
                                _.delay(function () { return _this.pollData(); }, OperationDiarySource.updateInterval);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        OperationDiarySource.prototype.getWFEvents = function () {
            return __awaiter(this, void 0, void 0, function () {
                var events;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Api.operationDiaryService.getWFEvents(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), this.filter.toDto(), 10000)];
                        case 2:
                            events = _a.sent();
                            this.events(events);
                            return [2 /*return*/];
                    }
                });
            });
        };
        OperationDiarySource.updateInterval = 10000;
        return OperationDiarySource;
    }());
    return OperationDiarySource;
});
//# sourceMappingURL=operationDiarySource.js.map