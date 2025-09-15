import Api = require("./api");
import AlarmSource = require("./alarmSource");
import AlarmsFilter = require("./models/alarmsFilter");
import SessionService = require("./sessionService");
import ConnectorService = require("./connectorService");
import { CancellationToken } from "./models/cancellation-token-source";
import Logger = require("./logger");

class OfflineAlarmSource extends AlarmSource {
    private resetIdentity = true;

    private identityNumber = 0;
    private rowNumber = 0;
    private hasMore = true;
    
    constructor(filter: AlarmsFilter, updateRate: number) {
        super(filter, updateRate);
    }

    public clearPolling() {
        if (ko.unwrap(this.isPollingEnabled)) {
            return;
        }

        this.alarms([]);
        this.identityNumber = 0;
        this.rowNumber = 0;
        this.hasMore = true;
    }

    public startPolling() {
        if (ko.unwrap(this.isPollingEnabled) || !this.hasMore) {
            return;
        }

        super.startPolling();
    }

    protected getAlarms(token: CancellationToken): any {
        const filterDto = this.getFilterDto();
        filterDto.IdentityNumber = this.identityNumber;
        filterDto.RowNumber = this.rowNumber;

        ConnectorService.connect()
            .then(() => Api.alarmsService.getOfflineAlarms(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), filterDto, SessionService.timeOut, token))
            .then((alarm) => {

                this.identityNumber = alarm.IdentityNumber;
                this.rowNumber = alarm.RowNumber;
                this.hasMore = alarm.HasMore;

                Array.prototype.push.apply(this.alarms(), this.getAlarmsWithTimeFieldsAdjusted(alarm.Alarms)); // this works faster as js concat
                this.alarms.valueHasMutated();

               this.stopPolling();
            })
            .catch((err) => {
                Logger.info(this, "Unable to get offline alarms.", err);
            });
    }

    protected pollData(immediate = true): any {
        if (!ko.unwrap(this.isPollingEnabled)) {
            return;
        }

        this.getAlarms(this.cancellationTokenSource.token);
    }
}

export = OfflineAlarmSource;