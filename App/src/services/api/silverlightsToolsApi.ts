import HttpApi = require("./httpApi");

class SilverlightToolsApi extends HttpApi {

    public getWFEventsByToken = (securityToken: string, wFEventFilter: WFEventFilter, timeOut: number) => this.post<WFEvent[]>("SilverlightTools", "GetWFEventsByToken", {
            securityToken: securityToken,
            filter: wFEventFilter,
            millisecondsTimeOut: timeOut
        });

    public getWFEvents = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, wFEventFilter: WFEventFilter, timeOut: number) => this.post<WFEvent[]>("SilverlightTools", "GetWFEvents", {
            sessionId: sessionId,
            clientId: clientId,
            userName: userName,
            isDomainUser: isDomainUser,
            filter: wFEventFilter,
            millisecondsTimeOut: timeOut
        });

        public logUserActivityByToken = (securityToken: string,  eventDataDTO: EventDataDTO, timeOut: number) => this.post<boolean>("SilverlightTools", "LogUserActivityByToken", {
            securityToken: securityToken,
            eventDataDTO: eventDataDTO,
            millisecondsTimeOut: timeOut
        });

        public getUserActivityEventsByToken = (securityToken: string,  userActivityEventFilter: UserActivityEventFilter, timeOut: number) => this.post<UserActivityEvent>("SilverlightTools", "GetUserActivityEventsByToken", {
            securityToken: securityToken,
            userActivityEventFilter: userActivityEventFilter,
            millisecondsTimeOut: timeOut
        });
}

export = SilverlightToolsApi;