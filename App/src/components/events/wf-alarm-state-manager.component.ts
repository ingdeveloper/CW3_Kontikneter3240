import ComponentBaseModel = require("../component-base.model");
import AlarmsService = require("../../services/alarmsService");
import alarmDefinitionsService = require("../../services/alarmDefinitionsService");
import Signal = require("../../services/models/signal");
import Logger = require("../../services/logger");

interface IWfAlarStateParams extends IComponentBaseParams {
    tag: string;
    count: number;
    alarmTypes: string[];
    alarmGroups: string[];
    height: number;
    headerVisibility: boolean;
    settingsButtonVisibility: boolean;
    titleText: string;
    buttonBarCssClass: string;
    panelBarCssClass: string;
    columns: string[];
    filterAlarmGroupsByUser: boolean;
}

interface ISortingData {
    index: number;
    asc: boolean;
}

class WfAlarStateComponent extends ComponentBaseModel<IWfAlarStateParams>  {

    public static readonly AlarmStateUpdates = "WFSInternal_AlarmStateUpdates";
    public static readonly AlarmDefinitionRequestingSize = 100;
    public static readonly AlarmDefinitionRequestingSizeWithParams = 1000;

    private alarmStateUpdatesSignal: Signal;
    private subscriptions: KnockoutSubscription[] = [];
    private items = ko.observableArray<AlarmProcessingAndDisplayDTO>([]);
    private alarms: KnockoutComputed<AlarmProcessingAndDisplayDTO[]>;
    private count = 100;

    private readonly pattern = ko.observable("").extend({ throttle: 500 });

    private readonly isLoading = ko.observable(false);
    private readonly hasMore = ko.observable(false);

    private readonly alarmGroups = ko.observableArray<AlarmGroupDTO>();
    private readonly alarmTypes = ko.observableArray<AlarmTypeDTO>();
    private readonly selectedAlarmTypes = ko.observableArray<string>([]).extend({ rateLimit: { timeout: 100, method: "notifyWhenChangesStop" } });
    private readonly selectedAlarmGroups = ko.observableArray<string>([]).extend({ rateLimit: { timeout: 100, method: "notifyWhenChangesStop" } });

    private sortingData: KnockoutObservable<ISortingData>;
    private height: KnockoutObservable<number>;
    private panelBodyHeight: KnockoutComputed<number>;
    private headerVisibility: KnockoutObservable<boolean>;
    private settingsButtonVisibility: KnockoutObservable<boolean>;
    private titleText: KnockoutObservable<string>;
    private panelBarCssClass: string;
    private buttonBarCssClass: string;
    private filterAlarmGroupsByUser: boolean;

    private showSettingsDialog: KnockoutObservable<boolean>;
    private columns: { headers: KnockoutObservableArray<string>; data: KnockoutObservableArray<string>; };

    constructor(params: IWfAlarStateParams) {
        super(params);

        this.alarmStateUpdatesSignal = this.connector.getSignal(WfAlarStateComponent.AlarmStateUpdates);

        this.subscriptions.push(this.alarmStateUpdatesSignal.value.subscribe(this.getAlarmsAsync));
        this.subscriptions.push(this.pattern.subscribe(this.getAlarmsAsync));

        this.subscriptions.push(this.connector.currentLanguageId.subscribe(() => {
            this.getAlarmGroupsAsync();
            this.getAlarmTypesAsync();
            this.getAlarmsAsync();
        }));

        this.subscriptions.push(this.connector.currentLoggedInUser.subscribe(() => {
            this.getAlarmGroupsAsync();
            this.getAlarmTypesAsync();
            this.getAlarmsAsync();
        }));


        this.pattern(ko.unwrap(this.settings.tag) !== undefined ? ko.unwrap(this.settings.tag) : "");
        this.count = ko.unwrap(this.settings.count) !== undefined ? ko.unwrap(this.settings.count) : this.count;
        this.selectedAlarmGroups(ko.unwrap(this.settings.alarmGroups) !== undefined ? ko.unwrap(this.settings.alarmGroups) : []);
        this.selectedAlarmTypes(ko.unwrap(this.settings.alarmTypes) !== undefined ? ko.unwrap(this.settings.alarmTypes) : []);

        this.subscriptions.push(this.selectedAlarmTypes.subscribe(this.getAlarmsAsync));
        this.subscriptions.push(this.selectedAlarmGroups.subscribe(this.getAlarmsAsync));

        this.getAlarmGroupsAsync();
        this.getAlarmTypesAsync();

        this.connector.getOnlineUpdates();
    }


