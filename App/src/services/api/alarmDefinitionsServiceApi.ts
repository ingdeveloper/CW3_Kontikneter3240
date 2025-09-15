import HttpApi = require("./httpApi");

class AlarmDefinitionsServiceApi extends HttpApi {

    public getAlarmDefinitions = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, filter: AlarmDefinitionFilterDTO, timeOut: number) => this.post<AlarmDefinitionsDTO>("AlarmsService", "GetAlarmDefinitions", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        filter: filter,
        millisecondsTimeOut: timeOut
    });

}

export = AlarmDefinitionsServiceApi;