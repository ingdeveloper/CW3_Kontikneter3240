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
define(["require", "exports", "./signalsService", "./securityService", "./alarmsService", "./symbolicTextsService", "./logbookService", "./operationDiaryService", "./sessionService", "./logger", "./connectorEnums", "./controlConfigurationsService", "./configurationsService", "./signalDefinitionsService", "./signalsBufferService", "./usersService", "./connectorBase", "./deferred"], function (require, exports, SignalsService, SecurityService, AlarmsService, SymbolicTextsService, LogBookService, OperationDiaryService, SessionService, Logger, ConnectorEnums, ControlConfigurationsService, ConfigurationsService, SignalDefinitionsService, SignalsBufferService, UserService, ConnectorBase, deferred_1) {
    "use strict";
    // ReSharper disable once ImplicitAnyTypeWarning
    // HACK - this makes the connector enums available globally
    Object.keys(ConnectorEnums).forEach(function (key) { return window[key] = ConnectorEnums[key]; });
    var ScadaConnector = /** @class */ (function (_super) {
        __extends(ScadaConnector, _super);
        //#endregion Session
        function ScadaConnector() {
            var _this = _super.call(this) || this;
            // !!! Neu Liste erstellen, welche Signale mit getSignal angelegt wurden; amueller 14.11.2019
            _this.registerSignalList = [];
            _this.runRegisterSignal = false;
            // ------------------------------------------------------------------------------------------
            //#region Session
            _this.currentLoggedInUser = ko.pureComputed(function () { return SessionService.currentLoggedInUser(); });
            _this.currentUserProjectAuthorizations = ko.pureComputed(function () { return SessionService.currentUserProjectAuthorizations(); });
            _this.currentUserSystemAuthorizations = ko.pureComputed(function () { return SessionService.currentUserSystemAuthorizations(); });
            _this.currentLanguageId = ko.pureComputed(function () { return SymbolicTextsService.currentLanguageId(); });
            //#region Signals
            _this.lastUpdateError = ko.pureComputed({
                read: function () { return SignalsService.lastUpdateError(); }
            });
            _this.updateInterval = ko.pureComputed({
                read: function () { return SignalsService.updateInterval; },
                write: function (value) { return SignalsService.updateInterval = value; }
            });
            //#endregion Signals
            //#region Security
            _this.timeOut = ko.pureComputed({
                read: function () { return SecurityService.timeOut; },
                write: function (value) { return SecurityService.timeOut = value; }
            });
            //#endregion
            //#region Logging & Error handling 
            _this.handleError = Logger.handleError;
            _this.info = Logger.info;
            _this.warn = Logger.warn;
            _this.error = Logger.error;
            _this.signalBufferIsEmpty = ko.computed(function () {
                return SignalsBufferService.bufferIsEmpty();
            });
            _this.getClientSettings();
            return _this;
        }
        ScadaConnector.prototype.getSignal = function (name, shouldAddSubscriber) {
            if (shouldAddSubscriber === void 0) { shouldAddSubscriber = true; }
            var signalDeclaration = this.extractI4SignalDeclaration(name);
            if (this.runRegisterSignal)
                this.registerSignalList.push(name); //NEU amueller; Signal-Liste erweitern
            return SignalsService.getSignal(signalDeclaration.signalName, shouldAddSubscriber);
        };
        ScadaConnector.prototype.unregisterSignals = function () {
            var signals = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                signals[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (_.isArray(signals)) {
                        // handles calls with an array argument instead of params
                        signals = _.flatten(signals, true);
                    }
                    return [2 /*return*/, SignalsService.unregisterSignals(signals)];
                });
            });
        };
        ScadaConnector.prototype.getOnlineUpdates = function () {
            return SignalsService.getOnlineUpdates();
        };
        ScadaConnector.prototype.readSignals = function (signalNames) {
            return SignalsService.readSignals(signalNames);
        };
        ScadaConnector.prototype.writeSignals = function (signalValues) {
            return SignalsService.writeSignals(signalValues);
        };
        ScadaConnector.prototype.writeSignalsSecure = function (userPassword, signalValues) {
            return SignalsService.writeSignalsSecure(userPassword, signalValues);
        };
        ScadaConnector.prototype.getSignalDefinition = function (signalName) {
            return SignalDefinitionsService.getDefinition(signalName);
        };
        ScadaConnector.prototype.getSignalDefinitions = function (signalNames) {
            return SignalDefinitionsService.getDefinitions(signalNames);
        };
        ScadaConnector.prototype.getAllSignalDefinitions = function () {
            return SignalDefinitionsService.getAllDefinitions();
        };
        ScadaConnector.prototype.getSignalDefinitionsByPatterns = function (patterns, onlyActive) {
            if (onlyActive === void 0) { onlyActive = true; }
            return SignalDefinitionsService.getSignalsDefinitionsByPatterns(patterns, onlyActive);
        };
        ScadaConnector.prototype.getLogIds = function (signalLogTags) {
            return SignalsService.getLogIds(signalLogTags);
        };
        ScadaConnector.prototype.getLogValues = function (filter) {
            return SignalsService.getLogValues(filter);
        };
        ScadaConnector.prototype.getLogValuesCount = function (filter) {
            return SignalsService.getLogValuesCount(filter);
        };
        ScadaConnector.prototype.getPeekLogValues = function (filter, resolution) {
            return SignalsService.getPeekLogValues(filter, resolution);
        };
        ScadaConnector.prototype.updateLogValue = function (logId, entryDate, value, value2) {
            return SignalsService.updateLogValue(logId, entryDate, value, value2);
        };
        ScadaConnector.prototype.getLastValuesBeforeDate = function (logTags, date) {
            return SignalsService.getLastValuesBeforeDate(logTags, date);
        };
        ScadaConnector.prototype.getLastValuesAfterDate = function (logTags, date) {
            return SignalsService.getLastValuesAfterDate(logTags, date);
        };
        ScadaConnector.prototype.getLogStatistics = function (filter) {
            return SignalsService.getLogStatistics(filter);
        };
        ScadaConnector.prototype.getAllSignals = function () {
            return SignalsService.getAllSignalNames();
        };
        ScadaConnector.prototype.getLogs = function (signalId) {
            return SignalsService.getLogs(signalId);
        };
        ScadaConnector.prototype.exportLogsValues = function (exportInformation) {
            return SignalsService.exportLogsValues(exportInformation);
        };
        ScadaConnector.prototype.login = function (userName, password, isDomainUser) {
            var _this = this;
            return SecurityService.login(userName, password, isDomainUser)
                .then(function () { return _this.getCurrentUserAuthorizations(); });
        };
        ScadaConnector.prototype.logout = function () {
            return SecurityService.logout();
        };
        ScadaConnector.prototype.getCurrentLoggedInUser = function () {
            return SessionService.getCurrentLoggedInUser();
        };
        ScadaConnector.prototype.setSecurityToken = function (token) {
            SessionService.setSecurityToken(token);
        };
        ScadaConnector.prototype.getCurrentUserAuthorizations = function () {
            return SessionService.getCurrentUserAuthorizations();
        };
        ScadaConnector.prototype.checkProjectAuthorizations = function (authorizations) {
            return SecurityService.checkProjectAuthorizations(authorizations);
        };
        ScadaConnector.prototype.checkSystemAuthorizations = function (authorizations) {
            return SecurityService.checkSystemAuthorizations(authorizations);
        };
        ScadaConnector.prototype.loginWindowsUser = function () {
            var _this = this;
            return SecurityService.loginWindowsUser()
                .then(function () { return _this.getCurrentUserAuthorizations(); });
        };
        ScadaConnector.prototype.getCallerAccountDetails = function () {
            return SecurityService.getCallerAccountDetails();
        };
        //#endregion Security
        //#region AlarmService
        ScadaConnector.prototype.getOnlineAlarms = function (filter, updateRate) {
            return AlarmsService.getOnlineAlarms(filter, updateRate);
        };
        ScadaConnector.prototype.getOfflineAlarms = function (filter) {
            return AlarmsService.getOfflineAlarms(filter);
        };
        ScadaConnector.prototype.getAlarmGroups = function (languageId) {
            return AlarmsService.getAlarmGroups(languageId);
        };
        ScadaConnector.prototype.getAlarmTypes = function (languageId) {
            return AlarmsService.getAlarmTypes(languageId);
        };
        ScadaConnector.prototype.getAlarms = function (alarmIds, languageId) {
            return AlarmsService.getAlarms(alarmIds, languageId);
        };
        ScadaConnector.prototype.acknowledgeAlarms = function (alarmIds, comment) {
            return AlarmsService.acknowledgeAlarms(alarmIds, comment);
        };
        ScadaConnector.prototype.acknowledgeAllAlarms = function (comment) {
            return AlarmsService.acknowledgeAllAlarms(comment);
        };
        ScadaConnector.prototype.acknowledgeAllGoneAlarms = function (comment) {
            return AlarmsService.acknowledgeAllGoneAlarms(comment);
        };
        ScadaConnector.prototype.acknowledgeAlarmsByGroup = function (groupName, comment) {
            return AlarmsService.acknowledgeAlarmsByGroup(groupName, comment);
        };
        ScadaConnector.prototype.setAlarmState = function (alarmId, state, reactivation) {
            return AlarmsService.setAlarmState(alarmId, state, reactivation);
        };
        ScadaConnector.prototype.getExtendedAlarmProperties = function () {
            return AlarmsService.getExtendedAlarmProperties();
        };
        //#endregion AlarmService
        //#region SymbolicTextsService
        ScadaConnector.prototype.getLanguagesAsync = function () {
            return SymbolicTextsService.getLanguagesAsync();
        };
        ScadaConnector.prototype.setLanguageAsync = function (languageId) {
            return SymbolicTextsService.setLanguageAsync(languageId);
        };
        ScadaConnector.prototype.translate = function (symbolicTextName) {
            return SymbolicTextsService.translate(symbolicTextName);
        };
        ScadaConnector.prototype.getGenericCulture = function (lcid) {
            return SymbolicTextsService.getGenericCulture(lcid);
        };
        ScadaConnector.prototype.getNumeralLanguage = function (lcid) {
            return SymbolicTextsService.getNumeralLanguage(lcid);
        };
        ScadaConnector.prototype.getD3Language = function (lcid) {
            return SymbolicTextsService.getD3Language(lcid);
        };
        ScadaConnector.prototype.getAmchartsLanguage = function (lcid) {
            return SymbolicTextsService.getAmchartsLanguage(lcid);
        };
        //#endregion SymbolicTextsService
        //#region LogBookService
        ScadaConnector.prototype.getLogbookEntries = function (filter) {
            return LogBookService.getLogbookEntries(filter);
        };
        ScadaConnector.prototype.getLogbookTopics = function () {
            return LogBookService.getLogbookTopics();
        };
        ScadaConnector.prototype.addLogbookEntry = function (logBookEntry) {
            return LogBookService.addLogbookEntry(logBookEntry);
        };
        //#endregion
        //#region OperationDiaryService
        ScadaConnector.prototype.getWFEvents = function (filter) {
            return OperationDiaryService.getWFEvents(filter);
        };
        //#endregion
        //#region ControlConfigurationsService
        ScadaConnector.prototype.getControlConfigurationsByNamespace = function (configurationNamespace, type) {
            return ControlConfigurationsService.getControlConfigurationsByNamespace(configurationNamespace, type);
        };
        ScadaConnector.prototype.getControlConfigurationByName = function (name, configurationNamespace, type) {
            return ControlConfigurationsService.getControlConfigurationByName(name, configurationNamespace, type);
        };
        ScadaConnector.prototype.getControlConfigurationThatStartWithName = function (name, configurationNamespace, type) {
            return ControlConfigurationsService.getControlConfigurationThatStartWithName(name, configurationNamespace, type);
        };
        ScadaConnector.prototype.deleteControlConfiguration = function (id) {
            return ControlConfigurationsService.deleteControlConfiguration(id);
        };
        ScadaConnector.prototype.insertControlConfiguration = function (controlConfiguration) {
            return ControlConfigurationsService.insertControlConfiguration(controlConfiguration);
        };
        ScadaConnector.prototype.updateControlConfiguration = function (controlConfiguration) {
            return ControlConfigurationsService.updateControlConfiguration(controlConfiguration);
        };
        ScadaConnector.prototype.getControlConfigurationsByName = function (configurationName, configurationNamespace, type) {
            return ControlConfigurationsService.getControlConfigurationByName(configurationName, configurationNamespace, type);
        };
        ScadaConnector.prototype.getControlConfigurationById = function (id) {
            return ControlConfigurationsService.getControlConfigurationById(id);
        };
        ScadaConnector.prototype.getControlConfigurationNameCount = function (name, configurationNamespace, type, excludeId) {
            return ControlConfigurationsService.getControlConfigurationNameCount(name, configurationNamespace, type, excludeId);
        };
        //#endregion
        //#region SignalsBufferService
        ScadaConnector.prototype.writeSignalsToBuffer = function (signalValues) {
            return SignalsBufferService.writeSignalsToBuffer(signalValues);
        };
        ScadaConnector.prototype.writeSignalsFromBuffer = function () {
            return __awaiter(this, void 0, void 0, function () {
                var erg;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, SignalsBufferService.writeSignalsFromBuffer()];
                        case 1:
                            erg = _a.sent();
                            return [2 /*return*/, erg];
                    }
                });
            });
        };
        ScadaConnector.prototype.writeSignalsFromBufferSecure = function (userPassword) {
            return SignalsBufferService.writeSignalsFromBufferSecure(userPassword);
        };
        ScadaConnector.prototype.existSignalInBuffer = function (signalName) {
            return SignalsBufferService.existSignalInBuffer(signalName);
        };
        ScadaConnector.prototype.existSignalsInBuffer = function (signalNames) {
            return SignalsBufferService.existSignalsInBuffer(signalNames);
        };
        ScadaConnector.prototype.clearSignalBuffer = function () {
            return SignalsBufferService.clearSignalBuffer();
        };
        ScadaConnector.prototype.getSignalsFromBuffer = function () {
            return SignalsBufferService.getSignalsFromBuffer();
        };
        ScadaConnector.prototype.readSignalsFromBuffer = function (signalNames) {
            return SignalsBufferService.readSignals(signalNames);
        };
        //!!! Neu "clearSignalsFromBuffer", entwickelt am 29.08.2017 von amueller@coppenrath-wiese.de
        ScadaConnector.prototype.clearSignalsFromBuffer = function (signalNames) {
            return SignalsBufferService.clearSignalsFromBuffer(signalNames);
        };
        //!!! Neu "Ermittle Signale", entwickelt am 1.11.2019 von amueller@coppenrath-wiese.de
        ScadaConnector.prototype.startListenRegisterTable = function () {
            console.log("%cstartListenRegisterTable()", "background-color:orange");
            this.runRegisterSignal = true;
        };
        ScadaConnector.prototype.stopListenRegisterTable = function () {
            console.log("%cstopListenRegisterTable()", "background-color:orange");
            this.runRegisterSignal = false;
        };
        ScadaConnector.prototype.clearListenRegisterTable = function () {
            console.log("%cclearListenRegisterTable()", "background-color:orange");
            this.registerSignalList = []; //lösche alle Einträge
        };
        //---- Ende "Ermittle Signale" --------------------------------------------------------
        //endregion
        //#region UserService
        ScadaConnector.prototype.changeUserPassword = function (affectedUserId, newPassword) {
            return UserService.changeUserPassword(affectedUserId, newPassword);
        };
        ScadaConnector.prototype.changeCurrentUserPassword = function (currentPassword, newPassword) {
            return UserService.changeCurrentUserPassword(currentPassword, newPassword);
        };
        ScadaConnector.prototype.getAllUsers = function () {
            return UserService.getAllUsers();
        };
        //#endregion
        ScadaConnector.prototype.getClientSettings = function () {
            var _this = this;
            if (ScadaConnector.clientSettings)
                return;
            ScadaConnector.clientSettings = new deferred_1.Deferred();
            ConfigurationsService.getClientMachineSettings().then(function (dto) {
                ScadaConnector.clientSettings.resolve(dto);
                var clientConfiguration = ConnectorBase.getOrCreateClientConfiguration();
                if (dto) {
                    clientConfiguration.useVirtualKeyboard = dto.HasVirtualKeyboard;
                    clientConfiguration.updateRate = dto.UpdateRate;
                }
                _this.updateInterval(clientConfiguration.updateRate);
            });
        };
        return ScadaConnector;
    }(ConnectorBase));
    return ScadaConnector;
});
//# sourceMappingURL=scadaConnector.js.map