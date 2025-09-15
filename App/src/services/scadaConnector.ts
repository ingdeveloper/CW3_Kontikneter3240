import SignalsService = require("./signalsService");
import SecurityService = require("./securityService");
import AlarmsService = require("./alarmsService");
import SymbolicTextsService = require("./symbolicTextsService");
import LogBookService = require("./logbookService");
import OperationDiaryService = require("./operationDiaryService");
import SignalLogTagFilter = require("./models/signalLogTagFilter");
import LogValuesFilter = require("./models/logValuesFilter");
import AlarmsFilter = require("./models/alarmsFilter");
import LogBookFilter = require("./models/logbookFilter");
import OperationDiaryFilter = require("./models/operationDiaryFilter");
import AlarmSource = require("./alarmSource");
import Moment = moment.Moment;
import Signal = require("./models/signal");
import SessionService = require("./sessionService");
import Logger = require("./logger");
import ConnectorEnums = require("./connectorEnums");
import ControlConfigurationsService = require("./controlConfigurationsService");
import ConfigurationsService = require("./configurationsService");
import SignalDefinitionsService = require("./signalDefinitionsService")
import SignalsBufferService = require("./signalsBufferService")
import UserService = require("./usersService");
import ConnectorBase = require("./connectorBase");
import { Deferred } from "./deferred";
import { IConnector } from "./_connector";

// ReSharper disable once ImplicitAnyTypeWarning
// HACK - this makes the connector enums available globally
Object.keys(ConnectorEnums).forEach((key) => window[key] = ConnectorEnums[key]);

class ScadaConnector extends ConnectorBase implements IConnector {

    public static clientSettings: Deferred<MachineSettingsDTO>;

    // !!! Neu Liste erstellen, welche Signale mit getSignal angelegt wurden; amueller 14.11.2019
    public registerSignalList: string[] = [];
    public runRegisterSignal: boolean = false;
    // ------------------------------------------------------------------------------------------

    //#region Session
    public currentLoggedInUser = ko.pureComputed(() => SessionService.currentLoggedInUser());
    public currentUserProjectAuthorizations = ko.pureComputed(() => SessionService.currentUserProjectAuthorizations());
    public currentUserSystemAuthorizations = ko.pureComputed(() => SessionService.currentUserSystemAuthorizations());
    public currentLanguageId = ko.pureComputed(() => SymbolicTextsService.currentLanguageId());
    //#endregion Session

    constructor() {
        super();

        this.getClientSettings();
    }


    //#region Signals

    public lastUpdateError = ko.pureComputed<string>({
        read: () => SignalsService.lastUpdateError()
    });

    public updateInterval = ko.pureComputed<number>({
        read: () => SignalsService.updateInterval,
        write: (value) => SignalsService.updateInterval = value
    });

    public getSignal(name: string, shouldAddSubscriber: boolean = true): Signal {
        let signalDeclaration = this.extractI4SignalDeclaration(name);
        if (this.runRegisterSignal) this.registerSignalList.push(name);  //NEU amueller; Signal-Liste erweitern
        return SignalsService.getSignal(signalDeclaration.signalName, shouldAddSubscriber);
    }

    public async unregisterSignals(...signals: (Signal | string)[]) {
        if (_.isArray(signals)) {
            // handles calls with an array argument instead of params
            signals = _.flatten(signals, true);
        }
        return SignalsService.unregisterSignals(signals);
    }

    public getOnlineUpdates(): any {
        return SignalsService.getOnlineUpdates();
    }

    public readSignals(signalNames: string[]) {
        return SignalsService.readSignals(signalNames);
    }

    public writeSignals(signalValues: SignalValue) {
        return SignalsService.writeSignals(signalValues);
    }

    public writeSignalsSecure(userPassword: string, signalValues: SignalValue) {
        return SignalsService.writeSignalsSecure(userPassword, signalValues);
    }

