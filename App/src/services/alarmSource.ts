import AlarmsFilter = require("./models/alarmsFilter");
import { CancellationToken, CancellationTokenSource } from "./models/cancellation-token-source";

abstract class AlarmSource {
    protected isPollingEnabled = ko.observable(false);
    public alarms = ko.observableArray<AlarmDTO>([]);
    private timeoutId: number = -1;

    public isPolling: any;

    protected cancellationTokenSource  = new CancellationTokenSource();

    constructor(public filter: AlarmsFilter, public updateRate: number) {
        this.isPolling = ko.computed(() => {
            return this.isPollingEnabled();
        });
    }

    public clearPolling() { }

    public startPolling() {
        if (ko.unwrap(this.isPollingEnabled)) {
            return;
        }
        this.cancellationTokenSource = new CancellationTokenSource();
        this.isPollingEnabled(true);
        this.pollData(true);
    }

    public stopPolling() {
        this.isPollingEnabled(false);
        this.clearTimer();
        this.cancellationTokenSource.cancel();
    }

    protected pollData(immediate = true): void {
        if (!ko.unwrap(this.isPollingEnabled)) {
            return;
        }

        const timeout = immediate ? 0 : this.updateRate;

        this.triggerTimer(timeout);
    }

    private triggerTimer(timeout: number) {
        if (this.timeoutId !== -1) {
            return;
        }

        this.timeoutId = window.setTimeout(() => {
            this.clearTimer();
            return this.getAlarms(this.cancellationTokenSource.token);
        }, timeout);
    }

    private clearTimer() {
        clearTimeout(this.timeoutId);
        this.timeoutId = -1;
    }

    protected abstract getAlarms(token: CancellationToken);

    protected getFilterDto() {
        return this.filter.toDto();
    }

    public getAlarmsWithTimeFieldsAdjusted(alarms: AlarmDTO[]): AlarmDTO[] {
        if (!alarms) return alarms;

        return _.map(alarms, (alarm) => {
            this.adjustAlarmTimeFields(alarm);
            return alarm;
        });
    }


    public adjustAlarmTimeFields(alarm: AlarmDTO): void {
        if (!alarm) return;

        alarm.DateOn = this.adjustDateToTimezone(alarm.DateOn);
        alarm.DateOff = this.adjustDateToTimezone(alarm.DateOff);
        alarm.DateAck = this.adjustDateToTimezone(alarm.DateAck);
        alarm.SysTime = this.adjustDateToTimezone(alarm.SysTime);
    }

    private adjustDateToTimezone(date: DateTime | Date): Date | null {
        if (!date) return null;

        const momentDate = moment(date);
        momentDate.add(momentDate.utcOffset(), "minutes");

        return momentDate.local().toDate();
    }
}

export = AlarmSource;