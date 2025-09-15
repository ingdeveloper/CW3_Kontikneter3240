import OperationDiarySource = require("../../services/operationDiarySource");
import OperationDiaryFilter = require("../../services/models/operationDiaryFilter");

import ComponentBaseModel = require("../component-base.model");
import Moment = moment.Moment;

declare var uuid;

interface IWfEventsParams extends IComponentBaseParams {
    height: number;
    headerVisibility: boolean;
    settingsButtonVisibility: boolean;
    settingsAlarmButtonVisibility: boolean;
    settingsTimeButtonVisibility: boolean;
    settingsServerButtonVisibility: boolean;
    settingsUserButtonVisibility: boolean;
    settingsAffectedUserButtonVisibility: boolean;
    titleText: string;
    buttonBarCssClass: string;
    panelBarCssClass: string;

    startOffset: "minutes" | "seconds" | "days" | "weeks" | "months" | "years";
    startOffsetIntervall: number;

    endOffset: "minutes" | "seconds" | "days" | "weeks" | "months" | "years";
    endOffsetIntervall: number;

    filterAlarmOn: boolean;//= 1
    filterAlarmOff: boolean;//= 2
    filterAlarmAcknowledged: boolean;//= 3
    filterAlarmActivated: boolean;//= 9
    filterAlarmDeactivated: boolean;//= 10

    filterServerStarted: boolean;//= 4
    filterServerStopped: boolean;//= 5

    filterUserLoggedIn: boolean;// 6,
    filterUserLoggedOut: boolean;// 7,
    filterUserWroteSignal: boolean;// 8,

    filterUserCreated: boolean;//= 11
    filterUserModified: boolean; //= 12
    filterUserDeleted: boolean; //= 13
    filterUserPasswordChanged: boolean;//= 14

    alarmPriorityFrom: number;
    alarmPriorityTo: number;
    maxEvents: number;
    customUserNameFilter: string;
}

class WfEventsComponent extends ComponentBaseModel<IWfEventsParams> {

    private subscriptions: KnockoutSubscription[] = [];

    private filter: OperationDiaryFilter;
    private events: KnockoutObservableArray<WFEvent>;
    private source: OperationDiarySource;

    private readonly alarmGroups = ko.observableArray<AlarmGroupDTO>();
    private readonly alarmTypes = ko.observableArray<AlarmTypeDTO>();
    private readonly selectedAlarmTypes = ko.observableArray<string>([]);
    private readonly selectedAlarmGroups = ko.observableArray<string>([]);

    private users: KnockoutObservableArray<UserDTO> = ko.observableArray();

    public height: KnockoutObservable<number>;
    public panelBodyHeight: KnockoutComputed<number>;
    public headerVisibility: KnockoutObservable<boolean>;
    public settingsButtonVisibility: KnockoutObservable<boolean>;
    public settingsAlarmButtonVisibility: KnockoutObservable<boolean>;
    public settingsTimeButtonVisibility: KnockoutObservable<boolean>;
    public settingsServerButtonVisibility: KnockoutObservable<boolean>;
    public settingsUserButtonVisibility: KnockoutObservable<boolean>;
    public settingsAffectedUserButtonVisibility: KnockoutObservable<boolean>;
    public titleText: KnockoutObservable<string>;
    public panelBarCssClass: string;
    public buttonBarCssClass: string;

    public readonly showAlarmSettingsDialog: KnockoutObservable<boolean> = ko.observable(false);
    public readonly showTimeSettingsDialog: KnockoutObservable<boolean> = ko.observable(false);
    public readonly showServerSettingsDialog: KnockoutObservable<boolean> = ko.observable(false);
    public readonly showUserSettingsDialog: KnockoutObservable<boolean> = ko.observable(false);
    public readonly showAffectedUserSettingsDialog: KnockoutObservable<boolean> = ko.observable(false);

    private endDateInput: KnockoutObservable<Moment>;
    private startDateInput: KnockoutObservable<Moment>;
    private endDate: KnockoutObservable<Moment>;
    private startDate: KnockoutObservable<Moment>;
    private timeRangeDateInput: KnockoutObservable<Moment>;
    private selectedRangeInput: KnockoutObservable<CalendarTimeRanges>;
    private selectedRange: KnockoutObservable<CalendarTimeRanges>;
    private startOffsetIntervall: number;
    private startOffset: string;
    private endOffset: string;
    private endOffsetIntervall: number;

