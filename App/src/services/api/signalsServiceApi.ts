import HttpApi = require("./httpApi");
import MsDateTimeOffset = moment.MSDateTimeOffset;

class SignalsServiceApi extends HttpApi {

    public connect = (clientId: string = null, requestedLicenses: string[] = null) => {
        return this.post<SessionDTO>("SignalsService", "Connect", {
            clientId: clientId,
            requestedLicenses: requestedLicenses
        });
    };

    public registerSignals = (sessionId: string, clientId: string, signalNames: string[]) => this.post<number[]>("SignalsService", "RegisterSignals", {
        sessionId: sessionId,
        clientId: clientId,
        signalNames: signalNames
    });

    public unregisterSignals = (sessionId: string, clientId: string, signalNames: string[]) => this.post<number[]>("SignalsService", "UnregisterSignals", {
        sessionId: sessionId,
        clientId: clientId,
        signalNames: signalNames
    });

    public getUpdates = (sessionId: string, clientId: string, requestId: number) => this.post<SignalUpdateDTO>("SignalsService", "GetUpdates", {
        sessionId: sessionId,
        clientId: clientId,
        requestId: requestId
    });

    public readSignals = (sessionId: string, clientId: string, signalNames: string[]) => this.post<SignalValueDTO[]>("SignalsService", "ReadSignals", {
        sessionId: sessionId,
        clientId: clientId,
        signalNames: signalNames
    });

    public writeUnsecuredSignals = (values: KeyValuePair<string, any>[], sessionId: string, clientId: string) => this.post<number[]>("SignalsService", "WriteUnsecuredSignals", {
        sessionId: sessionId,
        clientId: clientId,
        values: values
    });

    public writeSecuredSignals = (values: KeyValuePair<string, any>[], securityToken: string, clientId: string) => this.post<number[]>("SignalsService", "WriteSecuredSignalsByToken", {
        securityToken: securityToken,
        clientId: clientId,
        values: values
    });

    public writeSignalsSecure = (securityToken: string, userPassword: string, values: WritableSignalDTO[]) => this.post<number[]>("SignalsService", "WriteSecuredSignalValuesWithPasswordReinforcement", {
        securityToken: securityToken,
        password: userPassword,
        values: values
    });

    public updateLogValueByToken = (securityToken: string, logId: string, date: moment.Moment, value: number, value2: string, timeOut: number) => this.post<void>("SignalsService", "UpdateLogValueByToken", {
        securityToken: securityToken,
        logId: logId,
        entryDate: date.toMSDateTimeOffset(),
        value: value || null,
        value2: value2 || null,
        millisecondsTimeOut: timeOut
    });

