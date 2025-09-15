import OnlineAlarmSource = require("./onlineAlarmSource");
import OfflineAlarmSource = require("./offlineAlarmSource");
import AlarmSource = require("./alarmSource");
import Api = require("./api");
import Logger = require("./logger");
import AlarmsFilter = require("./models/alarmsFilter");
import SessionService = require("./sessionService");
import ConnectorService = require("./connectorService");
import Moment = moment.Moment;

class AlarmsService {
    public static onlineAlarmsUpdateRate = 2000;
    public static offlineAlarmsUpdateRate = 1000;
    public static timeOut = 10000;

    public static getOnlineAlarms(filter: AlarmsFilter, updateRate: number): AlarmSource {
        return new OnlineAlarmSource(filter, updateRate || AlarmsService.onlineAlarmsUpdateRate);
    }


    public static getOfflineAlarms(filter: AlarmsFilter): AlarmSource {
        return new OfflineAlarmSource(filter, AlarmsService.offlineAlarmsUpdateRate);
    }

    public static async getAlarmGroups(languageId: number) {
        var securityToken = SessionService.getSecurityToken();
        if (securityToken) {
            return await Api.alarmsService.getAlarmGroupsByToken(securityToken, languageId, SessionService.timeOut);
        } else {
            await ConnectorService.connect();
            return await Api.alarmsService.getAlarmGroups(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), languageId, SessionService.timeOut);
        }
    }

    public static async getAlarmTypes(languageId: number) {
        var securityToken = SessionService.getSecurityToken();
        if (securityToken) {
            return await Api.alarmsService.getAlarmTypesByToken(securityToken, languageId, SessionService.timeOut);
        } else {
            await ConnectorService.connect();
            return await Api.alarmsService.getAlarmTypes(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), languageId, SessionService.timeOut);
        }
    }

    public static async getAlarms(alarmIds: string[], languageId: number) {
        var securityToken = SessionService.getSecurityToken();
        if (securityToken) {
            return await Api.alarmsService.getAlarmsByToken(securityToken, alarmIds, languageId, window.defaultTimeZone, SessionService.timeOut, true);
        } else {
            await ConnectorService.connect();
            return await Api.alarmsService.getAlarms(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), alarmIds, languageId, window.defaultTimeZone, SessionService.timeOut, true);
        }
    }

    public static async acknowledgeAlarms(alarmIds: string[], comment: string): Promise<AcknowledgeResultDTO> {
        Logger.info(AlarmsService, `Acknowledging alarms (${comment})`);

        var securityToken = SessionService.getSecurityToken();
        if (securityToken) {
            return await Api.alarmsService.acknowledgeAlarmsByToken(securityToken, alarmIds, comment, SessionService.timeOut);
        } else {
            await ConnectorService.connect();
            return await Api.alarmsService.acknowledgeAlarms(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), alarmIds, comment, SessionService.timeOut);
        }
    }

    public static async acknowledgeAllAlarms(comment: string) {
        Logger.info(AlarmsService, `Acknowledging all alarms ${comment}`);

        var securityToken = SessionService.getSecurityToken();
        if (securityToken) {
            return await Api.alarmsService.acknowledgeAllAlarmsByToken(securityToken, comment, SessionService.timeOut);
        } else {
            await ConnectorService.connect();
            return await Api.alarmsService.acknowledgeAllAlarms(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), comment, SessionService.timeOut);
        }
    }

    public static async acknowledgeAllGoneAlarms(comment: string) {
        Logger.info(AlarmsService, `Acknowledging all gone alarms ${comment}`);

        var securityToken = SessionService.getSecurityToken();
        if (securityToken) {
            return await Api.alarmsService.acknowledgeAllGoneAlarmsByToken(SessionService.getSecurityToken(), comment, SessionService.timeOut);
        } else {
            await ConnectorService.connect();
            return await Api.alarmsService.acknowledgeAllGoneAlarms(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), comment, SessionService.timeOut);
        }
    }

    public static async acknowledgeAlarmsByGroup(groupName: string, comment: string) {
        Logger.info(AlarmsService, `Acknowledging  in group '${groupName}' (${comment})`);

        var securityToken = SessionService.getSecurityToken();
        if (securityToken) {
            return await Api.alarmsService.acknowledgeAlarmsByGroupByToken(SessionService.getSecurityToken(), groupName, comment, SessionService.timeOut);
        } else {
            await ConnectorService.connect()
            return await Api.alarmsService.acknowledgeAlarmsByGroup(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), groupName, comment, SessionService.timeOut);
        }
    }

    public static async setAlarmState(alarmId: string, state: AlarmProcessingAndDisplayState, reactivation: Moment) {
        return await Api.alarmsService.setAlarmState(SessionService.getSecurityToken(), alarmId, state, reactivation.toMSDate(), SessionService.timeOut);
    }

    public static async setAlarmStates(alarmIds: string[], states: AlarmProcessingAndDisplayState[], reactivations: DateTime[]) {
        return await Api.alarmsService.setAlarmStates(SessionService.getSecurityToken(), alarmIds, states, reactivations, SessionService.timeOut);
    }

    public static async getAlarmsWithChangedProcessingAndDisplayState(languageId: number) {
        return Api.alarmsService.getAlarmsWithChangedProcessingAndDisplayState(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), languageId, SessionService.timeOut);
    }

    public static async getExtendedAlarmProperties() {
        var securityToken = SessionService.getSecurityToken();
        if (securityToken) {
            return await Api.alarmsService.getExtendedAlarmPropertiesByToken(SessionService.getSecurityToken(), SessionService.timeOut);
        } else {
            await ConnectorService.connect()
            return await Api.alarmsService.getExtendedAlarmProperties(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(),  SessionService.timeOut);
        }
    }
}

export = AlarmsService;