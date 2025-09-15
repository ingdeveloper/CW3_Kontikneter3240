import AlarmsFilter = require("../../services/models/alarmsFilter");
import BusyIndicator = require("../../decorators/busyIndicator");
import OnlineAlarmSource = require("../../services/onlineAlarmSource");
import OfflineAlarmSource = require("../../services/offlineAlarmSource");
import AlarmSource = require("../../services/alarmSource");
import ErrorCodeService = require("../../services/errorCodeService");
import { ConfigControlType } from "../../services/connectorEnums"
import ComponentBaseModel = require("../component-base.model");
import AlarmHornService = require("../services/alarm-horn.service");
import ConvertCsvService = require("../services/convert-csv.service");
import SecuredService = require("../services/secured.service");
import StandaloneParametersReplacementService = require("../services/standalone-parameters-replacement.service");

interface IWfAlarmViewerParams extends IComponentBaseParams, IConfigurationParams, IAlarmHornParams, IConvertCsvParams, IStandaloneParameters {
    columns: string[];
    fields: string[];
    height: number;
    titleText: string;
    buttonBarCssClass: string;
    panelBarCssClass: string;
    rowItemCssClass: string;
    tileItemsCssClass: string;
    ackButtonVisibility: boolean;
    settingsButtonVisibility: boolean;
    templateSwitchVisibility: boolean;
    headerVisibility: boolean;
    groupFilterVisibility: boolean;
    typeFilterVisibility: boolean;
    stateFilterVisibility: boolean;
    priorityFilterVisibility: boolean;
    columnsHeaderVisibility: boolean;
    rowNumberVisibility: boolean;
    columnFilterVisibility: boolean;
    groupAcknowledgementVisibility: boolean;
    tableView: boolean;
    onlineAlarmsMode: boolean;

    startOffset: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
    startOffsetIntervall: number;
    endOffset: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
    endOffsetIntervall: number;
    isRollingTimeWindow: true;

    acknowledgedAlarmBackground: string;
    acknowledgedAlarmForeground: string;
    acknowledgedAndGoneAlarmBackground: string;
    acknowledgedAndGoneAlarmForeground: string;
    activeAlarmBackground: string;
    activeAlarmForeground: string;
    inactiveAlarmBackground: string;
    inactiveAlarmForeground: string;
    updateRate: number;

    minimumPriority: number;
    maximumPriority: number;
    maxRowCount: number;

    alarmGroup: string;
    alarmType: string;

    alarmGroups: string[];
    alarmTypes: string[];

    sortOrder: string;
    alarmStatusFilter: string;

    filterAlarmGroupsByUser: boolean;
    columnFilterPattern: string;
    columnFilter: string;

    showOnlyOwnConfigurations: boolean;
    dateTimeFormat: string;

    linkTarget: string;

    exportProjectAuthorization: string;
    exportButtonVisibility: boolean;
}

interface IAlarmStatus {
    Number: number;
    Description: string;
}

interface IAlarm extends AlarmDTO {
    background: KnockoutComputed<string>;
    foreground: KnockoutComputed<string>;
    AcknowledgedWithComment: boolean;
    Duration: string;
}

interface ISortingData {
    index: number;
    asc: boolean;
}

class WfAlarmViewerComponent extends ComponentBaseModel<IWfAlarmViewerParams> {

    public filterDialogFilter: AlarmsFilter;
    public columnFilters: KnockoutObservable<string>;

    private linkTarget: string;
    private alarmHornService: AlarmHornService;
    private activeAndNotAcknowledgedAlarmIds: Guid[];
    private columnFilterVisibility: KnockoutObservable<boolean>;
    private showOnlyOwnConfigurations: boolean;

    private selectedAlarmGroupsIsNotDefault: KnockoutComputed<boolean>;
    private selectedAlarmTypesIsNotDefault: KnockoutComputed<boolean>;
    private selectedMaxRowCountIsNotDefault: KnockoutComputed<boolean>;
    private selectedAlarmStatusIsNotDefault: KnockoutComputed<boolean>;
    private selectedAlarmPriorityIsNotDefault: KnockoutComputed<boolean>;
    private selectedColumnIsNotDefault: KnockoutComputed<boolean>;
    private selectedColumnFilterPatternIsNotDefault: KnockoutComputed<boolean>;

    private availableColumnFilters: KnockoutObservableArray<{ id: number, name: string }>;
    private filterAlarmGroupsByUser: boolean;
    private initialConfiguration: string;
    private configurationNamespace: string;
    private controlType: ConfigControlType;
    private isAcknowledgeAll: KnockoutObservable<boolean>;
    private settingsButtonBarCssClass: KnockoutComputed<string>;
    private newChunkOfflineAlarmsLoading: KnockoutComputed<boolean>;
    private onlineAlarms: KnockoutComputed<IAlarm[]>;
    private sortingData: KnockoutObservable<ISortingData>;
    private tempSelectedAlarm: KnockoutObservable<number>;
    private showFilterActivLabel: KnockoutObservable<boolean>;
    private alarmPrioritys: KnockoutObservableArray<number>;
    private availableAlarmStates: KnockoutObservableArray<IAlarmStatus>;
    private alarmTypes: KnockoutObservableArray<AlarmTypeDTO>;
    private alarmGroups: KnockoutObservableArray<AlarmGroupDTO>;
    private selectedAlarmPriority: KnockoutObservable<number>;
    private pollTimer: number;
    private commentAckAlarm: KnockoutObservable<string>;
    private selectedAlarmId: KnockoutObservable<string>;
    private selectedAlarm: KnockoutObservable<AlarmDTO>;
    private filtersChanged: KnockoutObservable<boolean>;
    private isOnlineMode: KnockoutObservable<boolean>;
    private onlineAlarmsSource: KnockoutComputed<AlarmSource>;
    private panelBodyHeight: KnockoutComputed<number>;
    private updateRate: number;
    private inactiveAlarmForeground: string;
    private inactiveAlarmBackground: string;
    private activeAlarmForeground: string;
    private activeAlarmBackground: string;
    private acknowledgedAndGoneAlarmForeground: string;
    private acknowledgedAndGoneAlarmBackground: string;
    private acknowledgedAlarmForeground: string;
    private acknowledgedAlarmBackground: string;
    private startOffsetIntervall: number;
    private startOffset: string;
    private endOffsetIntervall: number;
    private endOffset: string;
    private isRollingTimeWindow: KnockoutObservable<boolean>;