    private filterAlarmOn: KnockoutObservable<boolean>;//= 1
    private filterAlarmOff: KnockoutObservable<boolean>;//= 2
    private filterAlarmAcknowledged: KnockoutObservable<boolean>;//= 3
    private filterAlarmActivated: KnockoutObservable<boolean>;//= 9
    private filterAlarmDeactivated: KnockoutObservable<boolean> //= 10
    private filterServerStarted: KnockoutObservable<boolean> //= 4
    private filterServerStopped: KnockoutObservable<boolean> //= 5
    private filterUserLoggedIn: KnockoutObservable<boolean> //= 6
    private filterUserLoggedOut: KnockoutObservable<boolean> //= 7
    private filterUserWroteSignal: KnockoutObservable<boolean> //= 8
    private filterUserCreated: KnockoutObservable<boolean> //= 11
    private filterUserModified: KnockoutObservable<boolean> //= 12
    private filterUserDeleted: KnockoutObservable<boolean> //= 13
    private filterUserPasswordChanged: KnockoutObservable<boolean> //= 14

    private alarmPriorityFrom: KnockoutObservable<number>;
    private alarmPriorityTo: KnockoutObservable<number>;
    private maxEvents: KnockoutObservable<number>;
    private customUserNameFilter: KnockoutObservable<string>;

    constructor(params: IWfEventsParams) {
        super(params)

        this.setEvents();
        this.initializeFilterAsync();

        this.subscriptions.push(this.connector.currentLoggedInUser.subscribe(this.resetSource));
        this.subscriptions.push(this.connector.currentLanguageId.subscribe(this.resetSource));

        this.subscriptions.push(this.selectedAlarmTypes.subscribe(this.resetSource));
        this.subscriptions.push(this.selectedAlarmGroups.subscribe(this.resetSource));
        this.subscriptions.push(this.filterAlarmOn.subscribe(this.resetSource));
        this.subscriptions.push(this.filterAlarmOff.subscribe(this.resetSource));
        this.subscriptions.push(this.filterAlarmAcknowledged.subscribe(this.resetSource));
        this.subscriptions.push(this.filterAlarmActivated.subscribe(this.resetSource));
        this.subscriptions.push(this.filterAlarmDeactivated.subscribe(this.resetSource));
        this.subscriptions.push(this.filterServerStarted.subscribe(this.resetSource));
        this.subscriptions.push(this.filterServerStopped.subscribe(this.resetSource));
        this.subscriptions.push(this.filterUserLoggedIn.subscribe(this.resetSource));
        this.subscriptions.push(this.filterUserLoggedOut.subscribe(this.resetSource));
        this.subscriptions.push(this.filterUserWroteSignal.subscribe(this.resetSource));
        this.subscriptions.push(this.filterUserCreated.subscribe(this.resetSource));
        this.subscriptions.push(this.filterUserDeleted.subscribe(this.resetSource));
        this.subscriptions.push(this.filterUserModified.subscribe(this.resetSource));
        this.subscriptions.push(this.filterUserPasswordChanged.subscribe(this.resetSource));
        this.subscriptions.push(this.alarmPriorityFrom.subscribe(this.resetSource));
        this.subscriptions.push(this.alarmPriorityTo.subscribe(this.resetSource));
        this.subscriptions.push(this.customUserNameFilter.subscribe(this.resetSource));
        this.subscriptions.push(this.maxEvents.subscribe(this.resetSource));

        this.subscriptions.push(this.connector.currentLanguageId.subscribe(this.getAlarmGroupsAsync));
        this.subscriptions.push(this.connector.currentLanguageId.subscribe(this.getAlarmTypesAsync));

        this.subscriptions.push(this.connector.currentLoggedInUser.subscribe(this.getAlarmGroupsAsync));
        this.subscriptions.push(this.connector.currentLoggedInUser.subscribe(this.getAlarmTypesAsync));

        this.getAlarmGroupsAsync();
        this.getAlarmTypesAsync();

        this.connector.getOnlineUpdates();

    }

    private resetSource = () => {
        this.setFilter();
        this.source.getWFEvents();
    }

