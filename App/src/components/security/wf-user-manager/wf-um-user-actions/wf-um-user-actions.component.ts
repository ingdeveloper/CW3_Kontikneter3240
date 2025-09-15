import ComponentBaseModel = require("../../../component-base.model");
import SilverlightToolsService = require("../../../../services/silverlightToolsService");
import UsersService = require("../../../../services/usersService");
import BusyIndicator = require("../../../../decorators/busyIndicator");
// import { WFEventType } from "../../../../services/models/dto/WFEventType";
import Logger = require("../../../../services/logger");
import EventsFilterObs = require("../shared/wf-um-events-filter-obs-model");
import { WfUMSortedColumn, WfUMUserActionsDTO } from "../shared/wf-um-interfaces";
import { Action, SortOrder } from "../shared/wf-um-enyms";
import { Utils } from "../shared/utils";
import { TimeRangeService } from "../../../services/time-range.service";
import TimePeriodObs = require("../shared/wf-um-time-period-obs-model");

declare var uuid;

interface IWfUMUserActionsParams extends IComponentBaseParams {
    showTimeIntervalDialog: KnockoutObservable<boolean>;
    showfilterDialog: KnockoutObservable<boolean>;

    userActionFilter: EventsFilterObs;

    activeUserActionConfigName: KnockoutObservable<string>;
    height: number;
    autoUpdate: boolean;
    updateRate: number;
}

class WfUMUserActionsComponent extends ComponentBaseModel<IWfUMUserActionsParams> {
    private busyContext: BusyIndicator;
    private SortOrder = SortOrder;
    private customSubscriptions;

    private tableDS: KnockoutObservableArray<WfUMUserActionsDTO>;
    private tableViewDS: KnockoutObservableArray<WfUMUserActionsDTO>;
    private searchText: KnockoutObservable<string>;
    private sortedColumn: WfUMSortedColumn;

    private userActionFilter: EventsFilterObs;

    private height: KnockoutObservable<number>;
    private panelBodyHeight: KnockoutComputed<number>;

    private activeUserActionConfigName: KnockoutObservable<string>;
    // auto refresh
    private autoRefreshInterval;
    // dialogs
    private timeIntervalDialog: any;
    private filterDialog: any;

    private selectedRangeInput: KnockoutObservable<CalendarTimeRanges>;

    constructor(params: IWfUMUserActionsParams) {
        super(params);
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.busyContext = new BusyIndicator(this);
        this.customSubscriptions = [];

        this.tableDS = ko.observableArray([]);
        this.tableViewDS = ko.observableArray([]);
        this.searchText = ko.observable('');
        this.sortedColumn = { name: ko.observable(''), order: ko.observable('') };

        this.userActionFilter = this.settings.userActionFilter;
        this.activeUserActionConfigName = this.settings.activeUserActionConfigName;

        this.initializeComputeds();
        this.initializeDialogsVariables();     

        this.refreshPage();

        this.height = ko.observable(ko.unwrap(this.settings.height) || null);

        this.panelBodyHeight = ko.pureComputed(() => {
            if (!this.height()) {
                return null;
            }
            return this.height();
        });
    }

    private initializeComputeds() {
        this.connector.currentLoggedInUser.subscribe(async (newValue) => {
            if (Utils.isNullOrUndefined(newValue)) {
                this.clearAutoRefreshInterval();
                this.tableDS([]);
                this.tableViewDS([]);
                this.clearFilter();
            } else {
                this.refreshPage();
            }
        });

        this.searchText.subscribe((newValue) => {
            this.onSearch(newValue);
        });

        this.activeUserActionConfigName.extend({ notify: 'always' });
        let actionConfigNameSubscription = this.activeUserActionConfigName.subscribe((newValue) => {
            this.getAllUserActions();
        });
        this.customSubscriptions.push(actionConfigNameSubscription);
   
        let autoUpdateSubscription = this.userActionFilter.AutoUpdate.subscribe((newValue) => {
            if (newValue) {
                this.startAutoRefreshProcess();
            } else {
                this.clearAutoRefreshInterval();
            }
        });
        this.customSubscriptions.push(autoUpdateSubscription);
    }

    private async refreshPage() {
        // filter can be initialized before user login. in that moment app have not rights to pull all users from database
        // first time user login extend default filter with those information
        if (this.connector.currentLoggedInUser()) {
            let users = await this.getAllUsers();

            let currentFilterUsers = this.userActionFilter.Users().map(item => item.ID);
            if (currentFilterUsers.length > 0) {
                let onlyCurrentSelectedUsers = users.filter(item => currentFilterUsers.indexOf(item.ID) > -1);
                this.userActionFilter.Users(onlyCurrentSelectedUsers);
            } else {
                this.userActionFilter.Users(users);
            }
            
            this.getAllUserActions();

            if (this.userActionFilter.AutoUpdate()) {
                this.startAutoRefreshProcess();
            }
        }
    }

