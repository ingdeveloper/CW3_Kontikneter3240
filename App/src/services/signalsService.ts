import Signal = require("./models/signal");
import SignalsInterface = require("./models/_signal");
import SignalValueType = SignalsInterface.SignalValueType;
import NullSignal = require("./models/nullSignal");
import SignalLogTagFilter = require("./models/signalLogTagFilter");
import LogValuesFilter = require("./models/logValuesFilter");
import SessionService = require("./sessionService");
import ConnectorService = require("./connectorService");
import Api = require("./api");
import Logger = require("./logger");
import ErrorCodeService = require("./errorCodeService");
import SymbolicTextsService = require("./symbolicTextsService");
import Deferred = require("./deferred");
import Signals = require("./models/signals");
import SignalValueData = require("./models/_signal-value-data");
import ActionResult = WEBfactory.DWH.Data.Exchange.ActionResult;

interface IRegistrationResult {
    signalName: string;
    code: number;
}

interface IUpdateRequest {
    sessionId: string;
    clientId: string;
    requestId: number;
}

class SignalsService {
    public static updateInterval = 800;
    public static registeredSignalList: Signal[] = [];
    public static allRegisteredSignals: Signal[] = [];
    public static signalsToRegister: string[] = [];
    public static lastUpdateError = ko.observable<string>(null);
    private static allSignalDeffer: Deferred.Deferred<NameDTO[]>;
    private static allSignalStartIndex = 0;
    private static allSignalCount = 100000;
    private static registeredSignals: Signal[] = [];
    private static signalsToUnRegister: KnockoutObservableArray<Signal | string> = ko.observableArray([]);
    private static queuedSignalsToUnRegister = ko.computed(() => {
        return SignalsService.signalsToUnRegister();
    }).extend({ throttle: 250 });
    private static subscription: KnockoutSubscription = SignalsService.queuedSignalsToUnRegister.subscribe(() => SignalsService.unregisterQueuedSignals(SignalsService.queuedSignalsToUnRegister()), SignalsService);
    private static updateRequest: IUpdateRequest;
    private static getUpdates: boolean;
    private static noSignal = new NullSignal();

    public static getRegisteredSignalByNameOrId(name: string): Signal {
        if (!name) return null;

        let signal = SignalsService.registeredSignals[name];

        if (!signal) {
            return _.find(SignalsService.allRegisteredSignals, (signal) => {
                return ko.unwrap(signal.id) === name;
            });
        }

        return signal;
    }

    public static getSignal(name: string, shouldAddSubscriber: boolean = true): Signal {
        if (!name) {
            Logger.warn(SignalsService, "No signal name specified");
            return this.noSignal;
        }

        // name = name.toLowerCase(); //scada does not handle invariant signalName

        let signal = SignalsService.registeredSignals[name];
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
    }

    public static unregisterSignals(signals: (Signal | string)[]) {
        for (let signal of signals) {
            SignalsService.signalsToUnRegister.push(signal);
        }
    }

    public static async getOnlineUpdates() {
        const session = await ConnectorService.connect();
        if (session) {
            // noinspection JSIgnoredPromiseFromCall
            SignalsService.registerSignals();
            // noinspection JSIgnoredPromiseFromCall
            SignalsService.startGettingUpdates();
        }
    }

    public static async readSignals(signalNames: string[]): Promise<SignalValueDTO[]> {
        const signals = Signals.fromSignalNames(signalNames);
        SignalsService.readLocalSignals(signals.localSignals);
        await this.readRemoteSignals(signals.remoteSignals);
        return Signals.toSignalValueDTOs(signalNames, signals);
    }

    public static async writeSignals(signalValues: SignalValue) {
        const values = Object.keys(signalValues).map<KeyValuePair<string, any>>(signalName => ({
            key: signalName,
            value: signalValues[signalName]
        }));

        const securityToken = SessionService.getSecurityToken();
        const currentUser = SessionService.currentLoggedInUser();

        try {
            await ConnectorService.connect();
            let responseCodes: number[];
            if (securityToken && currentUser) {
                responseCodes = await Api.signalsService.writeSecuredSignals(values, securityToken, SessionService.getClientId());
            } else {
                responseCodes = await Api.signalsService.writeUnsecuredSignals(values, SessionService.sessionId, SessionService.getClientId());
            }

            const result = SignalsService.handleWriteResponse(responseCodes);

            if (!result.successful) {
                Logger.handleError(SignalsService)(result.errorMessage);
            }
            return result;
        } catch (error) {
            Logger.handleError(SignalsService)(error);

            return SignalsService.handleWriteResponse(null);
        }
    }