    protected initializeSettings() {
        super.initializeSettings();

        // this.showAlarmSettingsDialog = ko.observable(false);
        // this.showTimeSettingsDialog = ko.observable(false);
        // this.showServerSettingsDialog = ko.observable(false);
        // this.showUserSettingsDialog = ko.observable(false);
        // this.showAffectedUserSettingsDialog = ko.observable(false);

        this.headerVisibility = ko.observable(ko.unwrap(this.settings.headerVisibility) !== undefined ? ko.unwrap(this.settings.headerVisibility) : true);
        this.settingsButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsButtonVisibility) : true);
        this.settingsTimeButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsTimeButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsTimeButtonVisibility) : true);
        this.settingsAlarmButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsAlarmButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsAlarmButtonVisibility) : true);
        this.settingsServerButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsServerButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsServerButtonVisibility) : true);
        this.settingsUserButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsUserButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsUserButtonVisibility) : true);
        this.settingsAffectedUserButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsAffectedUserButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsAffectedUserButtonVisibility) : true);
        this.height = ko.observable(ko.unwrap(this.settings.height) || null);

        this.panelBodyHeight = ko.pureComputed(() => {
            if (!this.height()) {
                return null;
            }
            if (this.headerVisibility()) {
                return this.height() - 42;
            }
            return this.height();
        });

        this.titleText = ko.observable(ko.unwrap(this.settings.titleText) || "WEBfactory Events Component Beta");

        this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
        this.panelBarCssClass = ko.unwrap(this.settings.panelBarCssClass) || "panel panel-default";

        this.startOffset = ko.unwrap(this.settings.startOffset) ? ko.unwrap(this.settings.startOffset).trim().toLowerCase() : "minutes"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
        this.startOffsetIntervall = ko.unwrap(this.settings.startOffsetIntervall) ? ko.unwrap(this.settings.startOffsetIntervall) : 30;

        this.endOffset = ko.unwrap(this.settings.endOffset) ? ko.unwrap(this.settings.endOffset).trim().toLowerCase() : "minutes"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
        this.endOffsetIntervall = ko.unwrap(this.settings.endOffsetIntervall) ? ko.unwrap(this.settings.endOffsetIntervall) : 0;

        this.startDate = ko.observable(moment().subtract(this.startOffsetIntervall, this.startOffset));
        this.endDate = ko.observable(moment().add(this.endOffsetIntervall, this.endOffset));

        this.startDateInput = ko.observable(moment(this.startDate()));
        this.endDateInput = ko.observable(moment(this.endDate()));

        this.selectedRange = ko.observable(CalendarTimeRanges.Custom);
        this.selectedRangeInput = ko.observable(this.selectedRange());
        this.timeRangeDateInput = ko.observable<Moment>();

        this.filterAlarmOn = ko.observable(ko.unwrap(this.settings.filterAlarmOn) !== undefined ? ko.unwrap(this.settings.filterAlarmOn) : true);
        this.filterAlarmOff = ko.observable(ko.unwrap(this.settings.filterAlarmOff) !== undefined ? ko.unwrap(this.settings.filterAlarmOff) : true);
        this.filterAlarmAcknowledged = ko.observable(ko.unwrap(this.settings.filterAlarmAcknowledged) !== undefined ? ko.unwrap(this.settings.filterAlarmAcknowledged) : true);
        this.filterAlarmActivated = ko.observable(ko.unwrap(this.settings.filterAlarmActivated) !== undefined ? ko.unwrap(this.settings.filterAlarmActivated) : true);
        this.filterAlarmDeactivated = ko.observable(ko.unwrap(this.settings.filterAlarmDeactivated) !== undefined ? ko.unwrap(this.settings.filterAlarmDeactivated) : true);
        this.filterServerStarted = ko.observable(ko.unwrap(this.settings.filterServerStarted) !== undefined ? ko.unwrap(this.settings.filterServerStarted) : true);
        this.filterServerStopped = ko.observable(ko.unwrap(this.settings.filterServerStopped) !== undefined ? ko.unwrap(this.settings.filterServerStopped) : true);
        this.filterUserLoggedIn = ko.observable(ko.unwrap(this.settings.filterUserLoggedIn) !== undefined ? ko.unwrap(this.settings.filterUserLoggedIn) : true);
        this.filterUserLoggedOut = ko.observable(ko.unwrap(this.settings.filterUserLoggedOut) !== undefined ? ko.unwrap(this.settings.filterUserLoggedOut) : true);
        this.filterUserWroteSignal = ko.observable(ko.unwrap(this.settings.filterUserWroteSignal) !== undefined ? ko.unwrap(this.settings.filterUserWroteSignal) : true);
        this.filterUserCreated = ko.observable(ko.unwrap(this.settings.filterUserCreated) !== undefined ? ko.unwrap(this.settings.filterUserCreated) : true);
        this.filterUserDeleted = ko.observable(ko.unwrap(this.settings.filterUserDeleted) !== undefined ? ko.unwrap(this.settings.filterUserDeleted) : true);
        this.filterUserModified = ko.observable(ko.unwrap(this.settings.filterUserModified) !== undefined ? ko.unwrap(this.settings.filterUserModified) : true);
        this.filterUserPasswordChanged = ko.observable(ko.unwrap(this.settings.filterUserPasswordChanged) !== undefined ? ko.unwrap(this.settings.filterUserPasswordChanged) : true);

        this.alarmPriorityFrom = ko.observable(ko.unwrap(this.settings.alarmPriorityFrom) !== undefined ? ko.unwrap(this.settings.alarmPriorityFrom) : 0).extend({ throttle: 500 });
        this.alarmPriorityTo = ko.observable(ko.unwrap(this.settings.alarmPriorityTo) !== undefined ? ko.unwrap(this.settings.alarmPriorityTo) : 100).extend({ throttle: 500 });
        this.maxEvents = ko.observable(ko.unwrap(this.settings.maxEvents) !== undefined ? ko.unwrap(this.settings.maxEvents) : 50).extend({ throttle: 500 });
        this.customUserNameFilter = ko.observable(ko.unwrap(this.settings.customUserNameFilter) !== undefined ? ko.unwrap(this.settings.customUserNameFilter) : "").extend({ throttle: 500 });

        this.filter = new OperationDiaryFilter();

        this.filter.getTimePeriode = () => {
            let start = this.startDate().toMSDate();
            let end = this.endDate().toMSDate();

            if (this.selectedRange() === CalendarTimeRanges.Actual) {
                start = moment().subtract(this.startOffsetIntervall, this.startOffset).toMSDate();
                end = moment().add(this.endOffsetIntervall, this.endOffset).toMSDate();
            }
            if (this.selectedRange() === CalendarTimeRanges.Today) {
                start = moment().startOf('day').toMSDate();
                end = moment().endOf('day').toMSDate();
            }
            if (this.selectedRange() === CalendarTimeRanges.Yesterday) {
                start = moment().startOf('day').subtract({ days: 1 }).toMSDate();
                end = moment().endOf('day').subtract({ days: 1 }).toMSDate();
            }

            return {
                Start: start,
                End: end
            };
        }

    }

    private async initializeFilterAsync() {
        await this.setFilter();
        await this.source.startPolling();
    }

    private setFilter() {

        this.filter.languageId = this.connector.currentLanguageId();
        this.filter.maxEvents = this.maxEvents();
        this.filter.affectedUserFilter = {
            Action: 1,
            EventResultFilter: { Items: [0, 1] as WFEventResult[], Action: 1 },
            EventTypeFilter: { Items: this.getAffectedUserFilter() as WFEventType[], Action: 1 },
            UserFilter: { Items: [] as User[], Action: 0 },
            CustomUserNameFilter: this.customUserNameFilter() || null
        };

        this.filter.alarmFilter = {
            Action: 1,
            EventResultFilter: { Items: [0, 1] as WFEventResult[], Action: 1 },
            EventTypeFilter: { Items: this.getAlarmFilter(), Action: 1 },
            AlarmTypeFilter: { Items: this.selectedAlarmTypes().map(item => { return { ID: item } as AlarmType }) as AlarmType[], Action: _.any(this.selectedAlarmTypes()) ? 1 : 0 },
            AlarmGroupFilter: { Items: this.selectedAlarmGroups().map(item => { return { ID: item } as AlarmGroup }) as AlarmGroup[], Action: _.any(this.selectedAlarmGroups()) ? 1 : 0 },
            AlarmPriorityFilter: { Action: 1, From: this.alarmPriorityFrom(), To: this.alarmPriorityTo() },
        };
        this.filter.serverFilter = {
            Action: 1,
            EventResultFilter: { Items: [0, 1] as WFEventResult[], Action: 1 },
            EventTypeFilter: { Items: this.getServerFilter() as WFEventType[], Action: 1 },

        };
        this.filter.userFilter = {
            Action: 1,
            EventResultFilter: { Items: [0, 1] as WFEventResult[], Action: 1 },
            EventTypeFilter: { Items: this.getUserFilter() as WFEventType[], Action: 1 },
            UserFilter: { Items: [] as User[], Action: 0 }
        };
    }

    private getServerFilter() {
        const eventTypeFilter = [] as WFEventType[];
        if (this.filterServerStarted() === true)
            eventTypeFilter.push(4);
        if (this.filterServerStopped() === true)
            eventTypeFilter.push(5);
        return eventTypeFilter;
    }

    private getAlarmFilter() {
        const eventTypeFilter = [] as WFEventType[];
        if (this.filterAlarmOn() === true)
            eventTypeFilter.push(1);
        if (this.filterAlarmOff() === true)
            eventTypeFilter.push(2);
        if (this.filterAlarmAcknowledged() === true)
            eventTypeFilter.push(3);
        if (this.filterAlarmActivated() === true)
            eventTypeFilter.push(9);
        if (this.filterAlarmDeactivated() === true)
            eventTypeFilter.push(10);
        return eventTypeFilter;
    }

    private getUserFilter() {
        const eventTypeFilter = [] as WFEventType[];
        if (this.filterUserLoggedIn() === true)
            eventTypeFilter.push(6);
        if (this.filterUserLoggedOut() === true)
            eventTypeFilter.push(7);
        if (this.filterUserWroteSignal() === true)
            eventTypeFilter.push(8);
        return eventTypeFilter;
    }

    private getAffectedUserFilter() {
        const eventTypeFilter = [] as WFEventType[];
        if (this.filterUserCreated() === true)
            eventTypeFilter.push(11);
        if (this.filterUserModified() === true)
            eventTypeFilter.push(12);
        if (this.filterUserDeleted() === true)
            eventTypeFilter.push(13);
        if (this.filterUserPasswordChanged() === true)
            eventTypeFilter.push(14);
        return eventTypeFilter;
    }

    private setEvents() {
        this.source = this.connector.getWFEvents(this.filter);
        this.events = this.source.events;
    }

    private getAlarmGroupsAsync = async () => {
        const alarmGroups = await this.connector.getAlarmGroups(this.connector.currentLanguageId());
        this.alarmGroups(alarmGroups);
    }

    private getAlarmTypesAsync = async () => {
        const alarmTypes = await this.connector.getAlarmTypes(this.connector.currentLanguageId());
        this.alarmTypes(alarmTypes);
    }

    private async getUsersAsync() {
        return await this.connector.getAllUsers();
    }

    public getEventType(eventType: number) {
        const eventTypeString = WFEventType[eventType].toString();
        const translation = this.connector.translate(`I4SCADA_${eventTypeString}`);
        return translation;
    }

    private getIds(items: (AlarmGroupDTO | AlarmTypeDTO | UserDTO)[]) {
        return _.map(items,
            (item) => {
                return {
                        ID: item.ID
                    }
            });
    }

    public showAlarmSettings() {
        this.showAlarmSettingsDialog(true);
    }

    public closeAlarmSettings() {
        this.showAlarmSettingsDialog(false);
    }

    public showTimeSettings() {
        this.showTimeSettingsDialog(true);

        this.startDateInput(moment(this.startDate()));
        this.endDateInput(moment(this.endDate()));
        this.timeRangeDateInput(moment(this.startDate()));
        this.selectedRangeInput(this.selectedRange());

    }

    public closeTimeSettings() {
        this.showTimeSettingsDialog(false);
    }

    public showServerSettings() {
        this.showServerSettingsDialog(true);
    }

    public closeServerSettings() {
        this.showServerSettingsDialog(false);
    }

    public showUserSettings() {
        this.showUserSettingsDialog(true);
    }

    public closeUserSettings() {
        this.showUserSettingsDialog(false);
    }

    public showAffectedUserSettings() {
        this.showAffectedUserSettingsDialog(true);
    }

    public closeAffectedUserSettings() {
        this.showAffectedUserSettingsDialog(false);
    }

    public applyTimeFilterSettings() {
        this.closeTimeSettings();
        this.startDate(moment(this.startDateInput()));
        this.endDate(moment(this.endDateInput()));
        this.selectedRange(this.selectedRangeInput());

        this.setFilter();
        this.source.getWFEvents()
    }

    public async dispose() {
        await super.dispose();

        for (const subscription of this.subscriptions) {
            subscription.dispose();
        }

        await this.source.stopPolling();
    }

}

export = WfEventsComponent;