    public getSignalDefinition(signalName: string) {
        return SignalDefinitionsService.getDefinition(signalName);
    }

    public getSignalDefinitions(signalNames: string[]) {
        return SignalDefinitionsService.getDefinitions(signalNames);
    }

    public getAllSignalDefinitions() {
        return SignalDefinitionsService.getAllDefinitions();
    }

    public getSignalDefinitionsByPatterns(patterns: string[], onlyActive: boolean = true) {
        return SignalDefinitionsService.getSignalsDefinitionsByPatterns(patterns, onlyActive);
    }

    public getLogIds(signalLogTags: SignalLogTagFilter[]) {
        return SignalsService.getLogIds(signalLogTags);
    }

    public getLogValues(filter: LogValuesFilter) {
        return SignalsService.getLogValues(filter);
    }

    public getLogValuesCount(filter: LogStatisticsFilterDTO) {
        return SignalsService.getLogValuesCount(filter);
    }

    public getPeekLogValues(filter: LogValuesFilter, resolution: number) {
        return SignalsService.getPeekLogValues(filter, resolution);
    }

    public updateLogValue(logId: string, entryDate: moment.Moment, value: any, value2: any) {
        return SignalsService.updateLogValue(logId, entryDate, value, value2);
    }

    public getLastValuesBeforeDate(logTags: SignalLogTagFilterDTO[], date: moment.Moment) {
        return SignalsService.getLastValuesBeforeDate(logTags, date);
    }

    public getLastValuesAfterDate(logTags: SignalLogTagFilterDTO[], date: moment.Moment) {
        return SignalsService.getLastValuesAfterDate(logTags, date);
    }

    public getLogStatistics(filter: LogStatisticsFilterDTO) {
        return SignalsService.getLogStatistics(filter);
    }

    public getAllSignals(): Promise<NameDTO[]> {
        return SignalsService.getAllSignalNames();
    }

    public getLogs(signalId: string): Promise<LogDTO[]> {
        return SignalsService.getLogs(signalId);
    }

    public exportLogsValues(exportInformation: ExportLogValuesDTO) {
        return SignalsService.exportLogsValues(exportInformation);
    }

    //#endregion Signals


    //#region Security
    public timeOut = ko.pureComputed<number>({
        read: () => SecurityService.timeOut,
        write: (value) => SecurityService.timeOut = value
    });

    public login(userName: string, password: string, isDomainUser: boolean) {
        return SecurityService.login(userName, password, isDomainUser)
            .then(() => this.getCurrentUserAuthorizations());
    }

    public logout() {
        return SecurityService.logout();
    }

    public getCurrentLoggedInUser(): Promise<string> {
        return SessionService.getCurrentLoggedInUser();
    }

    public setSecurityToken(token: string) {
        SessionService.setSecurityToken(token);
    }

    public getCurrentUserAuthorizations() {
        return SessionService.getCurrentUserAuthorizations();
    }

    public checkProjectAuthorizations(authorizations: string[]) {
        return SecurityService.checkProjectAuthorizations(authorizations);
    }

    public checkSystemAuthorizations(authorizations: string[]) {
        return SecurityService.checkSystemAuthorizations(authorizations);
    }

    public loginWindowsUser() {
        return SecurityService.loginWindowsUser()
            .then(() => this.getCurrentUserAuthorizations());
    }

    public getCallerAccountDetails() {
        return SecurityService.getCallerAccountDetails();
    }

    //#endregion Security

    //#region AlarmService


    public getOnlineAlarms(filter: AlarmsFilter, updateRate: number): AlarmSource {
        return AlarmsService.getOnlineAlarms(filter, updateRate);
    }

    public getOfflineAlarms(filter: AlarmsFilter): AlarmSource {
        return AlarmsService.getOfflineAlarms(filter);
    }

    public getAlarmGroups(languageId: number) {
        return AlarmsService.getAlarmGroups(languageId);
    }

