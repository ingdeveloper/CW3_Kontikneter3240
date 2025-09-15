import SignalsService = require("./signalsService");
import i4Connector = require("./i4/i4Connector");
import ScadaConnector = require("./scadaConnector");
import ConnectorEnums = require("./connectorEnums");
import Logger = require("./logger");
import SignalLogTagFilter = require("./models/signalLogTagFilter");
import LogValuesFilter = require("./models/logValuesFilter");
import AlarmsFilter = require("./models/alarmsFilter");
import LogBookFilter = require("./models/logbookFilter");
import OperationDiaryFilter = require("./models/operationDiaryFilter");
import AlarmSource = require("./alarmSource");
import Signal = require("./models/signal");
import Signals = require("./models/signals");
import SignalValueData = require("./models/_signal-value-data");
import Moment = moment.Moment;
import ActionResult = WEBfactory.DWH.Data.Exchange.ActionResult;
import { IConnector } from "./_connector";
import SignalsInterface = require("./models/_signal");
import SignalValueType = SignalsInterface.SignalValueType;

// ReSharper disable once ImplicitAnyTypeWarning
// HACK - this makes the connector enums available globally
Object.keys(ConnectorEnums).forEach((key) => window[key] = ConnectorEnums[key]);

class Connector implements IConnector {

    public disableSignalBrowser = (<any>window).disableSignalBrowser;
    //#region Logging & Error handling
    public handleError = Logger.handleError;
    public info = Logger.info;
    public warn = Logger.warn;
    public error = Logger.error;
    private i4Connector: i4Connector;
    private scadaConnector: ScadaConnector;
    public signalBufferIsEmpty = ko.pureComputed(() => {
        return this.scadaConnector.signalBufferIsEmpty();
    });
    //#region Session
    public currentLoggedInUser = ko.pureComputed(() => this.scadaConnector.currentLoggedInUser());
    public currentUserProjectAuthorizations = ko.pureComputed(() => this.scadaConnector.currentUserProjectAuthorizations());
    public currentUserSystemAuthorizations = ko.pureComputed(() => this.scadaConnector.currentUserSystemAuthorizations());

    //#endregion Session


    //#region Signals
    public currentLanguageId = ko.pureComputed(() => this.scadaConnector.currentLanguageId());
    public lastUpdateError = ko.pureComputed<string>({
        read: () => this.scadaConnector.lastUpdateError()
    });
    public updateInterval = ko.pureComputed<number>({
        read: () => this.scadaConnector.updateInterval(),
        write: (value) => this.scadaConnector.updateInterval(value)
    });
    //#region Security
    public timeOut = ko.pureComputed<number>({
        read: () => this.scadaConnector.timeOut(),
        write: (value) => this.scadaConnector.timeOut(value)
    });

    private static getRemoteSignalValues(signals) {
        const remoteSignals: SignalValue = {};
        for (const remoteSignal of signals.remoteSignals) {
            remoteSignals[remoteSignal.name] = remoteSignal.value;
        }
        return remoteSignals;
    }

    constructor() {
        this.scadaConnector = new ScadaConnector();

        if (window.usei4Connector) {
            this.i4Connector = new i4Connector();
        }
    }

    private get connector() {
        if (window.usei4Connector) {
            return this.i4Connector;
        }
        return this.scadaConnector;
    }

    public getCurrentLoggedInUser(): Promise<string> {
        return this.scadaConnector.getCurrentLoggedInUser();
    }

    public setSecurityToken(token: string) {
        this.scadaConnector.setSecurityToken(token);
    }

    public getSignal(name: string, shouldAddSubscriber: boolean = true): Signal {
        return this.connector.getSignal(name, shouldAddSubscriber);
    }

    public async unregisterSignals(...signals: (Signal | string)[]) {
        await this.connector.unregisterSignals(...signals);
    }

    public getOnlineUpdates(): any {
        return this.connector.getOnlineUpdates();
    }

    public readSignals(signalNames: string[]) {
        return this.connector.readSignals(signalNames);
    }

    public async writeSignals(signalValues: SignalValue) {
        const signals = Signals.fromSignalValues(signalValues);
        this.writeLocalSignals(signals.localSignals);

        if (!signals.remoteSignals.length) {
            return {
                successful: true,
                errorMessage: null,
                exception: null
            } as ActionResult;
        }

        const remoteSignals = Connector.getRemoteSignalValues(signals);
        return this.connector.writeSignals(remoteSignals);
    }

