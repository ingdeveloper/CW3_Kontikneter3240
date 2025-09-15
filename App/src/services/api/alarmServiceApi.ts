import { CancellationToken } from "../models/cancellation-token-source";
import HttpApi = require("./httpApi");

class AlarmServiceApi extends HttpApi {
    public getOnlineAlarmsByToken = (securityToken: string, filter: AlarmFilterDTO, timeOut: number) => this.post<AlarmsDTO>("AlarmsService", "GetOnlineAlarmsByToken", {
        securityToken: securityToken,
        filter: filter,
        millisecondsTimeOut: timeOut
    });

    public getOnlineAlarms = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, filter: AlarmFilterDTO, timeOut: number, token?: CancellationToken) => this.post<AlarmsDTO>("AlarmsService", "GetOnlineAlarms", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        filter: filter,
        millisecondsTimeOut: timeOut
    }, token);

    public getOfflineAlarms = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, filter: AlarmFilterDTO, timeOut: number, token?: CancellationToken) => this.post<AlarmsDTO>("AlarmsService", "GetOfflineAlarms", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        filter: filter,
        millisecondsTimeOut: timeOut
    }, token);

    public getOfflineAlarmsByToken = (securityToken: string, filter: AlarmFilterDTO, timeOut: number) => this.post<AlarmsDTO>("AlarmsService", "GetOfflineAlarmsByToken", {
        securityToken: securityToken,
        filter: filter,
        millisecondsTimeOut: timeOut
    });

    public getAlarmGroupsByToken = (securityToken: string, languageId: number, timeOut: number) => this.post<AlarmGroupDTO[]>("AlarmsService", "GetAlarmGroupsByToken", {
        securityToken: securityToken,
        languageID: languageId,
        millisecondsTimeOut: timeOut
    });

    public getAlarmGroups = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, languageId: number, timeOut: number) => this.post<AlarmGroupDTO[]>("AlarmsService", "GetAlarmGroups", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        languageID: languageId,
        millisecondsTimeOut: timeOut
    });

    public getAlarmTypesByToken = (securityToken: string, languageId: number, timeOut: number) => this.post<AlarmTypeDTO[]>("AlarmsService", "GetAlarmTypesByToken", {
        securityToken: securityToken,
        languageID: languageId,
        millisecondsTimeOut: timeOut
    });

    public getAlarmTypes = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, languageId: number, timeOut: number) => this.post<AlarmTypeDTO[]>("AlarmsService", "GetAlarmTypes", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        languageID: languageId,
        millisecondsTimeOut: timeOut
    });

    public getAlarmsByToken = (securityToken: string, alarmIds: string[], languageId: number, timeZone: string, timeOut: number, shouldResolvePlaceholders: boolean) => this.post<AlarmsDTO>("AlarmsService", "GetAlarmsByToken", {
        securityToken: securityToken,
        alarmsID: alarmIds,
        languageID: languageId,
        timeZoneID: timeZone,
        millisecondsTimeOut: timeOut,
        shouldResolvePlaceholders: shouldResolvePlaceholders
    });

    public getAlarms = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, alarmIds: string[], languageId: number, timeZone: string, timeOut: number, shouldResolvePlaceholders: boolean) => this.post<AlarmsDTO>("AlarmsService", "GetAlarms", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        alarmsID: alarmIds,
        languageID: languageId,
        timeZoneID: timeZone,
        millisecondsTimeOut: timeOut,
        shouldResolvePlaceholders: shouldResolvePlaceholders
    });

    public acknowledgeAlarms = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, alarmIds: string[], comment: string, timeOut: number) => this.post<AcknowledgeResultDTO>("AlarmsService", "AcknowledgeAlarms", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        alarmIds: alarmIds,
        comment: comment,
        millisecondsTimeOut: timeOut
    });

    public acknowledgeAlarmsByToken = (securityToken: string, alarmIds: string[], comment: string, timeOut: number) => this.post<AcknowledgeResultDTO>("AlarmsService", "AcknowledgeAlarmsByToken", {
        securityToken: securityToken,
        alarmIds: alarmIds,
        comment: comment,
        millisecondsTimeOut: timeOut
    });

    public acknowledgeAllAlarms = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, comment: string, timeOut: number) => this.post<AcknowledgeResultDTO>("AlarmsService", "AcknowledgeAllAlarms", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        comment: comment,
        millisecondsTimeOut: timeOut
    });

    public acknowledgeAllAlarmsByToken = (securityToken: string, comment: string, timeOut: number) => this.post<AcknowledgeResultDTO>("AlarmsService", "AcknowledgeAllAlarmsByToken", {
        securityToken: securityToken,
        comment: comment,
        millisecondsTimeOut: timeOut
    });

    public acknowledgeAllGoneAlarms = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, comment: string, timeOut: number) => this.post<AcknowledgeResultDTO>("AlarmsService", "AcknowledgeAllGoneAlarms", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        comment: comment,
        millisecondsTimeOut: timeOut
    });

    public acknowledgeAllGoneAlarmsByToken = (securityToken: string, comment: string, timeOut: number) => this.post<AcknowledgeResultDTO>("AlarmsService", "AcknowledgeAllGoneAlarmsByToken", {
        securityToken: securityToken,
        comment: comment,
        millisecondsTimeOut: timeOut
    });

    public acknowledgeAlarmsByGroup = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, groupName: string, comment: string, timeOut: number) => this.post<AcknowledgeResultDTO>("AlarmsService", "AcknowledgeAlarmsByGroup", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        groupName: groupName,
        comment: comment,
        millisecondsTimeOut: timeOut
    });

    public acknowledgeAlarmsByGroupByToken = (securityToken: string, groupName: string, comment: string, timeOut: number) => this.post<AcknowledgeResultDTO>("AlarmsService", "AcknowledgeAlarmsByGroupByToken", {
        securityToken: securityToken,
        comment: comment,
        groupName: groupName,
        millisecondsTimeOut: timeOut
    });

    public setAlarmState = (securityToken: string, alarmId: string, state: AlarmProcessingAndDisplayState, reactivation: DateTime, timeOut: number) => this.post<boolean>("AlarmsService", "SetAlarmState", {
        securityToken: securityToken,
        alarmId: alarmId,
        state: state,
        reactivation: reactivation,
        millisecondsTimeOut: timeOut
    });

    public setAlarmStates = (securityToken: string, alarmIds: string[], states: AlarmProcessingAndDisplayState[], reactivations: DateTime[], timeOut: number) => this.post("AlarmsService", "SetAlarmStates", {
        securityToken: securityToken,
        alarmIds: alarmIds,
        states: states,
        reactivations: reactivations,
        millisecondsTimeOut: timeOut
    });

    public getAlarmsWithChangedProcessingAndDisplayState = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, languageID: number, timeOut: number) => this.post<AlarmProcessingAndDisplayDTO[]>("AlarmsService", "GetAlarmsWithChangedProcessingAndDisplayState", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        languageID: languageID,
        millisecondsTimeOut: timeOut
    });

    public getExtendedAlarmProperties = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, timeOut: number) => this.post<ExtendedAlarmPropertyDTO[]>("AlarmsService", "GetExtendedAlarmProperties", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        millisecondsTimeOut: timeOut
    });

    public getExtendedAlarmPropertiesByToken = (securityToken: string, timeOut: number) => this.post<ExtendedAlarmPropertyDTO[]>("AlarmsService", "GetExtendedAlarmPropertiesByToken", {
        securityToken: securityToken,
        millisecondsTimeOut: timeOut
    });
}

export = AlarmServiceApi;