    public getAlarmTypes(languageId: number) {
        return AlarmsService.getAlarmTypes(languageId);
    }

    public getAlarms(alarmIds: string[], languageId: number) {
        return AlarmsService.getAlarms(alarmIds, languageId);
    }

    public acknowledgeAlarms(alarmIds: string[], comment: string) {
        return AlarmsService.acknowledgeAlarms(alarmIds, comment);
    }

    public acknowledgeAllAlarms(comment: string) {
        return AlarmsService.acknowledgeAllAlarms(comment);
    }

    public acknowledgeAllGoneAlarms(comment: string) {
        return AlarmsService.acknowledgeAllGoneAlarms(comment);
    }

    public acknowledgeAlarmsByGroup(groupName: string, comment: string) {
        return AlarmsService.acknowledgeAlarmsByGroup(groupName, comment);
    }

    public setAlarmState(alarmId: string, state: AlarmProcessingAndDisplayState, reactivation: Moment) {
        return AlarmsService.setAlarmState(alarmId, state, reactivation);
    }

    public getExtendedAlarmProperties() {
        return AlarmsService.getExtendedAlarmProperties();
    }
    //#endregion AlarmService

    //#region SymbolicTextsService
    public getLanguagesAsync() {
        return SymbolicTextsService.getLanguagesAsync();
    }

    public setLanguageAsync(languageId: number) {
        return SymbolicTextsService.setLanguageAsync(languageId);
    }

    public translate(symbolicTextName: string) {
        return SymbolicTextsService.translate(symbolicTextName);
    }

    public getGenericCulture(lcid: number) {
        return SymbolicTextsService.getGenericCulture(lcid);
    }

    public getNumeralLanguage(lcid: number) {
        return SymbolicTextsService.getNumeralLanguage(lcid);
    }

    public getD3Language(lcid: number) {
        return SymbolicTextsService.getD3Language(lcid);
    }

    public getAmchartsLanguage(lcid: number) {
        return SymbolicTextsService.getAmchartsLanguage(lcid);
    }
    //#endregion SymbolicTextsService

    //#region LogBookService
    public getLogbookEntries(filter: LogBookFilter) {
        return LogBookService.getLogbookEntries(filter);
    }

    public getLogbookTopics() {
        return LogBookService.getLogbookTopics();
    }

    public addLogbookEntry(logBookEntry: LogbookEntryDTO) {
        return LogBookService.addLogbookEntry(logBookEntry);
    }
    //#endregion

    //#region OperationDiaryService
    public getWFEvents(filter: OperationDiaryFilter) {
        return OperationDiaryService.getWFEvents(filter);
    }
    //#endregion

    //#region Logging & Error handling 
    public handleError = Logger.handleError;
    public info = Logger.info;
    public warn = Logger.warn;
    public error = Logger.error;
    //#endregion

    //#region ControlConfigurationsService
    public getControlConfigurationsByNamespace(configurationNamespace: string, type: number) {
        return ControlConfigurationsService.getControlConfigurationsByNamespace(configurationNamespace, type);
    }
    public getControlConfigurationByName(name: string, configurationNamespace: string, type: number) {
        return ControlConfigurationsService.getControlConfigurationByName(name, configurationNamespace, type);
    }
    public getControlConfigurationThatStartWithName(name: string, configurationNamespace: string, type: number) {
        return ControlConfigurationsService.getControlConfigurationThatStartWithName(name, configurationNamespace, type);
    }
    public deleteControlConfiguration(id: string) {
        return ControlConfigurationsService.deleteControlConfiguration(id);
    }
    public insertControlConfiguration(controlConfiguration: ControlConfigurationDTO) {
        return ControlConfigurationsService.insertControlConfiguration(controlConfiguration);
    }
    public updateControlConfiguration(controlConfiguration: ControlConfigurationDTO) {
        return ControlConfigurationsService.updateControlConfiguration(controlConfiguration);
    }
    public getControlConfigurationsByName(configurationName: string, configurationNamespace: string, type: number) {
        return ControlConfigurationsService.getControlConfigurationByName(configurationName, configurationNamespace, type);
    }

