import Api = require("./api");
import Logger = require("./logger");
import SessionService = require("./sessionService");
import ConnectorService = require("./connectorService");

class AlarmDefinitionsService {

    public static timeOut = 10000;

    public static async getAlarmDefinitions(filter: AlarmDefinitionFilterDTO) {
        await ConnectorService.connect();
        return Api.alarmDefinitionsService.getAlarmDefinitions(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), filter, AlarmDefinitionsService.timeOut);
    }

}


export = AlarmDefinitionsService;