    private startAutoRefreshProcess() {
        if (Utils.isNullOrUndefined(this.autoRefreshInterval) || this.autoRefreshInterval === false) {
            this.autoRefreshInterval = setInterval(async () => {
                this.getAllUserActions();           
            }, this.settings.updateRate);
        }
    }

    private initializeDialogsVariables() {
        // time interval  
        this.timeIntervalDialog = {
            show: ko.observable(false),
            responseMethod: async () => {
                this.getAllUserActions();
            }
        }
        this.timeIntervalDialog.show = this.settings.showTimeIntervalDialog; // use reference from main page
        // filter  
        this.filterDialog = {
            show: ko.observable(false),
            responseMethod: async () => {
                this.getAllUserActions();
            }
        }
        this.filterDialog.show = this.settings.showfilterDialog; // use reference from main page      
    }

    private async getAllUserActions() {
        this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyLoadingUserActions')(),
            async () => {
                try {
                    this.adjustFilterTime();

                    const response =
                        await SilverlightToolsService.getWFEvents(this.userActionFilter.toDto(),
                            this.connector.currentLanguageId());
                    if (response) {
                        const parsedData = this.parseResponseData(response);
                        this.tableDS(parsedData);
                        this.tableViewDS(parsedData.slice());
                        this.applyFilters();
                    } else {
                        this.tableDS([]);
                        this.tableViewDS([]);
                    }
                } catch (error) {
                    this.connector.handleError(WfUMUserActionsComponent)(error);
                }
            });
    }

    private async getAllUsers(): Promise<NameDTO[]> {
        const response = await UsersService.getAllUsers(true);
        if (!isNullOrUndefined(response)) {
            return response.map(item => {
                return <NameDTO>{
                    ID: item.ID,
                    Name: item.Name
                }
            });
        } else {
            return [];
        }
    }

    private parseResponseData(data: VisualEvent[]): WfUMUserActionsDTO[] {
        return data.map(item => {
            return <WfUMUserActionsDTO>{
                Icon: item.Icon,
                Time: moment(item.Time).format('DD.MM.YYYY HH:mm:ss'),
                Event: item.EventText,
                Text: item.Text,
                UserName: item.User.Name,
                AffectedUserName: item.AffectedUserName
            };
        });
    }

    private onSearch(newValue) {
        this.tableViewDS(Utils.filterArrayMultiple(this.tableDS(), ['Event', 'Text'], newValue));
    }

    private onSortClick(columnName) {
        this.sortedColumn.name(columnName);
        this.sortedColumn.order(this.sortedColumn.order() === SortOrder.Asc ? SortOrder.Desc: SortOrder.Asc);

        let desc = this.sortedColumn.order() === SortOrder.Desc;
        // always sort both array because of search which always use original array
        this.tableViewDS.sort(Utils.sortArray(columnName, desc));
        this.tableDS.sort(Utils.sortArray(columnName, desc));
    }

    private applyFilters() {
        if (!Utils.isNullUndefOrEmpty(this.sortedColumn.name())) {
            let desc = this.sortedColumn.order() === SortOrder.Desc;
            this.tableDS.sort(Utils.sortArray(this.sortedColumn.name(), desc));
        }
        this.onSearch(this.searchText());
    }

    private clearAutoRefreshInterval() {
        if (this.autoRefreshInterval !== false) {
            clearInterval(this.autoRefreshInterval);           
            this.autoRefreshInterval = false;
        }       
    }

    private clearCustomSubscriptions() {
        for (let i = 0; i < this.customSubscriptions.length; i++) { 
            this.customSubscriptions[i].dispose();          
        }
    }

    // DIALOGS
    protected async dispose() { 
        this.clearAutoRefreshInterval();
        this.clearCustomSubscriptions();    
        await super.dispose();   
    }

    private clearFilter(): void {
        this.userActionFilter.Users([]);
    }

    private adjustFilterTime(): void {
        if (!this.userActionFilter || !this.userActionFilter.AutoUpdate) {
            return;
        }

        const range =
            TimeRangeService.getRangeDates(
                this.userActionFilter.SelectedRangeInput(),
                this.userActionFilter.TimeRangeDateInput(),
                moment(this.userActionFilter.Time().Start()).toDate(),
                moment(this.userActionFilter.Time().End()).toDate(),
                this.userActionFilter.StartOffsetIntervall(),
                this.userActionFilter.StartOffset(),
                this.userActionFilter.EndOffsetIntervall(),
                this.userActionFilter.EndOffset());

        this.userActionFilter.Time().Start(moment(range.startDate).toMSDate());
        this.userActionFilter.Time().End(moment(range.endDate).toMSDate());
    }
}

export = WfUMUserActionsComponent;