    private onlineAlarmsMode: KnockoutObservable<boolean>;
    private tableView: KnockoutObservable<boolean>;
    private warningCssClass: string;
    private titleText: KnockoutObservable<string>;
    private configurationButtonIconClass: string;
    private panelBarCssClass: string;
    private buttonBarCssClass: string;
    private rowItemCssClass: string;
    private tileItemsCssClass: string;
    private rowNumberVisibility: KnockoutObservable<boolean>;
    private columnsHeaderVisibility: KnockoutObservable<boolean>;
    private priorityFilterVisibility: KnockoutObservable<boolean>;
    private stateFilterVisibility: KnockoutObservable<boolean>;
    private typeFilterVisibility: KnockoutObservable<boolean>;
    private groupFilterVisibility: KnockoutObservable<boolean>;
    private headerVisibility: KnockoutObservable<boolean>;
    private templateSwitchVisibility: KnockoutObservable<boolean>;
    private configurationButtonVisibility: KnockoutObservable<boolean>;
    private settingsButtonVisibility: KnockoutObservable<boolean>;
    private ackButtonVisibility: KnockoutObservable<boolean>;
    private groupAcknowledgementVisibility: KnockoutObservable<boolean>;
    private height: KnockoutObservable<number>;
    private showAckButton: KnockoutObservable<boolean>;
    private filter: AlarmsFilter;
    private progress: KnockoutObservable<boolean>;
    private isShowPriority: KnockoutComputed<boolean>;
    private isShowAlarmTypeSymbolicTextTranslation: KnockoutComputed<boolean>;
    private columns: { headers: KnockoutObservableArray<string>; data: KnockoutObservableArray<string>; };
    private fields: { headers: KnockoutObservableArray<string>; data: KnockoutObservableArray<string>; };
    private busyContext: BusyIndicator;
    private showSettingsDialog: KnockoutObservable<boolean>;
    private showDialog: KnockoutObservable<boolean>;
    private dateTimeFormat: string;
    private convertCsvService: ConvertCsvService;
    private standaloneParametersReplacementService: StandaloneParametersReplacementService;

    private exportButtonVisibility: KnockoutObservable<boolean>;
    private hasExportAuthorization: KnockoutComputed<boolean>;
    private exportSecuredService: SecuredService;
    private exportProjectAuthorization: string;
    private extendedAlarmProperties: ExtendedAlarmPropertyDTO[] = [];

    constructor(params: IWfAlarmViewerParams) {
        super(params);
        this.convertCsvService = new ConvertCsvService(this.settings);
        this.getData();
    }

