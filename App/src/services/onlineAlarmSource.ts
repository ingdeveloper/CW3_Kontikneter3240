import Api = require("./api");
import AlarmSource = require("./alarmSource");
import AlarmsFilter = require("./models/alarmsFilter");
import SessionService = require("./sessionService");
import ConnectorService = require("./connectorService");
import { CancellationToken } from "./models/cancellation-token-source";
import Logger = require("./logger");

class OnlineAlarmSource extends AlarmSource {

    constructor(filter: AlarmsFilter, updateRate: number) {
        super(filter, updateRate);
    }

    protected getAlarms(token: CancellationToken) {
        ConnectorService.connect()
            .then(() => {
                return Api.alarmsService.getOnlineAlarms(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), this.getFilterDto(), SessionService.timeOut, token)
            })
            .then((alarm: any) => {
                this.alarms(this.getAlarmsWithTimeFieldsAdjusted(alarm.Alarms));
                this.pollData(false);
            })
            .catch((err) => {
                Logger.info(this, "Unable to get online alarms.", err);
                this.pollData(false);
            });
    }
}

export = OnlineAlarmSource;