    public updateLogValue = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, logId: string, date: moment.Moment, value: number, value2: string, timeOut: number) => this.post<void>("SignalsService", "UpdateLogValue", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        logId: logId,
        entryDate: date.toMSDateTimeOffset(),
        value: value || null,
        value2: value2 || null,
        millisecondsTimeOut: timeOut
    });

    public getLastValuesBeforeDateByToken = (securityToken: string, logTags: SignalLogTagFilterDTO[], date: MsDateTimeOffset, timeOut: number) => this.post<DatedLogValuesDTO[]>("SignalsService", "GetUTCLastValuesBeforeDateByToken", {
        securityToken: securityToken,
        signalLogTags: logTags,
        date: date,
        millisecondsTimeOut: timeOut
    });

    public getLastValuesBeforeDate = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, logTags: SignalLogTagFilterDTO[], date: MsDateTimeOffset, timeOut: number) => this.post<DatedLogValuesDTO[]>("SignalsService", "GetUTCLastValuesBeforeDate", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        signalLogTags: logTags,
        date: date,
        millisecondsTimeOut: timeOut
    });

    public getLastValuesAfterDateByToken = (securityToken: string, logTags: SignalLogTagFilterDTO[], date: MsDateTimeOffset, timeOut: number) => this.post<DatedLogValuesDTO[]>("SignalsService", "GetUTCLastValuesAfterDateByToken", {
        securityToken: securityToken,
        signalLogTags: logTags,
        date: date,
        millisecondsTimeOut: timeOut
    });

    public getLastValuesAfterDate = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, logTags: SignalLogTagFilterDTO[], date: MsDateTimeOffset, timeOut: number) => this.post<DatedLogValuesDTO[]>("SignalsService", "GetUTCLastValuesAfterDate", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        signalLogTags: logTags,
        date: date,
        millisecondsTimeOut: timeOut
    });

    public getSignalDefinitionsByToken = (securityToken: string, filter: GetSignalDefinitionsFilterDTO, languageId: number, start: number, count: number, timeOut: number) => this.post<SignalDefinitionDTO[]>("SignalsService", "GetSignalDefinitionsByToken", {
        securityToken: securityToken,
        filter: filter,
        languageId: languageId,
        startIndex: start,
        count: count,
        millisecondsTimeOut: timeOut
    });

    public getSignalDefinitions = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, filter: GetSignalDefinitionsFilterDTO, languageId: number, start: number, count: number, timeOut: number) => this.post<SignalDefinitionDTO[]>("SignalsService", "GetSignalDefinitions", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        filter: filter,
        languageId: languageId,
        startIndex: start,
        count: count,
        millisecondsTimeOut: timeOut
    });

    public getLogIdsByToken = (securityToken: string, logTags: SignalLogTagFilterDTO[], timeOut: number) => this.post("SignalsService", "GetLogIDsByToken", {
        securityToken: securityToken,
        signalLogTags: logTags,
        millisecondsTimeOut: timeOut
    });

    public getLogIds = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, logTags: SignalLogTagFilterDTO[], timeOut: number) => this.post("SignalsService", "GetLogIDs", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        signalLogTags: logTags,
        millisecondsTimeOut: timeOut
    });

    public getLogValuesByToken = (securityToken: string, filter: LogValuesFilterDTO, timeOut: number) => this.post<DatedLogValuesDTO[]>("SignalsService", "GetUTCLogValuesByToken", {
        securityToken: securityToken,
        filter: filter,
        millisecondsTimeOut: timeOut
    });

    public getLogValues = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, filter: LogValuesFilterDTO, timeOut: number) => this.post<DatedLogValuesDTO[]>("SignalsService", "GetUTCLogValues", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        filter: filter,
        millisecondsTimeOut: timeOut
    });

    public getLogValuesCountByToken = (securityToken: string, filter: LogStatisticsFilterDTO, timeOut: number) => this.post<number>("SignalsService", "GetLogValuesCountByToken", {
        securityToken: securityToken,
        filter: filter,
        millisecondsTimeOut: timeOut
    });

    public getLogValuesCount = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, filter: LogStatisticsFilterDTO, timeOut: number) => this.post<number>("SignalsService", "GetLogValuesCount", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        filter: filter,
        millisecondsTimeOut: timeOut
    });

    public getPeekLogValuesByToken = (securityToken: string, filter: LogValuesFilterDTO, resolution: number, timeOut: number) => this.post<DatedLogValuesDTO[]>("SignalsService", "GetPeekUTCLogValuesByToken", {
        securityToken: securityToken,
        filter: filter,
        resolution: resolution,
        millisecondsTimeOut: timeOut
    });

    public getPeekLogValues = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, filter: LogValuesFilterDTO, resolution: number, timeOut: number) => this.post<DatedLogValuesDTO[]>("SignalsService", "GetPeekUTCLogValues", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        filter: filter,
        resolution: resolution,
        millisecondsTimeOut: timeOut
    });


    public getLogStatistics = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, filter: LogStatisticsFilterDTO, timeOut: number) => this.post<LogStatisticsDTO[]>("SignalsService", "GetUTCLogStatistics", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        filter: filter,
        millisecondsTimeOut: timeOut
    });

    
    public getLogStatisticsByToken = (securityToken: string, filter: LogStatisticsFilterDTO, timeOut: number) => this.post<LogStatisticsDTO[]>("SignalsService", "GetUTCLogStatisticsByToken", {
        securityToken: securityToken,
        filter: filter,
        millisecondsTimeOut: timeOut
    });

    public getSignalNames = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, filter: GetSignalNamesFilterDTO, languageId: number, startIndex: number, count: number, timeOut: number) => this.post<DescriptionDTO[]>("SignalsService", "GetSignalNames", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        filter: filter,
        languageId: languageId,
        startIndex: startIndex,
        count: count,
        millisecondsTimeOut: timeOut
    });

    public getSignalNamesByToken = (securityToken: string, filter: GetSignalNamesFilterDTO, languageId: number, startIndex: number, count: number, timeOut: number) => this.post<DescriptionDTO[]>("SignalsService", "GetSignalNamesByToken", {
        securityToken: securityToken,
        filter: filter,
        languageId: languageId,
        startIndex: startIndex,
        count: count,
        millisecondsTimeOut: timeOut
    });

    public getGroupNames = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, filter: GetGroupNamesFilterDTO, languageId: number, startIndex: number, count: number, timeOut: number) => this.post<DescriptionDTO[]>("SignalsService", "GetGroupNames", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        filter: filter,
        languageId: languageId,
        startIndex: startIndex,
        count: count,
        millisecondsTimeOut: timeOut
    });

    public getGroupNamesByToken = (securityToken: string, filter: GetGroupNamesFilterDTO, languageId: number, startIndex: number, count: number, timeOut: number) => this.post<DescriptionDTO[]>("SignalsService", "GetGroupNamesByToken", {
        securityToken: securityToken,
        filter: filter,
        languageId: languageId,
        startIndex: startIndex,
        count: count,
        millisecondsTimeOut: timeOut
    });

    public getLogs = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, signalId: string, languageId: number, timeOut: number) => this.post<LogDTO[]>("SignalsService", "GetLogs", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        signalId: signalId,
        languageId: languageId,
        millisecondsTimeOut: timeOut
    });

    public getLogsByToken = (securityToken: string, signalId: string, languageId: number, timeOut: number) => this.post<LogDTO[]>("SignalsService", "GetLogsByToken", {
        securityToken: securityToken,
        signalId: signalId,
        languageId: languageId,
        millisecondsTimeOut: timeOut
    });

    public getAllWriteGroup = (securityToken: string, timeOut: number) => this.post<WriteGroupDTO[]>("SignalsService", "GetAllWriteGroupByToken", {
        securityToken: securityToken,
        millisecondsTimeOut: timeOut
    });

    public getSignalsWithAlarmInfo = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, filter: GetSignalsWithAlarmInfoFilterDTO, languageId: number, start: number, count: number, timeOut: number) => this.post<SignalWithAlarmInfosDTO>("SignalsService", "GetSignalsWithAlarmInfo", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        filter: filter,
        languageId: languageId,
        startIndex: start,
        count: count,
        millisecondsTimeOut: timeOut
    });

    public getSignalsWithAlarmInfoByToken = (securityToken: string, filter: any, languageId: number, start: number, count: number, timeOut: number) => this.post<SignalWithAlarmInfosDTO>("SignalsService", "GetSignalsWithAlarmInfoByToken", {
        securityToken: securityToken,
        filter: filter,
        languageId: languageId,
        startIndex: start,
        count: count,
        millisecondsTimeOut: timeOut
    });
}

export = SignalsServiceApi;