    public async writeSignalsSecure(userPassword: string, signalValues: SignalValue) {
        const signals = Signals.fromSignalValues(signalValues);
        this.writeLocalSignals(signals.localSignals);
        if (!signals.remoteSignals.length) {
            return signals.localSignals.map(x => x.result);
        }

        const remoteSignals = Connector.getRemoteSignalValues(signals);

        try {
            return await this.scadaConnector.writeSignalsSecure(userPassword, remoteSignals);
        } catch (error) {
            this.error(this, "{0} {1}".format(this.translate("I4SCADA_WriteSignal_operation_error")(), error.responseJSON.Message));
        }
    }

    public async getSignalDefinition(signalName: string): Promise<CommonSignalDefinition> {
        if (Signals.isLocalSignal(signalName)) {
            return this.getLocalSignalDefinition(signalName);
        }
        return this.connector.getSignalDefinition(signalName);
    }

    private getLocalSignalDefinition(signalName: string) {
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
    }

    public async getSignalDefinitions(signalNames: string[]) : Promise<CommonSignalDefinition[]> {
        const signals = Signals.fromSignalNames(signalNames);

        const remoteSignalNames = signals.remoteSignals.map(x=>x.name)

        const localDefinitions = signals.localSignals.map(x=>this.getLocalSignalDefinition(x.name));
        const remoteDefinitions = await this.connector.getSignalDefinitions(remoteSignalNames);

        const definitionMap : {[signalName: string]: CommonSignalDefinition} = {};
        localDefinitions.forEach((x, index)=> definitionMap[signals.localSignals[index].name] = x);
        remoteDefinitions.forEach((x, index)=> definitionMap[signals.remoteSignals[index].name] = x);
        return signalNames.map(x=> definitionMap[x]);
    }

    public getAllSignalDefinitions() {
        return this.connector.getAllSignalDefinitions();
    }

    public getSignalDefinitionsByPatterns(patterns: string[]) {
        return this.connector.getSignalDefinitionsByPatterns(patterns);
    }

    public isSignalDefined(signalName: string): Promise<boolean> {
        if (!signalName) return Promise.resolve(false);

        const signal = this.getSignal(signalName);

        if (signal.definition() || signal.id() || signal.hasValue()) {
            return Promise.resolve(true);
        } else {
            return this.getSignalDefinition(signalName).then(definition => {
                return definition !== null;
            });
        }
    }

    public getLogIds(signalLogTags: SignalLogTagFilter[]) {
        return this.scadaConnector.getLogIds(signalLogTags);
    }

    public getLogValues(filter: LogValuesFilter) {
        return this.scadaConnector.getLogValues(filter);
    }

    public getLogValuesCount(filter: LogStatisticsFilterDTO) {
        return this.scadaConnector.getLogValuesCount(filter);
    }

    public getPeekLogValues(filter: LogValuesFilter, resolution: number) {
        return this.scadaConnector.getPeekLogValues(filter, resolution);
    }

    public exportLogsValues(exportInformation: ExportLogValuesDTO) {
        return this.scadaConnector.exportLogsValues(exportInformation);
    }

    //#endregion Signals

    public updateLogValue(logId: string, entryDate: moment.Moment, value: any, value2: any) {
        return this.scadaConnector.updateLogValue(logId, entryDate, value, value2);
    }

    public getLastValuesBeforeDate(logTags: SignalLogTagFilterDTO[], date: moment.Moment) {
        return this.scadaConnector.getLastValuesBeforeDate(logTags, date);
    }

    public getLastValuesAfterDate(logTags: SignalLogTagFilterDTO[], date: moment.Moment) {
        return this.scadaConnector.getLastValuesAfterDate(logTags, date);
    }

    public getLogStatistics(filter: LogStatisticsFilterDTO) {
        return this.scadaConnector.getLogStatistics(filter);
    }

    public getAllSignals(): Promise<NameDTO[]> {
        return this.scadaConnector.getAllSignals();
    }

    public getLogs(signalId: string): Promise<LogDTO[]> {
        return this.scadaConnector.getLogs(signalId);
    }

