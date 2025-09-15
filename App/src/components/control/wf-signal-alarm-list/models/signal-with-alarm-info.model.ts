import AlarmsService = require("../../../../services/alarmsService");

enum MultipleStates {
    MultipleStates = 4
}

type AlarmProcessingAndDisplayStateWithMultipleStates = MultipleStates | AlarmProcessingAndDisplayState;

export interface IBackgroundForegroundColors {
    inactiveAlarmForeground: string;
    inactiveAlarmBackground: string;
    acknowledgedAlarmForeground: string;
    acknowledgedAlarmBackground: string;
    onAlarmForeground: string;
    onAlarmBackground: string;
    offAlarmForeground: string;
    offAlarmBackground: string;
    rowItemCssClass: string;
}

export class SignalWithAlarmInfo {
    public signalId: System.Guid;
    public name: string;
    public aliasName: string;
    public description: string;
    public unit: string;
    public discreteValueTypeID: System.Guid;
    public discreteValues: DiscreteValueDTO[];

    public alarmInfos: AlarmInfoDTO[];

    public notProcessedButVisibleCount = ko.observable<number>();
    public processedAndVisibleCount = ko.observable<number>();
    public notProcessedAndNotVisibleCount = ko.observable<number>();
    public processedButNotVisibleCount = ko.observable<number>();

    public inactiveCount = ko.observable<number>();
    public onCount = ko.observable<number>();
    public acknowledgedCount = ko.observable<number>();
    public offCount = ko.observable<number>();

    public value = ko.observable<any>();

    public inactiveAlarmForeground: string;
    public inactiveAlarmBackground: string;
    public acknowledgedAlarmForeground: string;
    public acknowledgedAlarmBackground: string;
    public onAlarmForeground: string;
    public onAlarmBackground: string;
    public offAlarmForeground: string;
    public offAlarmBackground: string;
    public rowItemCssClass: string;

    public isDateTime: KnockoutComputed<boolean>;

    public onlineAlarmStatus = ko.pureComputed(() => {
        if (this.onCount()) {
            return `signal-alarm-status-on ${this.rowItemCssClass}`
        }
        if (this.acknowledgedCount()) {
            return `signal-alarm-status-acknowledged ${this.rowItemCssClass}`;
        }
        if (this.offCount()) {
            return `signal-alarm-status-off ${this.rowItemCssClass}`;
        }
        if (this.inactiveCount()) {
            return `signal-alarm-status-inactive ${this.rowItemCssClass}`;
        }
    });

    public background = ko.pureComputed(() => {
        if (this.onCount() && this.onAlarmBackground) {
            return this.onAlarmBackground;
        }
        if (this.acknowledgedCount() && this.acknowledgedAlarmBackground) {
            return this.acknowledgedAlarmBackground;
        }
        if (this.offCount() && this.offAlarmBackground) {
            return this.offAlarmBackground;
        }
        if (this.inactiveCount() && this.inactiveAlarmBackground) {
            return this.inactiveAlarmBackground;
        }
    });

    public foreground = ko.pureComputed(() => {
        if (this.onCount() && this.onAlarmForeground) {
            return this.onAlarmForeground;
        }
        if (this.acknowledgedCount() && this.acknowledgedAlarmForeground) {
            return this.acknowledgedAlarmForeground;
        }
        if (this.offCount() && this.offAlarmForeground) {
            return this.offAlarmForeground;
        }
        if (this.inactiveCount() && this.inactiveAlarmForeground) {
            return this.inactiveAlarmForeground;
        }
    });