    protected initializeSettings() {
        super.initializeSettings();

        var columns = this.getNameOfAlarmFields(ko.unwrap(this.settings.columns) || ["AlarmTag", "SignalName", "Text", "State"]); // default

        this.columns = {
            headers: ko.observableArray(this.getColumnHeaders(columns)),
            data: ko.observableArray(columns)
        };

        this.showSettingsDialog = ko.observable(false);

        this.filterAlarmGroupsByUser = ko.unwrap(this.settings.filterAlarmGroupsByUser) !== undefined ? ko.unwrap(this.settings.filterAlarmGroupsByUser) : false;
        this.headerVisibility = ko.observable(ko.unwrap(this.settings.headerVisibility) !== undefined ? ko.unwrap(this.settings.headerVisibility) : true);
        this.settingsButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsButtonVisibility) : true);
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

        this.titleText = ko.observable(ko.unwrap(this.settings.titleText) || "WEBfactory AlarmStateManager");

        this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
        this.panelBarCssClass = ko.unwrap(this.settings.panelBarCssClass) || "panel panel-default";

        this.sortingData = ko.observable<ISortingData>(null);
        this.alarms = ko.pureComputed(() => {
            if (this.sortingData()) {
                return this.items().sort((a, b) => {
                    const x = a[this.columns.data()[this.sortingData().index]];
                    const y = b[this.columns.data()[this.sortingData().index]];
                    return this.sortingData().asc ? ((x < y) ? -1 : ((x > y) ? 1 : 0)) : ((x > y) ? -1 : ((x < y) ? 1 : 0));
                });
            }

            return this.items();
        });

    }

    private getFilterAlarmGroupsByUser() {
        return {
            FilterAlarmGroupsByUser: this.filterAlarmGroupsByUser,
            UserName: this.connector.currentLoggedInUser() ? this.connector.currentLoggedInUser() : ""
        }
    }

    private getNameOfAlarmFields(columns: string[]) {

        return _.map(columns, (column) => {
            switch (column) {
                case 'Text':
                    return "AlarmSymbolicTextTranslation";
                case 'Name':
                    return "AlarmTag";
                case 'SignalName':
                    return "SignalName";
                case 'OpcItem':
                    return "OPCItemName";
                default:
                    return column;
            }
        });
    }

    private getColumnHeaders(columns: string[]) {
        return _.map(columns, (column) => {
            switch (column) {
                case 'AlarmSymbolicTextTranslation':
                    return "I4SCADA_Text";
                case 'AlarmTag':
                    return "I4SCADA_Name";
                case 'SignalName':
                    return "I4SCADA_Signal_Name";
                case 'OPCItemName':
                    return "I4SCADA_OpcItem";
                case 'State':
                    return "I4SCADA_State";
            }

        });
    }

    private showSettings() {
        this.showSettingsDialog(true);
    }

    private closeSettings() {
        this.showSettingsDialog(false);
    }


    private async getAlarmsWithChangedProcessingAndDisplayStateAsync() {
        return AlarmsService.getAlarmsWithChangedProcessingAndDisplayState(this.connector.currentLanguageId());
    }

    private async getAlarmDefinitionsAsync(start: number, count: number) {

        const filter = {
            Tag: `*${this.pattern()}*`,
            Start: start,
            Count: count,
            LangID: this.connector.currentLanguageId(),
            // not usable because paging worke like this: it will not page after the filtered groups and types it will page after the row count, 
            // then it could happend a item will not be shown.
            // the tag filter will work, because it page correctly after the filtered tages.
            Groups: this.selectedAlarmGroups(),
            Types: this.selectedAlarmTypes(),
            ... this.getFilterAlarmGroupsByUser()

        } as AlarmDefinitionFilterDTO;

        return alarmDefinitionsService.getAlarmDefinitions(filter);
    }


    private getAlarmsAsync = async () => {
        try {
            this.isLoading(true);
            const alarmProcessingAndDisplayDataPromise = this.getAlarmsWithChangedProcessingAndDisplayStateAsync();
            const alarmDefinitionsPromise = this.getPagedAlarms();
            const alarmProcessingAndDisplayData = await alarmProcessingAndDisplayDataPromise;
            const alarmDefinitions = await alarmDefinitionsPromise;
            const mergedAlarms = this.mergeStates(alarmProcessingAndDisplayData, alarmDefinitions.slice(0, this.count));
            this.items(mergedAlarms);
            this.items.valueHasMutated();
        } catch (error) {
            this.hasMore(false);
            this.items([]);
            this.connector.error(WfAlarStateComponent, error);
        } finally {
            this.isLoading(false);
        }
    }

    private getRequestingSize() {
        if (_.any(this.selectedAlarmGroups()) || _.any(this.selectedAlarmTypes()))
            return _.max([WfAlarStateComponent.AlarmDefinitionRequestingSizeWithParams, this.count]);
        return _.max([WfAlarStateComponent.AlarmDefinitionRequestingSize, this.count]);
    }

    private async getPagedAlarms() {
        let start = 0;
        let hasMore = true;
        const alarms: AlarmDefinitionDTO[] = [] as AlarmDefinitionDTO[];
        this.hasMore(true);
        do {
            const data = await this.getAlarmDefinitionsAsync(start, this.getRequestingSize());
            Array.prototype.push.apply(alarms, data.Definitions);
            hasMore = data.HasMore
            start += this.getRequestingSize();
            this.hasMore(data.HasMore);

        } while (hasMore && alarms.length < this.count)
        return alarms;
    }

    private mergeStates(alarmProcessingAndDisplayData: AlarmProcessingAndDisplayDTO[], alarmDefinitions: AlarmDefinitionDTO[]) {
        return alarmDefinitions.map((item) => {
            const state = _.find(alarmProcessingAndDisplayData, (alarm => alarm.AlarmID === item.ID));
            return {
                AlarmID: item.ID,
                AlarmSymbolicTextTranslation: item.SymbolicTextTranslation,
                AlarmTag: item.Tag,
                OPCItemName: item.Signal.Name,
                SignalName: item.Signal.AliasName,
                State: state != null ? state.State : AlarmProcessingAndDisplayState.ProcessedAndVisible
            } as AlarmProcessingAndDisplayDTO
        });
    }

    private getAlarmGroupsAsync = async () => {
        try {
            const alarmGroups = await this.connector.getAlarmGroups(this.connector.currentLanguageId())
            this.alarmGroups(alarmGroups);
        }
        catch (error) {
            this.alarmGroups([]);
            this.connector.error(WfAlarStateComponent, error);
        }
    }

    private getAlarmTypesAsync = async () => {
        try {
            const alarmTypes = await this.connector.getAlarmTypes(this.connector.currentLanguageId());
            this.alarmTypes(alarmTypes);
        }
        catch (error) {
            this.alarmTypes([]);
            this.connector.error(WfAlarStateComponent, error);
        }
    }

    public async activateOrDeactivateAlarmStateAsync(alarm: AlarmProcessingAndDisplayDTO, event: any) {
        try {
            const result = await AlarmsService.setAlarmState(alarm.AlarmID as string, parseInt($(event.target).val()) as any, moment(new Date(9999, 1, 1, 23, 59, 59)));
            if (result === false) {
                Logger.warnToast(this.connector.translate("I4SCADA_Change_alarm_state_failed")());
            }
            if (result === true) {
                Logger.successToast(this.connector.translate("I4SCADA_Change_alarm_state_successful")());
            }
        } catch (error) {
            this.connector.error(WfAlarStateComponent, error);
        }
    }

    private getTranslatesState(state: AlarmProcessingAndDisplayState) {
        return this.connector.translate(`I4SCADA_${AlarmProcessingAndDisplayState[state]}`)();
    }

    public async dispose() {
        await super.dispose();

        for (const subscription of this.subscriptions) {
            subscription.dispose();
        }

        if (this.alarmStateUpdatesSignal) {
            this.connector.unregisterSignals(this.alarmStateUpdatesSignal);
        }
    }
}
export = WfAlarStateComponent;