    public login(userName: string, password: string, isDomainUser: boolean) {
        return this.scadaConnector.login(userName, password, isDomainUser);
    }

    public logout() {
        return this.scadaConnector.logout();
    }

    public loginWindowsUser() {
        return this.scadaConnector.loginWindowsUser();
    }

    public getCallerAccountDetails() {
        return this.scadaConnector.getCallerAccountDetails();
    }

    //#endregion Security

    //#region AlarmService

    public getCurrentUserAuthorizations() {
        return this.scadaConnector.getCurrentUserAuthorizations();
    }

    public checkProjectAuthorizations(authorizations: string[]) {
        return this.scadaConnector.checkProjectAuthorizations(authorizations);
    }

    public checkSystemAuthorizations(authorizations: string[]) {
        return this.scadaConnector.checkSystemAuthorizations(authorizations);
    }

    public getOnlineAlarms(filter: AlarmsFilter, updateRate: number): AlarmSource {
        return this.scadaConnector.getOnlineAlarms(filter, updateRate);
    }

    public getOfflineAlarms(filter: AlarmsFilter): AlarmSource {
        return this.scadaConnector.getOfflineAlarms(filter);
    }

    public getAlarmGroups(languageId: number) {
        return this.scadaConnector.getAlarmGroups(languageId);
    }

    public getAlarmTypes(languageId: number) {
        return this.scadaConnector.getAlarmTypes(languageId);
    }

    public getAlarms(alarmIds: string[], languageId: number) {
        return this.scadaConnector.getAlarms(alarmIds, languageId);
    }

    public acknowledgeAlarms(alarmIds: string[], comment: string) {
        return this.scadaConnector.acknowledgeAlarms(alarmIds, comment);
    }

    public getExtendedAlarmProperties() {
        return this.scadaConnector.getExtendedAlarmProperties();
    }

    //#endregion AlarmService

    public acknowledgeAllAlarms(comment: string) {
        return this.scadaConnector.acknowledgeAllAlarms(comment);
    }

    public acknowledgeAllGoneAlarms(comment: string) {
        return this.scadaConnector.acknowledgeAllGoneAlarms(comment);
    }

    public acknowledgeAlarmsByGroup(groupName: string, comment: string) {
        return this.scadaConnector.acknowledgeAlarmsByGroup(groupName, comment);
    }

    public setAlarmState(alarmId: string, state: AlarmProcessingAndDisplayState, reactivation: Moment) {
        return this.scadaConnector.setAlarmState(alarmId, state, reactivation);
    }

    //#region SymbolicTextsService
    public getLanguagesAsync() {
        return this.scadaConnector.getLanguagesAsync();
    }

    public setLanguageAsync(languageId: number) {
        return this.scadaConnector.setLanguageAsync(languageId);
    }

    //#endregion SymbolicTextsService

    public translate(symbolicTextName: string) {
        return this.scadaConnector.translate(symbolicTextName);
    }

    public getGenericCulture(lcid: number) {
        return this.scadaConnector.getGenericCulture(lcid);
    }

    public getNumeralLanguage(lcid: number) {
        return this.scadaConnector.getNumeralLanguage(lcid);
    }

    public getAmchartsLanguage(lcid: number) {
        return this.scadaConnector.getAmchartsLanguage(lcid);
    }

    //#endregion

    public getD3Language(lcid: number) {
        return this.scadaConnector.getD3Language(lcid);
    }

    //#endregion

    //#region LogBookService
    public getLogbookEntries(filter: LogBookFilter) {
        return this.scadaConnector.getLogbookEntries(filter);
    }

    public getLogbookTopics() {
        return this.scadaConnector.getLogbookTopics();
    }

    public addLogbookEntry(logBookEntry: LogbookEntryDTO) {
        return this.scadaConnector.addLogbookEntry(logBookEntry);
    }

    //#region OperationDiaryService
    public getWFEvents(filter: OperationDiaryFilter) {
        return this.scadaConnector.getWFEvents(filter);
    }

    //#endregion

    //#region ControlConfigurationsService
    public getControlConfigurationsByNamespace(configurationNamespace: string, type: number) {
        return this.scadaConnector.getControlConfigurationsByNamespace(configurationNamespace, type);
    }

