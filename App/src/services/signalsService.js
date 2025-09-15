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
define(["require", "exports", "./models/signal", "./models/_signal", "./models/nullSignal", "./sessionService", "./connectorService", "./api", "./logger", "./errorCodeService", "./symbolicTextsService", "./deferred", "./models/signals"], function (require, exports, Signal, SignalsInterface, NullSignal, SessionService, ConnectorService, Api, Logger, ErrorCodeService, SymbolicTextsService, Deferred, Signals) {
    "use strict";
    var SignalValueType = SignalsInterface.SignalValueType;
    var SignalsService = /** @class */ (function () {
        function SignalsService() {
        }
        SignalsService.getRegisteredSignalByNameOrId = function (name) {
            if (!name)
                return null;
            var signal = SignalsService.registeredSignals[name];
            if (!signal) {
                return _.find(SignalsService.allRegisteredSignals, function (signal) {
                    return ko.unwrap(signal.id) === name;
                });
            }
            return signal;
        };
        SignalsService.getSignal = function (name, shouldAddSubscriber) {
            if (shouldAddSubscriber === void 0) { shouldAddSubscriber = true; }
            if (!name) {
                Logger.warn(SignalsService, "No signal name specified");
                return this.noSignal;
            }
            // name = name.toLowerCase(); //scada does not handle invariant signalName
            var signal = SignalsService.registeredSignals[name];
            if (!signal) {
                signal = new Signal(name);
                SignalsService.registeredSignals[name] = signal;
                SignalsService.registeredSignalList.push(signal);
                SignalsService.allRegisteredSignals.push(signal);
                if (name.indexOf("local://") !== 0) {
                    SignalsService.signalsToRegister.push(signal.signalName());
                }
            }
            if (shouldAddSubscriber) {
                signal.addSubscriber();
            }
            return signal;
        };
        SignalsService.unregisterSignals = function (signals) {
            var e_1, _a;
            try {
                for (var signals_1 = __values(signals), signals_1_1 = signals_1.next(); !signals_1_1.done; signals_1_1 = signals_1.next()) {
                    var signal = signals_1_1.value;
                    SignalsService.signalsToUnRegister.push(signal);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (signals_1_1 && !signals_1_1.done && (_a = signals_1.return)) _a.call(signals_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        SignalsService.getOnlineUpdates = function () {
            return __awaiter(this, void 0, void 0, function () {
                var session;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            session = _a.sent();
                            if (session) {
                                // noinspection JSIgnoredPromiseFromCall
                                SignalsService.registerSignals();
                                // noinspection JSIgnoredPromiseFromCall
                                SignalsService.startGettingUpdates();
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        SignalsService.readSignals = function (signalNames) {
            return __awaiter(this, void 0, void 0, function () {
                var signals;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            signals = Signals.fromSignalNames(signalNames);
                            SignalsService.readLocalSignals(signals.localSignals);
                            return [4 /*yield*/, this.readRemoteSignals(signals.remoteSignals)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, Signals.toSignalValueDTOs(signalNames, signals)];
                    }
                });
            });
        };
        SignalsService.writeSignals = function (signalValues) {
            return __awaiter(this, void 0, void 0, function () {
                var values, securityToken, currentUser, responseCodes, result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            values = Object.keys(signalValues).map(function (signalName) { return ({
                                key: signalName,
                                value: signalValues[signalName]
                            }); });
                            securityToken = SessionService.getSecurityToken();
                            currentUser = SessionService.currentLoggedInUser();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 7, , 8]);
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 2:
                            _a.sent();
                            responseCodes = void 0;
                            if (!(securityToken && currentUser)) return [3 /*break*/, 4];
                            return [4 /*yield*/, Api.signalsService.writeSecuredSignals(values, securityToken, SessionService.getClientId())];
                        case 3:
                            responseCodes = _a.sent();
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, Api.signalsService.writeUnsecuredSignals(values, SessionService.sessionId, SessionService.getClientId())];
                        case 5:
                            responseCodes = _a.sent();
                            _a.label = 6;
                        case 6:
                            result = SignalsService.handleWriteResponse(responseCodes);
                            if (!result.successful) {
                                Logger.handleError(SignalsService)(result.errorMessage);
                            }
                            return [2 /*return*/, result];
                        case 7:
                            error_1 = _a.sent();
                            Logger.handleError(SignalsService)(error_1);
                            return [2 /*return*/, SignalsService.handleWriteResponse(null)];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        SignalsService.writeSignalsSecure = function (userPassword, signalValues) {
            return __awaiter(this, void 0, void 0, function () {
                var values, securityToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            values = Object.keys(signalValues).map(function (signalName) { return ({
                                Name: signalName,
                                Value: signalValues[signalName]
                            }); });
                            securityToken = SessionService.getSecurityToken();
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, Api.signalsService.writeSignalsSecure(securityToken, userPassword, values)];
                    }
                });
            });
        };
        SignalsService.getLogIds = function (signalLogTags) {
            return __awaiter(this, void 0, void 0, function () {
                var logTags, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            logTags = _.map(signalLogTags, function (tag) {
                                return {
                                    SignalID: tag.signalId(),
                                    LogTag: tag.logTag()
                                };
                            });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Api.signalsService.getLogIds(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), logTags, SessionService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_2 = _a.sent();
                            Logger.handleError(SignalsService)(error_2);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SignalsService.getLogValues = function (filter) {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken, values, i, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            securityToken = SessionService.getSecurityToken();
                            values = void 0;
                            if (!securityToken) return [3 /*break*/, 2];
                            return [4 /*yield*/, Api.signalsService.getLogValuesByToken(securityToken, filter.toDto(), SessionService.timeOut)];
                        case 1:
                            values = _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, Api.signalsService.getLogValues(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), filter.toDto(), SessionService.timeOut)];
                        case 3:
                            values = _a.sent();
                            _a.label = 4;
                        case 4:
                            for (i = 0; i < values.length; i++) {
                                values[i].EntriesDate = moment(values[i].EntriesDate).toDate();
                            }
                            return [2 /*return*/, values];
                        case 5:
                            error_3 = _a.sent();
                            Logger.handleError(SignalsService)(error_3);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        SignalsService.getPeekLogValues = function (filter, resolution) {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken, values, i, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            securityToken = SessionService.getSecurityToken();
                            values = void 0;
                            if (!securityToken) return [3 /*break*/, 2];
                            return [4 /*yield*/, Api.signalsService.getPeekLogValuesByToken(securityToken, filter.toDto(), resolution, SessionService.timeOut)];
                        case 1:
                            values = _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, Api.signalsService.getPeekLogValues(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), filter.toDto(), resolution, SessionService.timeOut)];
                        case 3:
                            values = _a.sent();
                            _a.label = 4;
                        case 4:
                            for (i = 0; i < values.length; i++) {
                                values[i].EntriesDate = moment(values[i].EntriesDate).toDate();
                            }
                            return [2 /*return*/, values];
                        case 5:
                            error_4 = _a.sent();
                            Logger.handleError(SignalsService)(error_4);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        SignalsService.updateLogValue = function (logId, entryDate, value, value2) {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            securityToken = SessionService.getSecurityToken();
                            if (!securityToken) return [3 /*break*/, 2];
                            return [4 /*yield*/, Api.signalsService.updateLogValueByToken(securityToken, logId, entryDate, value, value2, SessionService.timeOut)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [4 /*yield*/, Api.signalsService.updateLogValue(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), logId, entryDate, value, value2, SessionService.timeOut)];
                        case 3: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        SignalsService.getLastValuesBeforeDate = function (logTags, date) {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            securityToken = SessionService.getSecurityToken();
                            if (!securityToken) return [3 /*break*/, 2];
                            return [4 /*yield*/, Api.signalsService.getLastValuesBeforeDateByToken(securityToken, logTags, date.toMSDateTimeOffset(), SessionService.timeOut)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [4 /*yield*/, Api.signalsService.getLastValuesBeforeDate(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), logTags, date.toMSDateTimeOffset(), SessionService.timeOut)];
                        case 3: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        SignalsService.getLastValuesAfterDate = function (logTags, date) {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            securityToken = SessionService.getSecurityToken();
                            if (!securityToken) return [3 /*break*/, 2];
                            return [4 /*yield*/, Api.signalsService.getLastValuesAfterDateByToken(securityToken, logTags, date.toMSDateTimeOffset(), SessionService.timeOut)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [4 /*yield*/, Api.signalsService.getLastValuesAfterDate(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), logTags, date.toMSDateTimeOffset(), SessionService.timeOut)];
                        case 3: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        SignalsService.getLogStatistics = function (filter) {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            securityToken = SessionService.getSecurityToken();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            if (!securityToken) return [3 /*break*/, 3];
                            return [4 /*yield*/, Api.signalsService.getLogStatisticsByToken(securityToken, filter, SessionService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3: return [4 /*yield*/, Api.signalsService.getLogStatistics(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), filter, SessionService.timeOut)];
                        case 4: return [2 /*return*/, _a.sent()];
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            error_5 = _a.sent();
                            Logger.handleError(SignalsService)(error_5);
                            return [2 /*return*/, []];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        SignalsService.getLogValuesCount = function (filter) {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            securityToken = SessionService.getSecurityToken();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            if (!securityToken) return [3 /*break*/, 3];
                            return [4 /*yield*/, Api.signalsService.getLogValuesCountByToken(securityToken, filter, SessionService.timeOut)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3: return [4 /*yield*/, Api.signalsService.getLogValuesCount(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), filter, SessionService.timeOut)];
                        case 4: return [2 /*return*/, _a.sent()];
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            error_6 = _a.sent();
                            Logger.handleError(SignalsService)(error_6);
                            return [2 /*return*/, 0];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        SignalsService.getSignalNames = function (filter, startIndex, count) {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            securityToken = SessionService.getSecurityToken();
                            if (!securityToken) return [3 /*break*/, 2];
                            return [4 /*yield*/, Api.signalsService.getSignalNamesByToken(securityToken, filter, SymbolicTextsService.currentLanguageId(), startIndex, count, SessionService.timeOut)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [4 /*yield*/, Api.signalsService.getSignalNames(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), filter, SymbolicTextsService.currentLanguageId(), startIndex, count, SessionService.timeOut)];
                        case 3: return [2 /*return*/, _a.sent()];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_7 = _a.sent();
                            Logger.handleError(SignalsService)(error_7);
                            return [2 /*return*/, Promise.resolve(null)];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        SignalsService.getGroupNames = function (filter, startIndex, count) {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            securityToken = SessionService.getSecurityToken();
                            if (!securityToken) return [3 /*break*/, 2];
                            return [4 /*yield*/, Api.signalsService.getGroupNamesByToken(securityToken, filter, SymbolicTextsService.currentLanguageId(), startIndex, count, SessionService.timeOut)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [4 /*yield*/, Api.signalsService.getGroupNames(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), filter, SymbolicTextsService.currentLanguageId(), startIndex, count, SessionService.timeOut)];
                        case 3: return [2 /*return*/, _a.sent()];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_8 = _a.sent();
                            Logger.handleError(SignalsService)(error_8);
                            return [2 /*return*/, Promise.resolve(null)];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        SignalsService.getLogs = function (signalId) {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            securityToken = SessionService.getSecurityToken();
                            if (!securityToken) return [3 /*break*/, 2];
                            return [4 /*yield*/, Api.signalsService.getLogsByToken(securityToken, signalId, SymbolicTextsService.currentLanguageId(), SessionService.timeOut)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [4 /*yield*/, Api.signalsService.getLogs(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), signalId, SymbolicTextsService.currentLanguageId(), SessionService.timeOut)];
                        case 3: return [2 /*return*/, _a.sent()];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_9 = _a.sent();
                            Logger.handleError(SignalsService)(error_9);
                            return [2 /*return*/, Promise.resolve(null)];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        SignalsService.getSignalDefinitions = function (filter, start, count) {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken, error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            securityToken = SessionService.getSecurityToken();
                            if (!securityToken) return [3 /*break*/, 2];
                            return [4 /*yield*/, Api.signalsService.getSignalDefinitionsByToken(securityToken, filter, SymbolicTextsService.currentLanguageId(), start, count, SessionService.timeOut)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [4 /*yield*/, Api.signalsService.getSignalDefinitions(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), filter, SymbolicTextsService.currentLanguageId(), start, count, SessionService.timeOut)];
                        case 3: return [2 /*return*/, _a.sent()];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_10 = _a.sent();
                            Logger.handleError(SignalsService)(error_10);
                            return [2 /*return*/, Promise.resolve(null)];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        SignalsService.getAllSignalNames = function () {
            return __awaiter(this, void 0, void 0, function () {
                var filter, signalNamesBatch, allSignalNames;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!SignalsService.allSignalDeffer) return [3 /*break*/, 5];
                            SignalsService.allSignalDeffer = new Deferred.Deferred();
                            filter = {
                                ServerNames: [],
                                AliasNames: [],
                                GroupIds: []
                            };
                            signalNamesBatch = void 0;
                            allSignalNames = [];
                            _a.label = 1;
                        case 1: return [4 /*yield*/, SignalsService.getSignalNames(filter, SignalsService.allSignalStartIndex, SignalsService.allSignalCount)];
                        case 2:
                            signalNamesBatch = _a.sent();
                            allSignalNames = allSignalNames.concat(signalNamesBatch);
                            SignalsService.allSignalStartIndex += SignalsService.allSignalCount;
                            _a.label = 3;
                        case 3:
                            if (signalNamesBatch.length >= SignalsService.allSignalCount) return [3 /*break*/, 1];
                            _a.label = 4;
                        case 4:
                            SignalsService.allSignalDeffer.resolve(allSignalNames);
                            _a.label = 5;
                        case 5: return [2 /*return*/, SignalsService.allSignalDeffer.promise];
                    }
                });
            });
        };
        SignalsService.readRemoteSignals = function (remoteSignals) {
            return __awaiter(this, void 0, void 0, function () {
                var remoteSignalNames, results, error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            remoteSignalNames = remoteSignals.map(function (x) { return x.name; });
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, Api.signalsService.readSignals(SessionService.sessionId, SessionService.getClientId(), remoteSignalNames)];
                        case 3:
                            results = _a.sent();
                            results.forEach(function (result, index) {
                                remoteSignals[index].value = result.Value;
                                remoteSignals[index].result = result.Result;
                            });
                            return [3 /*break*/, 5];
                        case 4:
                            error_11 = _a.sent();
                            Logger.handleError(SignalsService)(error_11);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        SignalsService.readLocalSignals = function (localSignals) {
            var e_2, _a;
            try {
                for (var localSignals_1 = __values(localSignals), localSignals_1_1 = localSignals_1.next(); !localSignals_1_1.done; localSignals_1_1 = localSignals_1.next()) {
                    var localSignal = localSignals_1_1.value;
                    localSignal.value = SignalsService.getSignal(localSignal.name).value();
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (localSignals_1_1 && !localSignals_1_1.done && (_a = localSignals_1.return)) _a.call(localSignals_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        };
        SignalsService.unregisterQueuedSignals = function (signals) {
            return __awaiter(this, void 0, void 0, function () {
                var signalsToRemove, error_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            signalsToRemove = SignalsService.unregisterClientSignals(signals);
                            if (signalsToRemove.length === 0) {
                                SignalsService.signalsToUnRegister.removeAll();
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, ConnectorService.connect()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, Api.signalsService.unregisterSignals(SessionService.sessionId, SessionService.getClientId(), signalsToRemove)];
                        case 3:
                            _a.sent();
                            SignalsService.signalsToUnRegister.removeAll();
                            return [3 /*break*/, 5];
                        case 4:
                            error_12 = _a.sent();
                            Logger.handleError(SignalsService)(error_12);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        SignalsService.unregisterClientSignals = function (signals) {
            var signalsToRemove = [];
            for (var i = 0; i < signals.length; i++) {
                var requestedSignal = signals[i];
                if (!requestedSignal) {
                    continue;
                }
                var signal = void 0;
                if (_.isString(requestedSignal)) {
                    signal = SignalsService.getRegisteredSignalByNameOrId(requestedSignal);
                }
                else {
                    signal = requestedSignal;
                }
                if (!signal) {
                    continue;
                }
                signal.releaseSubscriber();
                var signalName = signal.signalName();
                if (!signal.hasSubscribers() && SignalsService.getRegisteredSignalByNameOrId(signalName) && !Signals.isLocalSignal(signalName)) {
                    if (signalName && signalName.length) {
                        signalsToRemove.push(signalName);
                    }
                    delete SignalsService.registeredSignals[signalName];
                    SignalsService.registeredSignalList.splice(SignalsService.registeredSignalList.indexOf(signal), 1);
                    SignalsService.allRegisteredSignals.splice(SignalsService.allRegisteredSignals.indexOf(signal), 1);
                }
            }
            return signalsToRemove;
        };
        SignalsService.createUpdateRequest = function (prevRequestId, prevResponseId) {
            if (prevRequestId === void 0) { prevRequestId = 0; }
            if (prevResponseId === void 0) { prevResponseId = 0; }
            var requestId = SignalsService.getNextRequestId(prevRequestId, prevResponseId);
            SignalsService.updateRequest = {
                sessionId: SessionService.sessionId,
                clientId: SessionService.getClientId(),
                requestId: requestId
            };
        };
        SignalsService.getNextRequestId = function (prevRequestId, prevResponseId) {
            if (prevResponseId === 0) {
                return 1;
            }
            if (prevResponseId === prevRequestId) {
                return prevRequestId % 1000 + 1;
            }
            return 0;
        };
        SignalsService.handleWriteResponse = function (response) {
            var e_3, _a;
            if (!response) {
                return {
                    errorMessage: null,
                    exception: null,
                    successful: false
                };
            }
            var errorCode = _.find(response, function (x) {
                return !!x;
            });
            if (!errorCode) {
                return {
                    errorMessage: null,
                    exception: null,
                    successful: true
                };
            }
            else {
                var translation = "";
                try {
                    for (var response_1 = __values(response), response_1_1 = response_1.next(); !response_1_1.done; response_1_1 = response_1.next()) {
                        var errorCode_1 = response_1_1.value;
                        var errorKey = errorCode_1.toString();
                        if (errorKey in ErrorCodeService.signalWriteErrorCodes) {
                            translation += SymbolicTextsService.translate(ErrorCodeService.signalWriteErrorCodes[errorKey])() + "</br>";
                        }
                        else {
                            translation += SymbolicTextsService.translate("I4SCADA_Signal_write_failed")() + "</br>";
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (response_1_1 && !response_1_1.done && (_a = response_1.return)) _a.call(response_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                return {
                    errorMessage: "Code " + errorCode + ": " + translation,
                    exception: null,
                    successful: false
                };
                // ReSharper disable once ImplicitAnyTypeWarning
                //throw `Code ${errorCode}: ${translation}`;
            }
        };
        SignalsService.registerSignals = function () {
            return __awaiter(this, void 0, void 0, function () {
                var signalNames, sessionId, clientId, results, error_13;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            signalNames = SignalsService.signalsToRegister;
                            SignalsService.signalsToRegister = [];
                            if (!signalNames.length) {
                                Logger.info(SignalsService, "Signals are already registered, skipping");
                                return [2 /*return*/];
                            }
                            Logger.info(SignalsService, "Registering signals: " + signalNames);
                            sessionId = SessionService.sessionId;
                            clientId = SessionService.getClientId();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Api.signalsService.registerSignals(sessionId, clientId, signalNames)];
                        case 2:
                            results = _a.sent();
                            SignalsService.onSignalsRegistered(signalNames, results);
                            return [3 /*break*/, 4];
                        case 3:
                            error_13 = _a.sent();
                            Logger.handleError(SignalsService)(error_13);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SignalsService.onSignalsRegistered = function (signalNames, results) {
            var successfull = [];
            var warnings = [];
            var errors = [];
            for (var i = 0; i < signalNames.length; i++) {
                if (results[i] > 0) {
                    warnings.push({
                        signalName: signalNames[i],
                        code: results[i]
                    });
                }
                else if (results[i] < 0) {
                    errors.push({
                        signalName: signalNames[i],
                        code: results[i]
                    });
                }
                else {
                    successfull.push({
                        signalName: signalNames[i],
                        code: results[i]
                    });
                }
            }
            if (successfull.length) {
                Logger.info(SignalsService, SignalsService.buildSignalRegistrationMessage("Successfully registered", successfull));
            }
            if (warnings.length) {
                Logger.warn(SignalsService, SignalsService.buildSignalRegistrationMessage("Encountered warnings when registering", warnings));
            }
            if (errors.length) {
                throw SignalsService.buildSignalRegistrationMessage("Failed to register", errors);
            }
            return true;
        };
        SignalsService.buildSignalRegistrationMessage = function (message, results) {
            var result = message + " " + results.length + " signals:";
            var signalCodes = _.map(results, function (r) { return r.signalName + " (" + r.code + ")"; }).join("\n");
            if (signalCodes.length > 0) {
                result += "\n";
                result += signalCodes;
            }
            return result;
        };
        SignalsService.startGettingUpdates = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!SignalsService.getUpdates) {
                        SignalsService.createUpdateRequest();
                        // noinspection JSIgnoredPromiseFromCall
                        SignalsService.doUpdate();
                    }
                    return [2 /*return*/];
                });
            });
        };
        SignalsService.doUpdate = function () {
            return __awaiter(this, void 0, void 0, function () {
                var request, update, error_14;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            request = SignalsService.updateRequest;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            SignalsService.getUpdates = true;
                            return [4 /*yield*/, Api.signalsService.getUpdates(request.sessionId, request.clientId, request.requestId)];
                        case 2:
                            update = _a.sent();
                            SignalsService.updateSignals(update);
                            return [3 /*break*/, 4];
                        case 3:
                            error_14 = _a.sent();
                            if (!SignalsService.lastUpdateError()) {
                                SignalsService.lastUpdateError(error_14);
                                Logger.handleError(SignalsService)(error_14);
                            }
                            _.delay(function () { return SignalsService.doUpdate(); }, SignalsService.updateInterval);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SignalsService.updateSignals = function (update) {
            SignalsService.lastUpdateError(null);
            if (!update) {
                return;
            }
            var responseId = update.ResponseId;
            SignalsService.updateSignalValues(update.Updates, SignalValueType.Server);
            _.delay(function () {
                SignalsService.createUpdateRequest(SignalsService.updateRequest.requestId, responseId);
                SignalsService.doUpdate();
            }, SignalsService.updateInterval);
        };
        SignalsService.exportLogsValues = function (exportInformation) {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            securityToken = SessionService.getSecurityToken();
                            if (!securityToken) return [3 /*break*/, 2];
                            return [4 /*yield*/, Api.exportService.exportLogsValuesByToken(securityToken, exportInformation, SessionService.timeOut)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [4 /*yield*/, Api.exportService.exportLogsValues(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), exportInformation, SessionService.timeOut)];
                        case 3: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        SignalsService.updateSignalValues = function (updates, signalValueType) {
            var e_4, _a;
            if (!updates)
                return;
            try {
                for (var updates_1 = __values(updates), updates_1_1 = updates_1.next(); !updates_1_1.done; updates_1_1 = updates_1.next()) {
                    var signalUpdate = updates_1_1.value;
                    var signalName = signalUpdate.key;
                    var signalValue = signalUpdate.value;
                    var signal = SignalsService.getRegisteredSignalByNameOrId(signalName) || SignalsService.getSignal(signalName, false);
                    if (!signal) {
                        continue;
                    }
                    signal.setValue(signalValue, signalValueType);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (updates_1_1 && !updates_1_1.done && (_a = updates_1.return)) _a.call(updates_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
        };
        SignalsService.getSignalsWithAlarmInfo = function (filter, start, count) {
            return __awaiter(this, void 0, void 0, function () {
                var securityToken, error_15;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            securityToken = SessionService.getSecurityToken();
                            if (!securityToken) return [3 /*break*/, 2];
                            return [4 /*yield*/, Api.signalsService.getSignalsWithAlarmInfoByToken(securityToken, filter, SymbolicTextsService.currentLanguageId(), start, count, SessionService.timeOut)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [4 /*yield*/, Api.signalsService.getSignalsWithAlarmInfo(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), filter, SymbolicTextsService.currentLanguageId(), start, count, SessionService.timeOut)];
                        case 3: return [2 /*return*/, _a.sent()];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_15 = _a.sent();
                            Logger.handleError(SignalsService)(error_15);
                            return [2 /*return*/, Promise.resolve(null)];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        SignalsService.updateInterval = 800;
        SignalsService.registeredSignalList = [];
        SignalsService.allRegisteredSignals = [];
        SignalsService.signalsToRegister = [];
        SignalsService.lastUpdateError = ko.observable(null);
        SignalsService.allSignalStartIndex = 0;
        SignalsService.allSignalCount = 100000;
        SignalsService.registeredSignals = [];
        SignalsService.signalsToUnRegister = ko.observableArray([]);
        SignalsService.queuedSignalsToUnRegister = ko.computed(function () {
            return SignalsService.signalsToUnRegister();
        }).extend({ throttle: 250 });
        SignalsService.subscription = SignalsService.queuedSignalsToUnRegister.subscribe(function () { return SignalsService.unregisterQueuedSignals(SignalsService.queuedSignalsToUnRegister()); }, SignalsService);
        SignalsService.noSignal = new NullSignal();
        return SignalsService;
    }());
    return SignalsService;
});
//# sourceMappingURL=signalsService.js.map