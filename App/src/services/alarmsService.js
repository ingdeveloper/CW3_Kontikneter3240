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
define(["require", "exports", "./onlineAlarmSource", "./offlineAlarmSource", "./api", "./logger", "./sessionService", "./connectorService"], function (require, exports, OnlineAlarmSource, OfflineAlarmSource, Api, Logger, SessionService, ConnectorService) {
    "use strict";
    var AlarmsService = /** @class */ (function () {
        function AlarmsService() {
        }
        AlarmsService.getOnlineAlarms = function (filter, updateRate) {
            return new OnlineAlarmSource(filter, updateRate || AlarmsService.onlineAlarmsUpdateRate);
        };
        AlarmsService.getOfflineAlarms = function (filter) {
            return new OfflineAlarmSource(filter, AlarmsService.offlineAlarmsUpdateRate);
        };
        AlarmsService.getAlarmGroups = function (languageId) {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            securityToken = SessionService.getSecurityToken();
                            if (!securityToken) return [3 /*break*/, 2];
                            return [4 /*yield*/, Api.alarmsService.getAlarmGroupsByToken(securityToken, languageId, SessionService.timeOut)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [4 /*yield*/, ConnectorService.connect()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, Api.alarmsService.getAlarmGroups(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), languageId, SessionService.timeOut)];
                        case 4: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        AlarmsService.getAlarmTypes = function (languageId) {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            securityToken = SessionService.getSecurityToken();
                            if (!securityToken) return [3 /*break*/, 2];
                            return [4 /*yield*/, Api.alarmsService.getAlarmTypesByToken(securityToken, languageId, SessionService.timeOut)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [4 /*yield*/, ConnectorService.connect()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, Api.alarmsService.getAlarmTypes(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), languageId, SessionService.timeOut)];
                        case 4: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        AlarmsService.getAlarms = function (alarmIds, languageId) {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            securityToken = SessionService.getSecurityToken();
                            if (!securityToken) return [3 /*break*/, 2];
                            return [4 /*yield*/, Api.alarmsService.getAlarmsByToken(securityToken, alarmIds, languageId, window.defaultTimeZone, SessionService.timeOut, true)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [4 /*yield*/, ConnectorService.connect()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, Api.alarmsService.getAlarms(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), alarmIds, languageId, window.defaultTimeZone, SessionService.timeOut, true)];
                        case 4: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        AlarmsService.acknowledgeAlarms = function (alarmIds, comment) {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Logger.info(AlarmsService, "Acknowledging alarms (" + comment + ")");
                            securityToken = SessionService.getSecurityToken();
                            if (!securityToken) return [3 /*break*/, 2];
                            return [4 /*yield*/, Api.alarmsService.acknowledgeAlarmsByToken(securityToken, alarmIds, comment, SessionService.timeOut)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [4 /*yield*/, ConnectorService.connect()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, Api.alarmsService.acknowledgeAlarms(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), alarmIds, comment, SessionService.timeOut)];
                        case 4: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        AlarmsService.acknowledgeAllAlarms = function (comment) {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Logger.info(AlarmsService, "Acknowledging all alarms " + comment);
                            securityToken = SessionService.getSecurityToken();
                            if (!securityToken) return [3 /*break*/, 2];
                            return [4 /*yield*/, Api.alarmsService.acknowledgeAllAlarmsByToken(securityToken, comment, SessionService.timeOut)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [4 /*yield*/, ConnectorService.connect()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, Api.alarmsService.acknowledgeAllAlarms(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), comment, SessionService.timeOut)];
                        case 4: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        AlarmsService.acknowledgeAllGoneAlarms = function (comment) {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Logger.info(AlarmsService, "Acknowledging all gone alarms " + comment);
                            securityToken = SessionService.getSecurityToken();
                            if (!securityToken) return [3 /*break*/, 2];
                            return [4 /*yield*/, Api.alarmsService.acknowledgeAllGoneAlarmsByToken(SessionService.getSecurityToken(), comment, SessionService.timeOut)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [4 /*yield*/, ConnectorService.connect()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, Api.alarmsService.acknowledgeAllGoneAlarms(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), comment, SessionService.timeOut)];
                        case 4: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        AlarmsService.acknowledgeAlarmsByGroup = function (groupName, comment) {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Logger.info(AlarmsService, "Acknowledging  in group '" + groupName + "' (" + comment + ")");
                            securityToken = SessionService.getSecurityToken();
                            if (!securityToken) return [3 /*break*/, 2];
                            return [4 /*yield*/, Api.alarmsService.acknowledgeAlarmsByGroupByToken(SessionService.getSecurityToken(), groupName, comment, SessionService.timeOut)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [4 /*yield*/, ConnectorService.connect()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, Api.alarmsService.acknowledgeAlarmsByGroup(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), groupName, comment, SessionService.timeOut)];
                        case 4: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        AlarmsService.setAlarmState = function (alarmId, state, reactivation) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Api.alarmsService.setAlarmState(SessionService.getSecurityToken(), alarmId, state, reactivation.toMSDate(), SessionService.timeOut)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        AlarmsService.setAlarmStates = function (alarmIds, states, reactivations) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Api.alarmsService.setAlarmStates(SessionService.getSecurityToken(), alarmIds, states, reactivations, SessionService.timeOut)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        AlarmsService.getAlarmsWithChangedProcessingAndDisplayState = function (languageId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, Api.alarmsService.getAlarmsWithChangedProcessingAndDisplayState(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), languageId, SessionService.timeOut)];
                });
            });
        };
        AlarmsService.getExtendedAlarmProperties = function () {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            securityToken = SessionService.getSecurityToken();
                            if (!securityToken) return [3 /*break*/, 2];
                            return [4 /*yield*/, Api.alarmsService.getExtendedAlarmPropertiesByToken(SessionService.getSecurityToken(), SessionService.timeOut)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [4 /*yield*/, ConnectorService.connect()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, Api.alarmsService.getExtendedAlarmProperties(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), SessionService.timeOut)];
                        case 4: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        AlarmsService.onlineAlarmsUpdateRate = 2000;
        AlarmsService.offlineAlarmsUpdateRate = 1000;
        AlarmsService.timeOut = 10000;
        return AlarmsService;
    }());
    return AlarmsService;
});
//# sourceMappingURL=alarmsService.js.map