    public getControlConfigurationById(id: string) {
        return ControlConfigurationsService.getControlConfigurationById(id);
    }

    public getControlConfigurationNameCount(name: string, configurationNamespace: string, type: number, excludeId: string) {
        return ControlConfigurationsService.getControlConfigurationNameCount(name, configurationNamespace, type, excludeId);
    }
    //#endregion

    //#region SignalsBufferService
    public writeSignalsToBuffer(signalValues: SignalValue) {
        return SignalsBufferService.writeSignalsToBuffer(signalValues);
    }

    public async writeSignalsFromBuffer() {
        const erg = await SignalsBufferService.writeSignalsFromBuffer();
        return erg;
    }

    public writeSignalsFromBufferSecure(userPassword: string) {
        return SignalsBufferService.writeSignalsFromBufferSecure(userPassword);
    }

    public signalBufferIsEmpty = ko.computed(() => {
        return SignalsBufferService.bufferIsEmpty();
    });

    public existSignalInBuffer(signalName: string) {
        return SignalsBufferService.existSignalInBuffer(signalName);
    }

    public existSignalsInBuffer(signalNames: string[]) {
        return SignalsBufferService.existSignalsInBuffer(signalNames);
    }

    public clearSignalBuffer() {
        return SignalsBufferService.clearSignalBuffer();
    }

    public getSignalsFromBuffer() {
        return SignalsBufferService.getSignalsFromBuffer();
    }

    public readSignalsFromBuffer(signalNames: string[]) {
        return SignalsBufferService.readSignals(signalNames);
    }
    //!!! Neu "clearSignalsFromBuffer", entwickelt am 29.08.2017 von amueller@coppenrath-wiese.de
    public clearSignalsFromBuffer(signalNames: string[]) {
        return SignalsBufferService.clearSignalsFromBuffer(signalNames);
    }
    //!!! Neu "Ermittle Signale", entwickelt am 1.11.2019 von amueller@coppenrath-wiese.de
    public startListenRegisterTable() {
        console.log("%cstartListenRegisterTable()","background-color:orange");
        this.runRegisterSignal = true;
    }
    public stopListenRegisterTable() {
        console.log("%cstopListenRegisterTable()","background-color:orange");
        this.runRegisterSignal = false;
    }
    public clearListenRegisterTable() {
        console.log("%cclearListenRegisterTable()","background-color:orange");
        this.registerSignalList = [];  //lösche alle Einträge
    }
    //---- Ende "Ermittle Signale" --------------------------------------------------------
    //endregion


    //#region UserService
    public changeUserPassword(affectedUserId: string, newPassword: string) {
        return UserService.changeUserPassword(affectedUserId, newPassword);
    }

    public changeCurrentUserPassword(currentPassword: string, newPassword: string) {
        return UserService.changeCurrentUserPassword(currentPassword, newPassword);
    }

    public getAllUsers() {
        return UserService.getAllUsers();
    }
    //#endregion

    private getClientSettings(): void {
        if (ScadaConnector.clientSettings) return;

        ScadaConnector.clientSettings = new Deferred<MachineSettingsDTO>();

        ConfigurationsService.getClientMachineSettings().then(dto => {
            ScadaConnector.clientSettings.resolve(dto);

            var clientConfiguration = ConnectorBase.getOrCreateClientConfiguration();

            if (dto) {
                clientConfiguration.useVirtualKeyboard = dto.HasVirtualKeyboard;
                clientConfiguration.updateRate = dto.UpdateRate;
            }

            this.updateInterval(clientConfiguration.updateRate);
        });
    }
}

export = ScadaConnector;