    public getControlConfigurationByName(name: string, configurationNamespace: string, type: number) {
        return  this.scadaConnector.getControlConfigurationByName(name, configurationNamespace, type);
    }
    public getControlConfigurationThatStartWithName(name: string, configurationNamespace: string, type: number) {
        return  this.scadaConnector.getControlConfigurationThatStartWithName(name, configurationNamespace, type);
    }

    public deleteControlConfiguration(id: string) {
        return this.scadaConnector.deleteControlConfiguration(id);
    }

    public insertControlConfiguration(controlConfiguration: ControlConfigurationDTO) {
        return this.scadaConnector.insertControlConfiguration(controlConfiguration);
    }

    public updateControlConfiguration(controlConfiguration: ControlConfigurationDTO) {
        return this.scadaConnector.updateControlConfiguration(controlConfiguration);
    }

    public getControlConfigurationsByName(configurationName: string, configurationNamespace: string, type: number) {
        return this.scadaConnector.getControlConfigurationsByName(configurationName, configurationNamespace, type);
    }

    public getControlConfigurationById(id: string) {
        return this.scadaConnector.getControlConfigurationById(id);
    }

    public getControlConfigurationNameCount(name: string, configurationNamespace: string, type: number, excludeId: string) {
        return this.scadaConnector.getControlConfigurationNameCount(name, configurationNamespace, type, excludeId);
    }

    //#endregion

    //#region SignalsBufferService
    public writeSignalsToBuffer(signalValues: SignalValue) {
        return this.scadaConnector.writeSignalsToBuffer(signalValues);
    }

    public writeSignalsFromBuffer() {
        return this.scadaConnector.writeSignalsFromBuffer();
    }

    public writeSignalsFromBufferSecure(userPassword: string) {
        return this.scadaConnector.writeSignalsFromBufferSecure(userPassword);
    }

    public existSignalInBuffer(signalName: string) {
        return this.scadaConnector.existSignalInBuffer(signalName);
    }

    public existSignalsInBuffer(signalNames: string[]) {
        return this.scadaConnector.existSignalsInBuffer(signalNames);
    }

    public clearSignalBuffer() {
        return this.scadaConnector.clearSignalBuffer();
    }

    public getSignalsFromBuffer() {
        return this.scadaConnector.getSignalsFromBuffer();
    }
    //!!! Neu "clearSignalsFromBuffer", entwickelt am 29.08.2017 von amueller@coppenrath-wiese.de
    public clearSignalsFromBuffer(signalNames: string[]) {
        return this.scadaConnector.clearSignalsFromBuffer(signalNames);
    }

    public readSignalsFromBuffer(signalNames: string[]) {
        return this.scadaConnector.readSignalsFromBuffer(signalNames);
    }

    //!!! Neu "Ermittle Signale", entwickelt am 1.11.2019 von amueller -----------------------------
    public getAllRegisteredSignals() {
        var sig = SignalsService.allRegisteredSignals;
        return sig;
    }
    public getAllListenRegisteredSignals() {
        var sig = this.scadaConnector.registerSignalList;
        return sig;
    }
    public startListenRegisterTable() {
        return this.scadaConnector.startListenRegisterTable();
    }
    public stopListenRegisterTable() {
        return this.scadaConnector.stopListenRegisterTable();
    }
    public clearListenRegisterTable() {
        return this.scadaConnector.clearListenRegisterTable();
    }
    // !!! Ende "Ermittle Signale"------------------------------------------------------------------

    //#region UserService
    public changeUserPassword(affectedUserId: string, newPassword: string) {
        return this.scadaConnector.changeUserPassword(affectedUserId, newPassword);
    }

    //endregion
    public changeCurrentUserPassword(currentPassword: string, newPassword: string) {
        return this.scadaConnector.changeCurrentUserPassword(currentPassword, newPassword);
    }

    public getAllUsers() {
        return this.scadaConnector.getAllUsers();
    }

    /**
     * Writes values to the local signals
     * @param {SignalValueData[]} localSignals
     */
    private writeLocalSignals(localSignals: SignalValueData[]) {
        for (const localSignal of localSignals) {
            const signal = this.getSignal(localSignal.name, false);
            signal.setValue(localSignal.value, SignalValueType.Server);
            localSignal.result = 0;
        }
    }

    //#endregion
}

export = Connector;