    public alarmProcessingAndDisplayStatus = ko.pureComputed<AlarmProcessingAndDisplayStateWithMultipleStates>(() => {
        const test = [
            {
                state: AlarmProcessingAndDisplayState.NotProcessedButVisible,
                value: this.notProcessedButVisibleCount()
            },
            {
                state: AlarmProcessingAndDisplayState.ProcessedAndVisible,
                value: this.processedAndVisibleCount()
            },
            {
                state: AlarmProcessingAndDisplayState.NotProcessedAndNotVisible,
                value: this.notProcessedAndNotVisibleCount()
            },
            {
                state: AlarmProcessingAndDisplayState.ProcessedButNotVisible,
                value: this.processedButNotVisibleCount()
            }
        ];

        var items = test.filter(x => x.value !== 0 && x.value !== null && x.value !== undefined)
        if (items.length === 1) {
            return items[0].state;
        } else {
            return MultipleStates.MultipleStates;
        }
    });

    public getStateText(state: AlarmProcessingAndDisplayStateWithMultipleStates) {
        const states = { ...AlarmProcessingAndDisplayState, ...MultipleStates };
        return `I4SCADA_${states[state]}`;
    }

    constructor(item: SignalWithAlarmInfoDTO, discreteValues: DiscreteValueDTO[], colors: IBackgroundForegroundColors, public activateOrDeactivateAlarmState: (ids: System.Guid[], state: AlarmProcessingAndDisplayState) => void = () => { }) {
        this.discreteValues = discreteValues;
        this.signalId = item.SignalId;
        this.name = item.Name;
        this.aliasName = item.AliasName;
        this.description = item.Description;
        this.unit = item.Unit;
        this.discreteValueTypeID = item.DiscreteValueTypeID;
        this.notProcessedButVisibleCount(item.NotProcessedButVisibleCount);
        this.processedAndVisibleCount(item.ProcessedAndVisibleCount);
        this.notProcessedAndNotVisibleCount(item.NotProcessedAndNotVisibleCount);
        this.processedButNotVisibleCount(item.ProcessedButNotVisibleCount);
        this.inactiveCount(item.InactiveCount);
        this.onCount(item.OnCount);
        this.acknowledgedCount(item.AcknowledgedCount);
        this.offCount(item.OffCount);
        this.alarmInfos = item.AlarmInfos;

        this.inactiveAlarmForeground = colors.inactiveAlarmForeground;
        this.inactiveAlarmBackground = colors.inactiveAlarmBackground;
        this.onAlarmForeground = colors.onAlarmForeground;
        this.onAlarmBackground = colors.onAlarmBackground;
        this.offAlarmForeground = colors.offAlarmForeground;
        this.offAlarmBackground = colors.offAlarmBackground;
        this.acknowledgedAlarmForeground = colors.acknowledgedAlarmForeground;
        this.acknowledgedAlarmBackground = colors.acknowledgedAlarmBackground;
        this.rowItemCssClass = colors.rowItemCssClass;
    }

    public updateCounts(item: SignalWithAlarmInfoDTO) {
        this.notProcessedButVisibleCount(item.NotProcessedButVisibleCount);
        this.processedAndVisibleCount(item.ProcessedAndVisibleCount);
        this.notProcessedAndNotVisibleCount(item.NotProcessedAndNotVisibleCount);
        this.processedButNotVisibleCount(item.ProcessedButNotVisibleCount);

        this.inactiveCount(item.InactiveCount);
        this.onCount(item.OnCount);
        this.acknowledgedCount(item.AcknowledgedCount);
        this.offCount(item.OffCount);

        this.alarmInfos = item.AlarmInfos;
    }

    public updateValue(value: KnockoutObservable<any>) {
        this.value = value;
        this.isDateTime = ko.computed(() => {
            const date = this.value();
            if (typeof date === 'string') {
                const isDate = /\/Date\([0-9]{13}\+[0-9]{4}\)\//g
                return isDate.test(date);
            }
            return false;
        });

        return this;
    }

    public async onChangeProcessingAndDisplayState(alarm: SignalWithAlarmInfo, event: any) {
        var state = parseInt($(event.target).val());
        this.activateOrDeactivateAlarmState(alarm.alarmInfos.map(x => x.AlarmId), state);
    }
}