    public static async writeSignalsSecure(userPassword: string, signalValues: SignalValue): Promise<number[]> {
        const values = Object.keys(signalValues).map(signalName => ({
            Name: signalName,
            Value: signalValues[signalName]
        }));

        const securityToken = SessionService.getSecurityToken();
        await ConnectorService.connect();
        return Api.signalsService.writeSignalsSecure(securityToken, userPassword, values);
    }

    public static async getLogIds(signalLogTags: SignalLogTagFilter[]) {
        const logTags = _.map(signalLogTags, (tag) => {
            return {
                SignalID: tag.signalId(),
                LogTag: tag.logTag()
            };
        });

        try {
            return await Api.signalsService.getLogIds(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), logTags, SessionService.timeOut);
        } catch (error) {
            Logger.handleError(SignalsService)(error);
        }
    }

    public static async getLogValues(filter: LogValuesFilter) {
        try {

            const securityToken = SessionService.getSecurityToken();
            let values: DatedLogValuesDTO[];
            if (securityToken) {
                values = await Api.signalsService.getLogValuesByToken(securityToken, filter.toDto(), SessionService.timeOut);
            } else {
                values = await Api.signalsService.getLogValues(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), filter.toDto(), SessionService.timeOut);
            }

            for (let i = 0; i < values.length; i++) {
                values[i].EntriesDate = moment(values[i].EntriesDate).toDate();
            }

            return values;
        } catch (error) {
            Logger.handleError(SignalsService)(error);
        }
    }

    public static async getPeekLogValues(filter: LogValuesFilter, resolution: number) {
        try {

            const securityToken = SessionService.getSecurityToken();
            let values: DatedLogValuesDTO[];
            if (securityToken) {
                values = await Api.signalsService.getPeekLogValuesByToken(securityToken, filter.toDto(), resolution, SessionService.timeOut);
            } else {
                values = await Api.signalsService.getPeekLogValues(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), filter.toDto(), resolution, SessionService.timeOut);
            }

            for (let i = 0; i < values.length; i++) {
                values[i].EntriesDate = moment(values[i].EntriesDate).toDate();
            }

            return values;
        } catch (error) {
            Logger.handleError(SignalsService)(error);
        }
    }


    public static async updateLogValue(logId: string, entryDate: moment.Moment, value: any, value2: any) {

        const securityToken = SessionService.getSecurityToken();

        if (securityToken) {
            return await Api.signalsService.updateLogValueByToken(securityToken, logId, entryDate, value, value2, SessionService.timeOut);
        } else {
            return await Api.signalsService.updateLogValue(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), logId, entryDate, value, value2, SessionService.timeOut);
        }

    }

    public static async getLastValuesBeforeDate(logTags: SignalLogTagFilterDTO[], date: moment.Moment) {
        const securityToken = SessionService.getSecurityToken();
        if (securityToken) {
            return await Api.signalsService.getLastValuesBeforeDateByToken(securityToken, logTags, date.toMSDateTimeOffset(), SessionService.timeOut);
        } else {
            return await Api.signalsService.getLastValuesBeforeDate(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), logTags, date.toMSDateTimeOffset(), SessionService.timeOut);
        }
    }

    public static async getLastValuesAfterDate(logTags: SignalLogTagFilterDTO[], date: moment.Moment) {
        const securityToken = SessionService.getSecurityToken();
        if (securityToken) {
            return await Api.signalsService.getLastValuesAfterDateByToken(securityToken, logTags, date.toMSDateTimeOffset(), SessionService.timeOut);
        } else {
            return await Api.signalsService.getLastValuesAfterDate(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), logTags, date.toMSDateTimeOffset(), SessionService.timeOut);
        }
    }

    public static async getLogStatistics(filter: LogStatisticsFilterDTO) {
        const securityToken = SessionService.getSecurityToken();
        try {
            if (securityToken) {
                return await Api.signalsService.getLogStatisticsByToken(securityToken, filter, SessionService.timeOut);
            } else {
                return await Api.signalsService.getLogStatistics(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), filter, SessionService.timeOut);
            }
        } catch (error) {
            Logger.handleError(SignalsService)(error);
            return [];
        }
    }

    public static async getLogValuesCount(filter: LogStatisticsFilterDTO) {
        const securityToken = SessionService.getSecurityToken();
        try {
            if (securityToken) {
                return await Api.signalsService.getLogValuesCountByToken(securityToken, filter, SessionService.timeOut);
            } else {
                return await Api.signalsService.getLogValuesCount(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), filter, SessionService.timeOut);
            }
        } catch (error) {
            Logger.handleError(SignalsService)(error);
            return 0;
        }
    }

    public static async getSignalNames(filter: GetSignalNamesFilterDTO, startIndex: number, count: number): Promise<DescriptionDTO[]> {
        try {
            const securityToken = SessionService.getSecurityToken();

            if (securityToken) {
                return await Api.signalsService.getSignalNamesByToken(securityToken, filter, SymbolicTextsService.currentLanguageId(), startIndex, count, SessionService.timeOut);
            } else {
                return await Api.signalsService.getSignalNames(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), filter, SymbolicTextsService.currentLanguageId(), startIndex, count, SessionService.timeOut);
            }
        } catch (error) {
            Logger.handleError(SignalsService)(error);

            return Promise.resolve(null);
        }
    }

    public static async getGroupNames(filter: GetGroupNamesFilterDTO, startIndex: number, count: number): Promise<DescriptionDTO[]> {
        try {
            const securityToken = SessionService.getSecurityToken();

            if (securityToken) {
                return await Api.signalsService.getGroupNamesByToken(securityToken, filter, SymbolicTextsService.currentLanguageId(), startIndex, count, SessionService.timeOut);
            } else {
                return await Api.signalsService.getGroupNames(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), filter, SymbolicTextsService.currentLanguageId(), startIndex, count, SessionService.timeOut);
            }
        } catch (error) {
            Logger.handleError(SignalsService)(error);

            return Promise.resolve(null);
        }
    }

    public static async getLogs(signalId: string): Promise<LogDTO[]> {
        try {
            const securityToken = SessionService.getSecurityToken();

            if (securityToken) {
                return await Api.signalsService.getLogsByToken(securityToken, signalId, SymbolicTextsService.currentLanguageId(), SessionService.timeOut);
            } else {
                return await Api.signalsService.getLogs(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), signalId, SymbolicTextsService.currentLanguageId(), SessionService.timeOut);
            }
        } catch (error) {
            Logger.handleError(SignalsService)(error);

            return Promise.resolve(null);
        }
    }

    public static async getSignalDefinitions(filter: GetSignalDefinitionsFilterDTO, start: number, count: number): Promise<SignalDefinitionDTO[]> {
        try {
            const securityToken = SessionService.getSecurityToken();

            if (securityToken) {
                return await Api.signalsService.getSignalDefinitionsByToken(securityToken, filter, SymbolicTextsService.currentLanguageId(), start, count, SessionService.timeOut);
            } else {
                return await Api.signalsService.getSignalDefinitions(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), filter, SymbolicTextsService.currentLanguageId(), start, count, SessionService.timeOut);
            }
        } catch (error) {
            Logger.handleError(SignalsService)(error);

            return Promise.resolve(null);
        }
    }

    public static async getAllSignalNames(): Promise<NameDTO[]> {
        if (!SignalsService.allSignalDeffer) {
            SignalsService.allSignalDeffer = new Deferred.Deferred<NameDTO[]>();

            const filter = {
                ServerNames: [],
                AliasNames: [],
                GroupIds: []
            } as GetSignalNamesFilterDTO;

            let signalNamesBatch: NameDTO[];
            let allSignalNames: NameDTO[] = [];

            do {
                signalNamesBatch = await SignalsService.getSignalNames(filter, SignalsService.allSignalStartIndex, SignalsService.allSignalCount);
                allSignalNames = allSignalNames.concat(signalNamesBatch);

                SignalsService.allSignalStartIndex += SignalsService.allSignalCount;
            } while (signalNamesBatch.length >= SignalsService.allSignalCount);

            SignalsService.allSignalDeffer.resolve(allSignalNames);
        }

        return SignalsService.allSignalDeffer.promise;
    }

    private static async readRemoteSignals(remoteSignals) {
        const remoteSignalNames = remoteSignals.map(x => x.name);
        await ConnectorService.connect();
        try {
            const results = await Api.signalsService.readSignals(SessionService.sessionId, SessionService.getClientId(), remoteSignalNames);
            results.forEach((result, index) => {
                remoteSignals[index].value = result.Value;
                remoteSignals[index].result = result.Result;
            });
        } catch (error) {
            Logger.handleError(SignalsService)(error);
        }
    }

    public static readLocalSignals(localSignals: SignalValueData[]) {
        for (const localSignal of localSignals) {
            localSignal.value = SignalsService.getSignal(localSignal.name).value();
        }
    }

    private static async unregisterQueuedSignals(signals: (Signal | string)[]) {
        const signalsToRemove = SignalsService.unregisterClientSignals(signals);

        if (signalsToRemove.length === 0) {
            SignalsService.signalsToUnRegister.removeAll();
            return;
        }

        try {
            await ConnectorService.connect();
            await Api.signalsService.unregisterSignals(SessionService.sessionId, SessionService.getClientId(), signalsToRemove);
            SignalsService.signalsToUnRegister.removeAll();
        } catch (error) {
            Logger.handleError(SignalsService)(error);
        }
    }

    private static unregisterClientSignals(signals: (Signal | string)[]) {
        const signalsToRemove: string[] = [];

        for (let i = 0; i < signals.length; i++) {
            let requestedSignal = signals[i];
            if (!requestedSignal) {
                continue;
            }

            let signal: Signal;

            if (_.isString(requestedSignal)) {
                signal = SignalsService.getRegisteredSignalByNameOrId(<string>requestedSignal);
            } else {
                signal = <Signal>requestedSignal;
            }

            if (!signal) {
                continue;
            }

            signal.releaseSubscriber();
            const signalName = signal.signalName();

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
    }

    private static createUpdateRequest(prevRequestId = 0, prevResponseId = 0) {
        const requestId = SignalsService.getNextRequestId(prevRequestId, prevResponseId);

        SignalsService.updateRequest = {
            sessionId: SessionService.sessionId,
            clientId: SessionService.getClientId(),
            requestId: requestId
        };
    }

    private static getNextRequestId(prevRequestId: number, prevResponseId: number) {
        if (prevResponseId === 0) {
            return 1;
        }

        if (prevResponseId === prevRequestId) {
            return prevRequestId % 1000 + 1;
        }

        return 0;
    }

    private static handleWriteResponse(response: number[]): ActionResult {
        if (!response) {
            return {
                errorMessage: null,
                exception: null,
                successful: false
            };
        }

        const errorCode = _.find(response, x => {
            return !!x;
        });

        if (!errorCode) {
            return {
                errorMessage: null,
                exception: null,
                successful: true
            };
        } else {

            let translation = "";

            for (let errorCode of response) {
                let errorKey: any = errorCode.toString();
                if (errorKey in ErrorCodeService.signalWriteErrorCodes) {
                    translation += SymbolicTextsService.translate(ErrorCodeService.signalWriteErrorCodes[errorKey])() + "</br>";
                } else {
                    translation += SymbolicTextsService.translate("I4SCADA_Signal_write_failed")() + "</br>";
                }
            }

            return {
                errorMessage: `Code ${errorCode}: ${translation}`,
                exception: null,
                successful: false
            };

            // ReSharper disable once ImplicitAnyTypeWarning
            //throw `Code ${errorCode}: ${translation}`;
        }
    }

    private static async registerSignals() {
        const signalNames = SignalsService.signalsToRegister;
        SignalsService.signalsToRegister = [];
        if (!signalNames.length) {
            Logger.info(SignalsService, "Signals are already registered, skipping");
            return;
        }

        Logger.info(SignalsService, `Registering signals: ${signalNames}`);
        const sessionId = SessionService.sessionId;
        const clientId = SessionService.getClientId();
        try {
            const results = await Api.signalsService.registerSignals(sessionId, clientId, signalNames);
            SignalsService.onSignalsRegistered(signalNames, results);
        } catch (error) {
            Logger.handleError(SignalsService)(error);
        }
    }

    private static onSignalsRegistered(signalNames: string[], results: number[]): boolean {
        const successfull: IRegistrationResult[] = [];
        const warnings: IRegistrationResult[] = [];
        const errors: IRegistrationResult[] = [];

        for (let i = 0; i < signalNames.length; i++) {
            if (results[i] > 0) {
                warnings.push({
                    signalName: signalNames[i],
                    code: results[i]
                });
            } else if (results[i] < 0) {
                errors.push({
                    signalName: signalNames[i],
                    code: results[i]
                });
            } else {
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
    }

    private static buildSignalRegistrationMessage(message: string, results: IRegistrationResult[]) {
        let result = message + " " + results.length + " signals:";

        const signalCodes = _.map(results, r => `${r.signalName} (${r.code})`).join("\n");

        if (signalCodes.length > 0) {
            result += "\n";
            result += signalCodes;
        }

        return result;
    }

    private static async startGettingUpdates() {
        if (!SignalsService.getUpdates) {
            SignalsService.createUpdateRequest();
            // noinspection JSIgnoredPromiseFromCall
            SignalsService.doUpdate();
        }
    }

    private static async doUpdate() {
        const request = SignalsService.updateRequest;
        try {
            SignalsService.getUpdates = true;
            const update = await Api.signalsService.getUpdates(request.sessionId, request.clientId, request.requestId);
            SignalsService.updateSignals(update);
        } catch (error) {
            if (!SignalsService.lastUpdateError()) {
                SignalsService.lastUpdateError(error);
                Logger.handleError(SignalsService)(error);
            }
            _.delay(() => SignalsService.doUpdate(), SignalsService.updateInterval);
        }
    }

    private static updateSignals(update: SignalUpdateDTO) {

        SignalsService.lastUpdateError(null);

        if (!update) {
            return;
        }

        const responseId = update.ResponseId;

        SignalsService.updateSignalValues(update.Updates, SignalValueType.Server);

        _.delay(() => {
            SignalsService.createUpdateRequest(SignalsService.updateRequest.requestId, responseId);
            SignalsService.doUpdate();
        }, SignalsService.updateInterval);
    }

    public static async exportLogsValues(exportInformation: ExportLogValuesDTO) {
        const securityToken = SessionService.getSecurityToken();
        if (securityToken) {
            return await Api.exportService.exportLogsValuesByToken(securityToken, exportInformation, SessionService.timeOut);
        } else {
            return await Api.exportService.exportLogsValues(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), exportInformation, SessionService.timeOut);
        }
    }


    private static updateSignalValues(updates: KeyValuePair<string, any>[], signalValueType: SignalValueType): void {
        if (!updates) return;

        for (let signalUpdate of updates) {
            const signalName = signalUpdate.key;
            const signalValue = signalUpdate.value;

            let signal = SignalsService.getRegisteredSignalByNameOrId(signalName) || SignalsService.getSignal(signalName, false);

            if (!signal) {
                continue;
            }

            signal.setValue(signalValue, signalValueType);
        }
    }

    public static async getSignalsWithAlarmInfo(filter: GetSignalsWithAlarmInfoFilterDTO, start: number, count: number): Promise<SignalWithAlarmInfosDTO> {
        try {
            const securityToken = SessionService.getSecurityToken();

            if (securityToken) {
                return await Api.signalsService.getSignalsWithAlarmInfoByToken(securityToken, filter, SymbolicTextsService.currentLanguageId(), start, count, SessionService.timeOut);
            } else {
                return await Api.signalsService.getSignalsWithAlarmInfo(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), filter, SymbolicTextsService.currentLanguageId(), start, count, SessionService.timeOut);
            }
        } catch (error) {
            Logger.handleError(SignalsService)(error);

            return Promise.resolve(null);
        }
    }
}

export = SignalsService;