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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
define(["require", "exports", "./signalsService", "./i4/i4Connector", "./scadaConnector", "./connectorEnums", "./logger", "./models/signals", "./models/_signal"], function (require, exports, SignalsService, i4Connector, ScadaConnector, ConnectorEnums, Logger, Signals, SignalsInterface) {
    "use strict";
    var SignalValueType = SignalsInterface.SignalValueType;
    // ReSharper disable once ImplicitAnyTypeWarning
    // HACK - this makes the connector enums available globally
    Object.keys(ConnectorEnums).forEach(function (key) { return window[key] = ConnectorEnums[key]; });
    var Connector = /** @class */ (function () {
        function Connector() {
            var _this = this;
            this.disableSignalBrowser = window.disableSignalBrowser;
            //#region Logging & Error handling
            this.handleError = Logger.handleError;
            this.info = Logger.info;
            this.warn = Logger.warn;
            this.error = Logger.error;
            this.signalBufferIsEmpty = ko.pureComputed(function () {
                return _this.scadaConnector.signalBufferIsEmpty();
            });
            //#region Session
            this.currentLoggedInUser = ko.pureComputed(function () { return _this.scadaConnector.currentLoggedInUser(); });
            this.currentUserProjectAuthorizations = ko.pureComputed(function () { return _this.scadaConnector.currentUserProjectAuthorizations(); });
            this.currentUserSystemAuthorizations = ko.pureComputed(function () { return _this.scadaConnector.currentUserSystemAuthorizations(); });
            //#endregion Session
            //#region Signals
            this.currentLanguageId = ko.pureComputed(function () { return _this.scadaConnector.currentLanguageId(); });
            this.lastUpdateError = ko.pureComputed({
                read: function () { return _this.scadaConnector.lastUpdateError(); }
            });
            this.updateInterval = ko.pureComputed({
                read: function () { return _this.scadaConnector.updateInterval(); },
                write: function (value) { return _this.scadaConnector.updateInterval(value); }
            });
            //#region Security
            this.timeOut = ko.pureComputed({
                read: function () { return _this.scadaConnector.timeOut(); },
                write: function (value) { return _this.scadaConnector.timeOut(value); }
            });
            this.scadaConnector = new ScadaConnector();
            if (window.usei4Connector) {
                this.i4Connector = new i4Connector();
            }
        }
        Connector.getRemoteSignalValues = function (signals) {
            var e_1, _a;
            var remoteSignals = {};
            try {
                for (var _b = __values(signals.remoteSignals), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var remoteSignal = _c.value;
                    remoteSignals[remoteSignal.name] = remoteSignal.value;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return remoteSignals;
        };
        Object.defineProperty(Connector.prototype, "connector", {
            get: function () {
                if (window.usei4Connector) {
                    return this.i4Connector;
                }
                return this.scadaConnector;
            },
            enumerable: false,
            configurable: true
        });
        Connector.prototype.getCurrentLoggedInUser = function () {
            return this.scadaConnector.getCurrentLoggedInUser();
        };
        Connector.prototype.setSecurityToken = function (token) {
            this.scadaConnector.setSecurityToken(token);
        };
        Connector.prototype.getSignal = function (name, shouldAddSubscriber) {
            if (shouldAddSubscriber === void 0) { shouldAddSubscriber = true; }
            return this.connector.getSignal(name, shouldAddSubscriber);
        };
        Connector.prototype.unregisterSignals = function () {
            var signals = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                signals[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (_a = this.connector).unregisterSignals.apply(_a, __spread(signals))];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Connector.prototype.getOnlineUpdates = function () {
            return this.connector.getOnlineUpdates();
        };
        Connector.prototype.readSignals = function (signalNames) {
            return this.connector.readSignals(signalNames);
        };
        Connector.prototype.writeSignals = function (signalValues) {
            return __awaiter(this, void 0, void 0, function () {
                var signals, remoteSignals;
                return __generator(this, function (_a) {
                    signals = Signals.fromSignalValues(signalValues);
                    this.writeLocalSignals(signals.localSignals);
                    if (!signals.remoteSignals.length) {
                        return [2 /*return*/, {
                                successful: true,
                                errorMessage: null,
                                exception: null
                            }];
                    }
                    remoteSignals = Connector.getRemoteSignalValues(signals);
                    return [2 /*return*/, this.connector.writeSignals(remoteSignals)];
                });
            });
        };
        Connector.prototype.writeSignalsSecure = function (userPassword, signalValues) {
            return __awaiter(this, void 0, void 0, function () {
                var signals, remoteSignals, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            signals = Signals.fromSignalValues(signalValues);
                            this.writeLocalSignals(signals.localSignals);
                            if (!signals.remoteSignals.length) {
                                return [2 /*return*/, signals.localSignals.map(function (x) { return x.result; })];
                            }
                            remoteSignals = Connector.getRemoteSignalValues(signals);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.scadaConnector.writeSignalsSecure(userPassword, remoteSignals)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_1 = _a.sent();
                            this.error(this, "{0} {1}".format(this.translate("I4SCADA_WriteSignal_operation_error")(), error_1.responseJSON.Message));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        Connector.prototype.getSignalDefinition = function (signalName) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (Signals.isLocalSignal(signalName)) {
                        return [2 /*return*/, this.getLocalSignalDefinition(signalName)];
                    }
                    return [2 /*return*/, this.connector.getSignalDefinition(signalName)];
                });
            });
        };
        Connector.prototype.getLocalSignalDefinition = function (signalName) {
            return {
                ID: undefined,
                Name: signalName,
                Alias: signalName,
                Description: "",
                Unit: "",
                Active: true,
                Maximum: undefined,
                Minimum: undefined
            };
        };
        Connector.prototype.getSignalDefinitions = function (signalNames) {
            return __awaiter(this, void 0, void 0, function () {
                var signals, remoteSignalNames, localDefinitions, remoteDefinitions, definitionMap;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            signals = Signals.fromSignalNames(signalNames);
                            remoteSignalNames = signals.remoteSignals.map(function (x) { return x.name; });
                            localDefinitions = signals.localSignals.map(function (x) { return _this.getLocalSignalDefinition(x.name); });
                            return [4 /*yield*/, this.connector.getSignalDefinitions(remoteSignalNames)];
                        case 1:
                            remoteDefinitions = _a.sent();
                            definitionMap = {};
                            localDefinitions.forEach(function (x, index) { return definitionMap[signals.localSignals[index].name] = x; });
                            remoteDefinitions.forEach(function (x, index) { return definitionMap[signals.remoteSignals[index].name] = x; });
                            return [2 /*return*/, signalNames.map(function (x) { return definitionMap[x]; })];
                    }
                });
            });
        };
        Connector.prototype.getAllSignalDefinitions = function () {
            return this.connector.getAllSignalDefinitions();
        };
        Connector.prototype.getSignalDefinitionsByPatterns = function (patterns) {
            return this.connector.getSignalDefinitionsByPatterns(patterns);
        };
        Connector.prototype.isSignalDefined = function (signalName) {
            if (!signalName)
                return Promise.resolve(false);
            var signal = this.getSignal(signalName);
            if (signal.definition() || signal.id() || signal.hasValue()) {
                return Promise.resolve(true);
            }
            else {
                return this.getSignalDefinition(signalName).then(function (definition) {
                    return definition !== null;
                });
            }
        };
        Connector.prototype.getLogIds = function (signalLogTags) {
            return this.scadaConnector.getLogIds(signalLogTags);
        };
        Connector.prototype.getLogValues = function (filter) {
            return this.scadaConnector.getLogValues(filter);
        };
        Connector.prototype.getLogValuesCount = function (filter) {
            return this.scadaConnector.getLogValuesCount(filter);
        };
        Connector.prototype.getPeekLogValues = function (filter, resolution) {
            return this.scadaConnector.getPeekLogValues(filter, resolution);
        };
        Connector.prototype.exportLogsValues = function (exportInformation) {
            return this.scadaConnector.exportLogsValues(exportInformation);
        };
        //#endregion Signals
        Connector.prototype.updateLogValue = function (logId, entryDate, value, value2) {
            return this.scadaConnector.updateLogValue(logId, entryDate, value, value2);
        };
        Connector.prototype.getLastValuesBeforeDate = function (logTags, date) {
            return this.scadaConnector.getLastValuesBeforeDate(logTags, date);
        };
        Connector.prototype.getLastValuesAfterDate = function (logTags, date) {
            return this.scadaConnector.getLastValuesAfterDate(logTags, date);
        };
        Connector.prototype.getLogStatistics = function (filter) {
            return this.scadaConnector.getLogStatistics(filter);
        };
        Connector.prototype.getAllSignals = function () {
            return this.scadaConnector.getAllSignals();
        };
        Connector.prototype.getLogs = function (signalId) {
            return this.scadaConnector.getLogs(signalId);
        };
        Connector.prototype.login = function (userName, password, isDomainUser) {
            return this.scadaConnector.login(userName, password, isDomainUser);
        };
        Connector.prototype.logout = function () {
            return this.scadaConnector.logout();
        };
        Connector.prototype.loginWindowsUser = function () {
            return this.scadaConnector.loginWindowsUser();
        };
        Connector.prototype.getCallerAccountDetails = function () {
            return this.scadaConnector.getCallerAccountDetails();
        };
        //#endregion Security
        //#region AlarmService
        Connector.prototype.getCurrentUserAuthorizations = function () {
            return this.scadaConnector.getCurrentUserAuthorizations();
        };
        Connector.prototype.checkProjectAuthorizations = function (authorizations) {
            return this.scadaConnector.checkProjectAuthorizations(authorizations);
        };
        Connector.prototype.checkSystemAuthorizations = function (authorizations) {
            return this.scadaConnector.checkSystemAuthorizations(authorizations);
        };
        Connector.prototype.getOnlineAlarms = function (filter, updateRate) {
            return this.scadaConnector.getOnlineAlarms(filter, updateRate);
        };
        Connector.prototype.getOfflineAlarms = function (filter) {
            return this.scadaConnector.getOfflineAlarms(filter);
        };
        Connector.prototype.getAlarmGroups = function (languageId) {
            return this.scadaConnector.getAlarmGroups(languageId);
        };
        Connector.prototype.getAlarmTypes = function (languageId) {
            return this.scadaConnector.getAlarmTypes(languageId);
        };
        Connector.prototype.getAlarms = function (alarmIds, languageId) {
            return this.scadaConnector.getAlarms(alarmIds, languageId);
        };
        Connector.prototype.acknowledgeAlarms = function (alarmIds, comment) {
            return this.scadaConnector.acknowledgeAlarms(alarmIds, comment);
        };
        Connector.prototype.getExtendedAlarmProperties = function () {
            return this.scadaConnector.getExtendedAlarmProperties();
        };
        //#endregion AlarmService
        Connector.prototype.acknowledgeAllAlarms = function (comment) {
            return this.scadaConnector.acknowledgeAllAlarms(comment);
        };
        Connector.prototype.acknowledgeAllGoneAlarms = function (comment) {
            return this.scadaConnector.acknowledgeAllGoneAlarms(comment);
        };
        Connector.prototype.acknowledgeAlarmsByGroup = function (groupName, comment) {
            return this.scadaConnector.acknowledgeAlarmsByGroup(groupName, comment);
        };
        Connector.prototype.setAlarmState = function (alarmId, state, reactivation) {
            return this.scadaConnector.setAlarmState(alarmId, state, reactivation);
        };
        //#region SymbolicTextsService
        Connector.prototype.getLanguagesAsync = function () {
            return this.scadaConnector.getLanguagesAsync();
        };
        Connector.prototype.setLanguageAsync = function (languageId) {
            return this.scadaConnector.setLanguageAsync(languageId);
        };
        //#endregion SymbolicTextsService
        Connector.prototype.translate = function (symbolicTextName) {
            return this.scadaConnector.translate(symbolicTextName);
        };
        Connector.prototype.getGenericCulture = function (lcid) {
            return this.scadaConnector.getGenericCulture(lcid);
        };
        Connector.prototype.getNumeralLanguage = function (lcid) {
            return this.scadaConnector.getNumeralLanguage(lcid);
        };
        Connector.prototype.getAmchartsLanguage = function (lcid) {
            return this.scadaConnector.getAmchartsLanguage(lcid);
        };
        //#endregion
        Connector.prototype.getD3Language = function (lcid) {
            return this.scadaConnector.getD3Language(lcid);
        };
        //#endregion
        //#region LogBookService
        Connector.prototype.getLogbookEntries = function (filter) {
            return this.scadaConnector.getLogbookEntries(filter);
        };
        Connector.prototype.getLogbookTopics = function () {
            return this.scadaConnector.getLogbookTopics();
        };
        Connector.prototype.addLogbookEntry = function (logBookEntry) {
            return this.scadaConnector.addLogbookEntry(logBookEntry);
        };
        //#region OperationDiaryService
        Connector.prototype.getWFEvents = function (filter) {
            return this.scadaConnector.getWFEvents(filter);
        };
        //#endregion
        //#region ControlConfigurationsService
        Connector.prototype.getControlConfigurationsByNamespace = function (configurationNamespace, type) {
            return this.scadaConnector.getControlConfigurationsByNamespace(configurationNamespace, type);
        };
        Connector.prototype.getControlConfigurationByName = function (name, configurationNamespace, type) {
            return this.scadaConnector.getControlConfigurationByName(name, configurationNamespace, type);
        };
        Connector.prototype.getControlConfigurationThatStartWithName = function (name, configurationNamespace, type) {
            return this.scadaConnector.getControlConfigurationThatStartWithName(name, configurationNamespace, type);
        };
        Connector.prototype.deleteControlConfiguration = function (id) {
            return this.scadaConnector.deleteControlConfiguration(id);
        };
        Connector.prototype.insertControlConfiguration = function (controlConfiguration) {
            return this.scadaConnector.insertControlConfiguration(controlConfiguration);
        };
        Connector.prototype.updateControlConfiguration = function (controlConfiguration) {
            return this.scadaConnector.updateControlConfiguration(controlConfiguration);
        };
        Connector.prototype.getControlConfigurationsByName = function (configurationName, configurationNamespace, type) {
            return this.scadaConnector.getControlConfigurationsByName(configurationName, configurationNamespace, type);
        };
        Connector.prototype.getControlConfigurationById = function (id) {
            return this.scadaConnector.getControlConfigurationById(id);
        };
        Connector.prototype.getControlConfigurationNameCount = function (name, configurationNamespace, type, excludeId) {
            return this.scadaConnector.getControlConfigurationNameCount(name, configurationNamespace, type, excludeId);
        };
        //#endregion
        //#region SignalsBufferService
        Connector.prototype.writeSignalsToBuffer = function (signalValues) {
            return this.scadaConnector.writeSignalsToBuffer(signalValues);
        };
        Connector.prototype.writeSignalsFromBuffer = function () {
            return this.scadaConnector.writeSignalsFromBuffer();
        };
        Connector.prototype.writeSignalsFromBufferSecure = function (userPassword) {
            return this.scadaConnector.writeSignalsFromBufferSecure(userPassword);
        };
        Connector.prototype.existSignalInBuffer = function (signalName) {
            return this.scadaConnector.existSignalInBuffer(signalName);
        };
        Connector.prototype.existSignalsInBuffer = function (signalNames) {
            return this.scadaConnector.existSignalsInBuffer(signalNames);
        };
        Connector.prototype.clearSignalBuffer = function () {
            return this.scadaConnector.clearSignalBuffer();
        };
        Connector.prototype.getSignalsFromBuffer = function () {
            return this.scadaConnector.getSignalsFromBuffer();
        };
        //!!! Neu "clearSignalsFromBuffer", entwickelt am 29.08.2017 von amueller@coppenrath-wiese.de
        Connector.prototype.clearSignalsFromBuffer = function (signalNames) {
            return this.scadaConnector.clearSignalsFromBuffer(signalNames);
        };
        Connector.prototype.readSignalsFromBuffer = function (signalNames) {
            return this.scadaConnector.readSignalsFromBuffer(signalNames);
        };
        //!!! Neu "Ermittle Signale", entwickelt am 1.11.2019 von amueller -----------------------------
        Connector.prototype.getAllRegisteredSignals = function () {
            var sig = SignalsService.allRegisteredSignals;
            return sig;
        };
        Connector.prototype.getAllListenRegisteredSignals = function () {
            var sig = this.scadaConnector.registerSignalList;
            return sig;
        };
        Connector.prototype.startListenRegisterTable = function () {
            return this.scadaConnector.startListenRegisterTable();
        };
        Connector.prototype.stopListenRegisterTable = function () {
            return this.scadaConnector.stopListenRegisterTable();
        };
        Connector.prototype.clearListenRegisterTable = function () {
            return this.scadaConnector.clearListenRegisterTable();
        };
        // !!! Ende "Ermittle Signale"------------------------------------------------------------------
        //#region UserService
        Connector.prototype.changeUserPassword = function (affectedUserId, newPassword) {
            return this.scadaConnector.changeUserPassword(affectedUserId, newPassword);
        };
        //endregion
        Connector.prototype.changeCurrentUserPassword = function (currentPassword, newPassword) {
            return this.scadaConnector.changeCurrentUserPassword(currentPassword, newPassword);
        };
        Connector.prototype.getAllUsers = function () {
            return this.scadaConnector.getAllUsers();
        };
        /**
         * Writes values to the local signals
         * @param {SignalValueData[]} localSignals
         */
        Connector.prototype.writeLocalSignals = function (localSignals) {
            var e_2, _a;
            try {
                for (var localSignals_1 = __values(localSignals), localSignals_1_1 = localSignals_1.next(); !localSignals_1_1.done; localSignals_1_1 = localSignals_1.next()) {
                    var localSignal = localSignals_1_1.value;
                    var signal = this.getSignal(localSignal.name, false);
                    signal.setValue(localSignal.value, SignalValueType.Server);
                    localSignal.result = 0;
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
        return Connector;
    }());
    return Connector;
});
//# sourceMappingURL=connector.js.map