    private updateDialogFilterProperties() {
        this.filterDialogFilter = new AlarmsFilter();
        this.tempSelectedAlarm = ko.observable<number>();
        this.columnFilters = ko.observable(_.first(this.filter.columnFilters()));
        this.isOnlineMode = ko.observable(this.onlineAlarmsMode());
        this.filterDialogFilter.set(this.filter);

        this.filterDialogFilter.isRollingTimeWindow.subscribe(() => {
            this.filtersChanged(true);
        });

        this.filterDialogFilter.startDate.subscribe(() => {
            this.filtersChanged(true);
        });

        this.filterDialogFilter.endDate.subscribe(() => {
            this.filtersChanged(true);
        });

        this.isOnlineMode.subscribe(() => {
            this.filtersChanged(true);
        });
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.standaloneParametersReplacementService = new StandaloneParametersReplacementService(this.settings);

        this.showDialog = ko.observable(false);
        this.showSettingsDialog = ko.observable(false);
        this.showOnlyOwnConfigurations = this.settings.showOnlyOwnConfigurations !== undefined ? this.settings.showOnlyOwnConfigurations : false;

        this.activeAndNotAcknowledgedAlarmIds = [] as Guid[];
        this.alarmHornService = new AlarmHornService(this.settings);

        var columns = this.getNameOfAlarmFields(ko.unwrap(this.settings.columns) || ["Priority", "StatusText", "Active", "Group", "Type", "Text"]); // default
        var fields = this.getNameOfAlarmFields(ko.unwrap(this.settings.fields) || ["Priority", "Type", "Text", "Active", "Acknowledged", "Gone"]); // default

        this.fields = {
            headers: ko.observableArray(this.getColumnHeaders(fields)),
            data: ko.observableArray(fields)
        };

        this.columns = {
            headers: ko.observableArray(this.getColumnHeaders(columns)),
            data: ko.observableArray(columns)
        };

        this.isShowAlarmTypeSymbolicTextTranslation = ko.computed(() => {
            return this.fields.data.indexOf('AlarmTypeSymbolicTextTranslation') > -1;
        });

        this.isShowPriority = ko.computed(() => {
            return this.fields.data.indexOf('Priority') > -1;
        });

        this.busyContext = new BusyIndicator(this);

        this.filtersChanged = ko.observable(false);
        this.progress = ko.observable(true); // Flag property for long time loading indicator in the view

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

        this.titleText = ko.observable(ko.unwrap(this.settings.titleText) !== undefined ? ko.unwrap(this.settings.titleText) : "WEBfactory AlarmViewer");

        this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
        this.panelBarCssClass = ko.unwrap(this.settings.panelBarCssClass) || "panel panel-default";
        this.rowItemCssClass = ko.unwrap(this.settings.rowItemCssClass) || "";
        this.tileItemsCssClass = ko.unwrap(this.settings.tileItemsCssClass) || "col-lg-4 col-md-6";
        this.configurationButtonIconClass = ko.unwrap(this.settings.configurationButtonIconClass);

        this.warningCssClass = "btn btn-warning";

        this.ackButtonVisibility = ko.observable(ko.unwrap(this.settings.ackButtonVisibility) !== undefined ? ko.unwrap(this.settings.ackButtonVisibility) : true);
        this.settingsButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsButtonVisibility) : true);
        this.configurationButtonVisibility = ko.observable(ko.unwrap(this.settings.configurationButtonVisibility) !== undefined ? ko.unwrap(this.settings.configurationButtonVisibility) : true);
        this.templateSwitchVisibility = ko.observable(ko.unwrap(this.settings.templateSwitchVisibility) !== undefined ? ko.unwrap(this.settings.templateSwitchVisibility) : true);
        this.exportButtonVisibility = ko.observable(ko.unwrap(this.settings.exportButtonVisibility) !== undefined ? ko.unwrap(this.settings.exportButtonVisibility) : true);
        this.groupAcknowledgementVisibility = ko.observable(ko.unwrap(this.settings.groupAcknowledgementVisibility) !== undefined ? ko.unwrap(this.settings.groupAcknowledgementVisibility) : true);

        //#region export project authorization
        this.exportProjectAuthorization = (ko.unwrap(this.settings.exportProjectAuthorization) || "").stringPlaceholderResolver(this.objectID);
        this.exportSecuredService = new SecuredService(this.exportProjectAuthorization);
        this.hasExportAuthorization = this.exportSecuredService.hasAuthorization;
        //#endregion

        this.headerVisibility = ko.observable(ko.unwrap(this.settings.headerVisibility) !== undefined ? ko.unwrap(this.settings.headerVisibility) : true);
        this.groupFilterVisibility = ko.observable(ko.unwrap(this.settings.groupFilterVisibility) !== undefined ? ko.unwrap(this.settings.groupFilterVisibility) : true);
        this.typeFilterVisibility = ko.observable(ko.unwrap(this.settings.typeFilterVisibility) !== undefined ? ko.unwrap(this.settings.typeFilterVisibility) : true);
        this.stateFilterVisibility = ko.observable(ko.unwrap(this.settings.stateFilterVisibility) !== undefined ? ko.unwrap(this.settings.stateFilterVisibility) : true);
        this.priorityFilterVisibility = ko.observable(ko.unwrap(this.settings.priorityFilterVisibility) !== undefined ? ko.unwrap(this.settings.priorityFilterVisibility) : true);
        this.columnsHeaderVisibility = ko.observable(ko.unwrap(this.settings.columnsHeaderVisibility) !== undefined ? ko.unwrap(this.settings.columnsHeaderVisibility) : true);
        this.rowNumberVisibility = ko.observable(ko.unwrap(this.settings.rowNumberVisibility) !== undefined ? ko.unwrap(this.settings.rowNumberVisibility) : true);
        this.columnFilterVisibility = ko.observable(ko.unwrap(this.settings.columnFilterVisibility) !== undefined ? ko.unwrap(this.settings.columnFilterVisibility) : true);

        this.tableView = ko.observable(ko.unwrap(this.settings.tableView) !== undefined ? ko.unwrap(this.settings.tableView) : false);
        this.onlineAlarmsMode = ko.observable(ko.unwrap(this.settings.onlineAlarmsMode) !== undefined ? ko.unwrap(this.settings.onlineAlarmsMode) : true);

        this.startOffset = ko.unwrap(this.settings.startOffset) ? ko.unwrap(this.settings.startOffset).trim().toLowerCase() : "days"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
        this.startOffsetIntervall = ko.unwrap(this.settings.startOffsetIntervall) ? ko.unwrap(this.settings.startOffsetIntervall) : 7;

        this.endOffset = ko.unwrap(this.settings.endOffset) ? ko.unwrap(this.settings.endOffset).trim().toLowerCase() : "days"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
        this.endOffsetIntervall = ko.unwrap(this.settings.endOffsetIntervall) ? ko.unwrap(this.settings.endOffsetIntervall) : 0;
        this.isRollingTimeWindow = ko.observable(ko.unwrap(this.settings.isRollingTimeWindow) !== undefined ? ko.unwrap(this.settings.isRollingTimeWindow) : false);

        this.initializeColors();
        this.initializeFilter();

        this.linkTarget = ko.unwrap(this.settings.linkTarget) !== undefined ? ko.unwrap(this.settings.linkTarget) : "_self";

        this.selectedAlarm = ko.observable<AlarmDTO>({} as AlarmDTO);
        this.selectedAlarmId = ko.observable<string>();
        this.showAckButton = ko.observable(false);
        this.commentAckAlarm = ko.observable<string>();

        this.pollTimer = null;

        this.alarmGroups = ko.observableArray<AlarmGroupDTO>();
        this.alarmTypes = ko.observableArray<AlarmTypeDTO>();

        this.initializeAlarmStates();

        this.updateRate = ko.unwrap(this.settings.updateRate);

        this.onlineAlarmsSource = ko.computed(() => {
            return this.onlineAlarmsMode() === true ? this.connector.getOnlineAlarms(this.filter, this.updateRate) : this.connector.getOfflineAlarms(this.filter);
        });

        this.sortingData = ko.observable<ISortingData>(null);
        this.onlineAlarms = ko.pureComputed(() => {

            const alarms = _.map((this.onlineAlarmsSource().alarms() as IAlarm[]), alarm => this.appendAlarmFunctionality(alarm));

            if (this.isRollingTimeWindow() && !this.showSettingsDialog()) {
                this.updateFilterTimeInterval();
                this.onlineAlarmsSource().filter = this.filter;
            }

            if (!this.sortingData()) return alarms;

            return alarms.sort((a, b) => {
                var x = a[this.columns.data()[this.sortingData().index]];
                var y = b[this.columns.data()[this.sortingData().index]];
                return this.sortingData().asc ? ((x < y) ? -1 : ((x > y) ? 1 : 0)) : ((x > y) ? -1 : ((x < y) ? 1 : 0));
            });
        }, this);

        this.alarmPrioritys = ko.observableArray<number>([]);
        this.onlineAlarms.subscribe((alarms) => {
            this.playSoundforActiveAndNotAcknowledgedAlarms(alarms);
            if (!ko.unwrap(this.priorityFilterVisibility))
                this.alarmPrioritys([]);

            //recive list with uniq priority
            var prioroties = _.uniq(_.map(alarms,
                (element, index, list) => {
                    return element.Priority;
                }));

            //if recived new priority from server, need update list priorities
            var oldPriorities = this.alarmPrioritys();

            let isNew = false;
            _.each(prioroties, (priority) => {
                if (_.indexOf(oldPriorities, priority) === -1)
                    isNew = true;
            });

            if (isNew) {
                const sortedAlarmPrioritys = _.sortBy(prioroties, (num) => num);
                this.alarmPrioritys(sortedAlarmPrioritys);
            }

        });

        this.selectedAlarmPriority = ko.observable<number>();
        this.selectedAlarmPriority.subscribe((newValue) => {
            if (newValue !== undefined && newValue !== null) {
                this.filterDialogFilter.minimumPriority(newValue);
                this.filterDialogFilter.maximumPriority(newValue);
            }
            else {
                this.filterDialogFilter.minimumPriority(ko.unwrap(this.settings.minimumPriority) || 0);
                this.filterDialogFilter.maximumPriority(ko.unwrap(this.settings.maximumPriority) || 100);

            }
        });

        this.progress(false);
        this.showFilterActivLabel = ko.observable(false);
        this.newChunkOfflineAlarmsLoading = ko.computed(() => {
            return this.onlineAlarmsSource().isPolling() && !this.onlineAlarmsMode();
        });

        this.settingsButtonBarCssClass = ko.computed(() => {
            return this.filtersChanged() ? this.warningCssClass : this.buttonBarCssClass;
        });
        this.isAcknowledgeAll = ko.observable(false);

        this.initializeConfiguration();

        this.dateTimeFormat = ko.unwrap(this.settings.dateTimeFormat) ? ko.unwrap(this.settings.dateTimeFormat) : "";

        this.initializeNotDefaultObservables();

        this.updateDialogFilterProperties();
    }

    private setColumnFilters() {
        this.filter.column(FilterColumnType[ko.unwrap(this.settings.columnFilter)] || FilterColumnType.None);
        this.filter.columnFilters(ko.unwrap([this.settings.columnFilterPattern || ""]));

        const filterColumnTypes = Object.keys(FilterColumnType)
            .map((k) => {
                return FilterColumnType[k];
            })
            .filter((x) => {
                return typeof x === "number";
            })
            .map((x) => {
                return {
                    id: x,
                    name: FilterColumnType[x]
                }
            });

        this.availableColumnFilters = ko.observableArray(filterColumnTypes);
    }

    private getData() {
        this.busyContext.runLongAction("Getting Alarm Groups and Alarm Types", async () => {
            try {
                const alarmPromis = this.getAlarmGroups();
                const alarmTypePromis = this.getAlarmTypes();
                const getExtendedAlarmPropertiesPromies = this.getExtendedAlarmPropertiesAsync();
                await alarmPromis;
                await alarmTypePromis;
                await getExtendedAlarmPropertiesPromies;
                await this.loadInitialConfiguration();
                this.resolveExtendedProperties();
                this.updateAvailableColumnFilters();
                this.restartPolling();
            } catch (error) {
                this.connector.handleError(WfAlarmViewerComponent)(error);
            }
        });
    }

    private async getAlarmGroups() {
        const alarmGroups = await this.connector.getAlarmGroups(this.filter.languageId());
        this.alarmGroups(alarmGroups);
        // If an alarm group is preset by settings then it should be selected
        const preselectedEntities = this.getSelectedEntity(alarmGroups, ko.unwrap(this.settings.alarmGroups || (this.settings.alarmGroup ? [this.settings.alarmGroup] : [])));

        this.filter.alarmGroups(preselectedEntities);
        this.filterDialogFilter.set(this.filter);
    }

    private async getAlarmTypes() {
        const alarmTypes = await this.connector.getAlarmTypes(this.filter.languageId());
        this.alarmTypes(alarmTypes);
        // If an alarm type is preset by settings then it should be selected
        const preselectedEntities = this.getSelectedEntity(alarmTypes, ko.unwrap(this.settings.alarmTypes || (this.settings.alarmType ? [this.settings.alarmType] : [])));

        this.filter.alarmTypes(preselectedEntities);
        this.filterDialogFilter.set(this.filter);
    }

    private getSelectedEntity(entities: TranslatableDTO[], predefinedSelected: string[]): string[] {
        const results = [];

        for (const selected of predefinedSelected) {
            const regex = new RegExp("^" + selected.replace("*", ".*") +"$", "i");

            const foundEntities = entities.filter(x => x !== null && x.SymbolicTextName && regex.test(x.SymbolicTextName));

            for (const foundEntity of foundEntities) {
                results.push(foundEntity.SymbolicTextName);
            }
        }

        return results;
    }

    private async getExtendedAlarmPropertiesAsync() {
        this.extendedAlarmProperties = await this.connector.getExtendedAlarmProperties();
    }

    private initializeColors() {
        this.acknowledgedAlarmBackground = ko.unwrap(this.settings.acknowledgedAlarmBackground) ? ko.unwrap(this.settings.acknowledgedAlarmBackground) : "#E08F00";
        this.acknowledgedAlarmForeground = ko.unwrap(this.settings.acknowledgedAlarmForeground) ? ko.unwrap(this.settings.acknowledgedAlarmForeground) : "#FFFFFF";
        this.acknowledgedAndGoneAlarmBackground = ko.unwrap(this.settings.acknowledgedAndGoneAlarmBackground) ? ko.unwrap(this.settings.acknowledgedAndGoneAlarmBackground) : "#00CC66";
        this.acknowledgedAndGoneAlarmForeground = ko.unwrap(this.settings.acknowledgedAndGoneAlarmForeground) ? ko.unwrap(this.settings.acknowledgedAndGoneAlarmForeground) : "#FFFFFF";
        this.activeAlarmBackground = ko.unwrap(this.settings.activeAlarmBackground) ? ko.unwrap(this.settings.activeAlarmBackground) : "#990100";
        this.activeAlarmForeground = ko.unwrap(this.settings.activeAlarmForeground) ? ko.unwrap(this.settings.activeAlarmForeground) : "#FFFFFF";
        this.inactiveAlarmBackground = ko.unwrap(this.settings.inactiveAlarmBackground) ? ko.unwrap(this.settings.inactiveAlarmBackground) : "#0c9900";
        this.inactiveAlarmForeground = ko.unwrap(this.settings.inactiveAlarmForeground) ? ko.unwrap(this.settings.inactiveAlarmForeground) : "#FFFFFF";
    }

    private initializeConfiguration() {
        this.initialConfiguration = (ko.unwrap(this.settings.initialConfiguration) || "").stringPlaceholderResolver(this.objectID);
        this.configurationNamespace = (ko.unwrap(this.settings.configurationNamespace) || "").stringPlaceholderResolver(this.objectID);
        this.controlType = ConfigControlType.Alarmliste;
    }


    private initializeAlarmStates() {
        this.availableAlarmStates = ko.observableArray<IAlarmStatus>([
            { Number: 16, Description: this.connector.translate('I4SCADA_All') },
            { Number: 2, Description: this.connector.translate('I4SCADA_Not_acknowledged') },
            { Number: 8, Description: this.connector.translate('I4SCADA_Gone') },
            { Number: 4, Description: this.connector.translate('I4SCADA_Active') },
            { Number: 0, Description: this.connector.translate('I4SCADA_Active_and_or_not_acknowledged') }
        ]);
    }

    private initializeFilter() {
        this.filter = new AlarmsFilter();
        this.setColumnFilters();
        this.filterAlarmGroupsByUser = ko.unwrap(this.settings.filterAlarmGroupsByUser) !== undefined ? ko.unwrap(this.settings.filterAlarmGroupsByUser) : false;

        this.connector.currentLoggedInUser.subscribe((newValue) => {
            this.setFilterAlarmGroupsByUser();
            this.restartPolling();
        });

        this.filter.languageId(this.connector.currentLanguageId());
        this.connector.currentLanguageId.subscribe(() => {
            // Trigger a refresh on language change
            this.filter.languageId(this.connector.currentLanguageId());
            this.restartPolling();
        });


        this.filter.alarmGroups([]);
        this.filter.alarmTypes([]);
        this.filter.minimumPriority(ko.unwrap(this.settings.minimumPriority) || 0);
        this.filter.maximumPriority(ko.unwrap(this.settings.maximumPriority) || 100);
        this.filter.sortOrder(ServerSortOrder[ko.unwrap(this.settings.sortOrder)] || ServerSortOrder.DateDescending);

        this.filter.maxRowCount(ko.unwrap(this.settings.maxRowCount) || 100);
        //this.filter.alarmStatusFilter(ko.unwrap(this.settings.alarmStatusFilter) || 16);

        this.filter.alarmStatusFilter(ko.unwrap(this.settings.alarmStatusFilter) !== undefined ? AlarmStatusFilter[ko.unwrap(this.settings.alarmStatusFilter)] : AlarmStatusFilter.All);
        this.filter.isRollingTimeWindow(this.isRollingTimeWindow());

        this.updateFilterTimeInterval();

        this.setFilterAlarmGroupsByUser();
    }

    private selectAlarm(alarm, alarmViewer) {
        this.selectedAlarm(alarm);

        this.showDialog(true);

        // Store the alarm ID for acknowledgement
        this.selectedAlarmId(alarm.AlarmID);
        this.commentAckAlarm(alarm.AckText);

        // Show ack button if no ack date there for selected alarm
        this.showAckButton(!alarm.DateAck ? true : false);

        this.pollTimer = window.setTimeout(this.pollAlarm, 1000);
    }

    private closeModal() {
        this.showDialog(false);

        // Clear the pollTimer
        clearTimeout(this.pollTimer);

        // Clear data about selected alarm  
        this.selectedAlarmId(null);
        this.selectedAlarm({} as AlarmDTO);
        this.commentAckAlarm(null);
    }

    private handleApplyFilterSettings() {
        this.closeSettings();
        this.applyFilterSettings();
    }

    private applyFilterSettings() {
        this.filter.set(this.filterDialogFilter);
        this.filter.columnFilters([this.columnFilters() || ""]);
        this.restartPolling();
    }

    private restartPolling(loadConfig = null) {//TODO : Need server method get priorities
        if (this.filter === null)
            return;

        this.isRollingTimeWindow(this.filter.isRollingTimeWindow());
        this.onlineAlarmsSource().stopPolling();
        this.onlineAlarmsMode(this.isOnlineMode());
        if (!this.onlineAlarmsMode())
            this.onlineAlarmsSource().clearPolling();
        if (!loadConfig)
            this.selectedAlarmPriority(this.tempSelectedAlarm());
        this.onlineAlarmsSource().startPolling();
        this.filtersChanged(false);

        if (this.isFilterActive())
            this.showFilterActivLabel(true);
        else
            this.showFilterActivLabel(false);
    }

    private isFilterActive() {
        return this.selectedAlarmTypesIsNotDefault() ||
            this.selectedAlarmStatusIsNotDefault() ||
            this.selectedAlarmGroupsIsNotDefault() ||
            this.selectedAlarmPriorityIsNotDefault() ||
            (this.selectedColumnIsNotDefault() && this.selectedColumnFilterPatternIsNotDefault());
    }

    private getNewChunkAlarms() {
        if (this.onlineAlarmsMode() === true)
            return;
        this.onlineAlarmsSource().startPolling();
    }

    private pollAlarm = async () => {
        if (this.onlineAlarmsMode() === false || !this.showDialog()) return;

        await this.updateSelectedAlarm();

        // Trigger the next poll
        this.pollTimer = window.setTimeout(this.pollAlarm, 1000);
    }


    private async updateSelectedAlarm() {
        if (!this.selectedAlarm()) return;

        var alarmId = ko.unwrap(this.selectedAlarm().AlarmID);

        const data = await this.connector.getAlarms([alarmId], this.connector.currentLanguageId())

        if (!data || !data.Alarms || data.Alarms.length === 0) return;

        var alarm = data.Alarms[0] as IAlarm;
        this.onlineAlarmsSource().adjustAlarmTimeFields(alarm);
        alarm = this.appendAlarmFunctionality(alarm);
        this.selectedAlarm(alarm);
        if (alarm.DateAck && this.showAckButton()) {
            this.showAckButton(false);
        }
        if (!alarm.DateAck && !this.showAckButton()) {
            this.showAckButton(true);
        }
    }

    private appendAlarmFunctionality(alarm: IAlarm): IAlarm {
        alarm.background = ko.pureComputed(() => {
            if (alarm.DateOff && alarm.DateAck) {
                return this.acknowledgedAndGoneAlarmBackground;
            }
            else if (alarm.DateOff) {
                return this.inactiveAlarmBackground;
            }
            else if (alarm.DateAck) {
                return this.acknowledgedAlarmBackground;
            }

            return this.activeAlarmBackground;
        });

        alarm.foreground = ko.pureComputed(() => {
            if (alarm.DateOff && alarm.DateAck) {
                return this.acknowledgedAndGoneAlarmForeground;
            }
            else if (alarm.DateOff) {
                return this.inactiveAlarmForeground;
            }
            else if (alarm.DateAck) {
                return this.acknowledgedAlarmForeground;
            }

            return this.activeAlarmForeground;
        });

        alarm.AcknowledgedWithComment = alarm.DateAck && alarm.AckText ? true : false;

        alarm.Duration =
            alarm.DateOff
                ? this.getFormattedDuration(moment(alarm.DateOff).diff(moment(alarm.DateOn)))
                : this.getFormattedDuration(moment().diff(moment(alarm.DateOn)));

        return alarm;
    }

    private showSettings() {
        this.showSettingsDialog(true);
        this.filterDialogFilter.isRollingTimeWindow(this.isRollingTimeWindow());
        if (!this.filtersChanged())
            this.isOnlineMode(this.onlineAlarmsMode());
        this.tempSelectedAlarm(this.selectedAlarmPriority());
    }

    private closeSettings() {
        this.showSettingsDialog(false);
    }

    private getConfig() {
        var content = {
            onlineAlarmsMode: this.onlineAlarmsMode(),
            maxRowCount: this.filter.maxRowCount(),
            startDate: this.filter.startDate() ? moment(this.filter.startDate()).toMSDate() : null,
            endDate: this.filter.endDate() ? moment(this.filter.endDate()).toMSDate() : null,
            alarmGroup: this.filter.alarmGroups(),
            alarmStatusFilter: this.filter.alarmStatusFilter(),
            alarmType: this.filter.alarmTypes(),
            alarmPriority: this.selectedAlarmPriority(),
            filterAlarmGroupsByUser: this.filterAlarmGroupsByUser,
            column: this.filter.column(),
            columnFilterPattern: this.filter.columnFilters(),
            isRollingTimeWindow: this.filter.isRollingTimeWindow()
        }

        return content;
    }

    public applyConfigurationLoad(content) {
        this.loadConfig(content);
        this.restartPolling();
    }

    private loadConfig(content) {
        this.filter.isRollingTimeWindow(content.isRollingTimeWindow !== undefined ? content.isRollingTimeWindow : true);
        this.isRollingTimeWindow(this.filter.isRollingTimeWindow()); //this should be done here in order to keep the startdate from updating while the configuration is being set. This will keep the startDate/endDate that the client saved in the configuration

        this.onlineAlarmsSource().stopPolling();

        this.isOnlineMode(content.onlineAlarmsMode);
        this.filter.maxRowCount(content.maxRowCount);
        this.filter.startDate(moment(content.startDate).toDate());
        this.filter.endDate(ko.unwrap(content.onlineAlarmsMode) ? moment(content.endDate).toDate() : moment().toDate());

        this.filter.alarmGroups(content.alarmGroup);
        this.filter.alarmStatusFilter(content.alarmStatusFilter);
        this.filter.alarmTypes(content.alarmType);
        this.selectedAlarmPriority(content.alarmPriority);

        this.filterAlarmGroupsByUser = content.filterAlarmGroupsByUser;
        this.setFilterAlarmGroupsByUser();
        this.filter.column(content.column);
        this.filter.columnFilters(content.columnFilterPattern);

        this.columnFilters(_.first(content.columnFilterPattern));
        this.filterDialogFilter.set(this.filter);
    }

    private setFilterAlarmGroupsByUser() {
        if (this.filterAlarmGroupsByUser) {
            this.filter.filterAlarmGroupsByUser(this.connector.currentLoggedInUser() ? true : false);
            this.filter.userName(this.connector.currentLoggedInUser() ? this.connector.currentLoggedInUser() : null);

        } else {
            this.filter.filterAlarmGroupsByUser(false);
            this.filter.userName(null);
        }
    }

    private async acknowledgeAll() {
        this.isAcknowledgeAll(true);
        this.onlineAlarmsSource().stopPolling();

        var needAcknowledge = _.filter(this.onlineAlarms(), (alarm) => {
            return !alarm.DateAck;
        });

        var alarmIds = _.map(needAcknowledge, (alarm) => { return alarm.AlarmID; });

        if (alarmIds.length === 0) {
            this.onlineAlarmsSource().startPolling();
            this.isAcknowledgeAll(false);
            return;
        }

        try {
            const result = await this.connector.acknowledgeAlarms(alarmIds, null);
            if (result.Result === true) {
                const text = "I4SCADA_Acknowledgment_successful";
                const translation = ko.unwrap(this.connector.translate(text));
                this.connector.info(self, translation);
            } else {
                const text = ErrorCodeService.acknowledgmentErrorCodes[result.ErrorCodes[0].toString()];
                const translation = ko.unwrap(this.connector.translate(text));
                this.connector.error(this, translation);
            }
            this.onlineAlarmsSource().startPolling();
            this.isAcknowledgeAll(false);
            return result;
        } catch (error) {
            this.connector.handleError(WfAlarmViewerComponent)(error);
            this.onlineAlarmsSource().startPolling();
            this.isAcknowledgeAll(false);
        }
    }

    private getNameOfAlarmFields(columns: string[]) {

        return _.map(columns, (column) => {
            switch (column) {
                case 'Group':
                    return "AlarmGroupSymbolicTextTranslation";
                case 'Active':
                    return "DateOn";
                case 'Type':
                    return "AlarmTypeSymbolicTextTranslation";
                case 'Text':
                    return "AlarmSymbolicTextTranslation";
                case 'Acknowledged':
                    return "DateAck";
                case 'StatusText':
                    return "Status";
                case 'SystemTime':
                    return "SysTime";
                case 'GeneralComment':
                    return "AlarmComment";
                case 'AcknowledgeComment':
                    return "AckText";
                case 'AcknowledgeUserName':
                    return "AckUserName";
                case 'SignalName':
                    return "SignalAliasName";
                case 'HttpLink':
                    return "AlarmLinkURL";
                case 'Gone':
                    return "DateOff";
                case 'OpcItem':
                    return "SignalName";
                case 'Name':
                    return "AlarmTag";

                default:
                    return column;
            }
        });
    }

    private getColumnHeaders(columns: string[]) {
        return _.map(columns, (column) => {
            switch (column) {
                case 'Priority':
                    return "I4SCADA_Alarm_priority";
                case 'Status':
                    return "I4SCADA_Status";
                case 'DateOn':
                    return "I4SCADA_Active";
                case 'AlarmGroupSymbolicTextTranslation':
                    return "I4SCADA_Group";
                case 'AlarmTypeSymbolicTextTranslation':
                    return "I4SCADA_Type";
                case 'AlarmSymbolicTextTranslation':
                    return "I4SCADA_Text";
                case 'DateOff':
                    return "I4SCADA_Gone";
                case 'DateAck':
                    return "I4SCADA_Confirmed";
                case 'SysTime':
                    return "I4SCADA_System_Time";
                case 'HelpCause':
                    return "I4SCADA_Reason";
                case 'HelpEffect':
                    return "I4SCADA_Impact";
                case 'HelpRepair':
                    return "I4SCADA_Rectification";
                case 'AlarmComment':
                    return "I4SCADA_Alarm_Comment";
                case 'OccurrenceComment':
                    return "I4SCADA_Occurrence_Comment";
                case 'AckText':
                    return "I4SCADA_Acknowledge_Comment";
                case 'AckUserName':
                    return "I4SCADA_Acknowledge_UserName";
                case 'NavigationSource':
                    return "I4SCADA_Navigation_Source";
                case 'NavigationTarget':
                    return "I4SCADA_Navigation_Target";
                case 'SignalAliasName':
                    return "I4SCADA_Signal_Name";
                case 'ServerName':
                    return "I4SCADA_Server";
                case 'AlarmLinkURL':
                    return "I4SCADA_Alarm_URL";
                case 'OccurrenceCount':
                    return "I4SCADA_Occurrence_Count";
                case 'SignalName':
                    return "I4SCADA_OpcItem";
                case 'AlarmTag':
                    return "I4SCADA_Name";
                case 'Duration':
                    return "I4SCADA_Duration";
                case 'AcknowledgedWithComment':
                    return "I4SCADA_Acknowledged_With_Comment";
            }

            if (column.indexOf("ExtendedProperty") > -1) {
                return column;
            }
        });
    }

    private updateAvailableColumnFilters() {
        const filters: { id: number, name: string }[] = [];
        for (let item of this.availableColumnFilters()) {
            let name = item.name;
            if (name.indexOf("ExtendedProperty") > -1) {
                name = this.resolveExtendedPropertyName(parseInt(name.replace("ExtendedProperty", "")));
            }
            filters.push({ id: item.id, name: name });
        }
        this.availableColumnFilters(filters);
    }

    private resolveHeadder(data: { headers: KnockoutObservableArray<string>; data: KnockoutObservableArray<string>; }) {
        let headers: string[] = [];
        for (let item of data.headers()) {
            let headerName = item;
            if (headerName.indexOf("ExtendedProperty") > -1) {
                headerName = this.resolveExtendedPropertyName(parseInt(headerName.replace("ExtendedProperty", "")));
            }
            headers.push(headerName);
        }
        data.headers(headers);
    }

    private resolveExtendedProperties() {
        this.resolveHeadder(this.fields);
        this.resolveHeadder(this.columns);
    }

    private resolveExtendedPropertyName(index: number) {
        const extendedProperty = _.find(this.extendedAlarmProperties, x => x.Index === index);
        if (extendedProperty) {
            return extendedProperty.SymbolicTextName;
        }
        return "I4SCADA_ExtendedProperty_" + index;
    }

    private isDateField(field) {
        return field === 'DateOn' || field === 'DateAck' || field === 'SysTime' || field === 'DateOff';
    }

    private async loadInitialConfiguration() {
        try {
            const config = await this.connector.getControlConfigurationsByName(this.initialConfiguration, this.configurationNamespace, this.controlType);
            if (config) {
                let configuration = this.standaloneParametersReplacementService.replaceConfigurationParameters(config.Content);
                this.loadConfig(JSON.parse(configuration));
            }
        }
        catch (error) {
            this.connector.handleError(WfAlarmViewerComponent)(error);
        }
    }

    private getActiveAndNotAcknowledgedAlarmIds(alarms: AlarmDTO[]) {
        return _.pluck(alarms.filter((item) => {
            return item.DateAck == null && item.DateOff == null && item.DateOn != null;
        }), "AlarmID");
    }

    private checkNewActiveAndNotAcknowledgedAlarms(alarmIds: Guid[], newAlarmIds: Guid[]) {
        if (newAlarmIds.length)
            return _.difference(newAlarmIds, alarmIds);
        else
            return [];
    }

    private playSoundforActiveAndNotAcknowledgedAlarms(alarms: AlarmDTO[]) {

        var newAlarms = this.getActiveAndNotAcknowledgedAlarmIds(alarms);

        if (!_.any(newAlarms) && this.alarmHornService.loop) {
            this.alarmHornService.stop();
        }

        var oldAlarms = this.activeAndNotAcknowledgedAlarmIds;
        var newAlarmIds = this.checkNewActiveAndNotAcknowledgedAlarms(oldAlarms, newAlarms);
        this.activeAndNotAcknowledgedAlarmIds = this.getActiveAndNotAcknowledgedAlarmIds(alarms);
        var hasNewAlarm = _.any(newAlarmIds);
        if (this.alarmHornService.loop) {
            if (hasNewAlarm && !this.alarmHornService.isPlaying) {
                this.alarmHornService.play();
            }

        } else {
            if (hasNewAlarm) {
                this.alarmHornService.play();
            }
        }

    }

    private handleExport() {
        let fieldNames: string[] = null;
        let fields: string[] = null;

        if (this.tableView()) {
            fieldNames = this.columns.headers();
            fields = this.columns.data();
        } else {
            fieldNames = this.fields.headers();
            fields = this.fields.data();
        }

        const csvFile = this.convertCsvService.convertAlarmViewertData(this.onlineAlarms(), fieldNames.map(item => ko.unwrap(this.connector.translate(item))), fields);

        if (csvFile == null) return;
        this.convertCsvService.download();
    }

    protected async dispose() {
        await super.dispose();
        this.onlineAlarmsSource().stopPolling();

        //clear dialogs
        var settingsDialog = $(document).find('#modal-settings-' + ko.unwrap(this.id));
        var settingsBackContainer = $(document).find('#modal-settings-back-container-' + ko.unwrap(this.id));

        var alarmDialog = $(document).find('#modal-alarm-' + ko.unwrap(this.id));
        var alarmBackContainer = $(document).find('#modal-alarm-back-container-' + ko.unwrap(this.id));

        settingsDialog.remove();
        settingsBackContainer.remove();
        alarmDialog.remove();
        alarmBackContainer.remove();
    }

    private initializeNotDefaultObservables(): void {
        this.selectedAlarmGroupsIsNotDefault = ko.pureComputed(() => {
            return this.filterDialogFilter.alarmGroups().length > 0;
        }, this);

        this.selectedAlarmTypesIsNotDefault = ko.pureComputed(() => {
            return this.filterDialogFilter.alarmTypes().length > 0;
        }, this);

        this.selectedColumnIsNotDefault = ko.pureComputed(() => {
            return this.filterDialogFilter.column() !== FilterColumnType.None;
        }, this);

        this.selectedMaxRowCountIsNotDefault = ko.pureComputed(() => {
            return Number(this.filterDialogFilter.maxRowCount()) !== 100;
        }, this);

        this.selectedAlarmStatusIsNotDefault = ko.pureComputed(() => {
            return this.filterDialogFilter.alarmStatusFilter() !== AlarmStatusFilter.All;
        }, this);

        this.selectedAlarmPriorityIsNotDefault = ko.pureComputed(() => {
            return this.tempSelectedAlarm() !== undefined;
        }, this);

        this.selectedColumnFilterPatternIsNotDefault = ko.pureComputed(() => {
            return this.columnFilters() !== undefined &&
                this.columnFilters() !== null &&
                this.columnFilters().length > 0 &&
                this.columnFilters() !== "";
        }, this);
    }

    private getItemCssClass(DateOn, DateOff, DateAck) {
        return `${DateOn ? 'on' : ''} ${DateOff ? 'gone' : ''} ${DateAck ? 'acknowledged' : ''} ${this.rowItemCssClass}`;
    }

    private updateFilterTimeInterval(): void {
        if (!this.filter.isRollingTimeWindow()) {
            return;
        }

        const oldFilterChangedValue = this.filtersChanged();

        this.filter.startDate(moment().subtract(this.startOffsetIntervall, this.startOffset).toDate());
        this.filter.endDate(moment().subtract(this.endOffsetIntervall, this.endOffset).toDate());

        this.filtersChanged(oldFilterChangedValue);
    }

    private getFormattedDuration(difference: number): string {
        const duration = moment.duration(difference);

        const formattedString = Math.floor(duration.asHours()) + moment.utc(difference).format(":mm:ss");

        return formattedString;
    }
}

export = WfAlarmViewerComponent;
