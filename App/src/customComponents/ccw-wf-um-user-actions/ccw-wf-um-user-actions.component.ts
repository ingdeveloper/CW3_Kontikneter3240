import ComponentBaseModel = require("src/components/component-base.model");
import SilverlightToolsService = require("src/services/silverlightToolsService");
import UsersService = require("src/services/usersService");
import BusyIndicator = require("src/decorators/busyIndicator");
// import { WFEventType } from "../../../../services/models/dto/WFEventType";
import Logger = require("src/services/logger");
import EventsFilterObs = require("src/components/security/wf-user-manager/shared/wf-um-events-filter-obs-model");
import { WfUMSortedColumn, WfUMUserActionsDTO } from "src/components/security/wf-user-manager/shared/wf-um-interfaces";
import { Action, SortOrder } from "src/components/security/wf-user-manager/shared/wf-um-enyms";
import { Utils } from "src/components/security/wf-user-manager/shared/utils";
import TimePeriodObs = require("src/components/security/wf-user-manager/shared/wf-um-time-period-obs-model");

declare var uuid;

interface IWfUMUserActionsParams extends IComponentBaseParams {
  showTimeIntervalDialog: KnockoutObservable<boolean>;
  showfilterDialog: KnockoutObservable<boolean>;

  userActionFilter: EventsFilterObs;

  activeUserActionConfigName: KnockoutObservable<string>;
  height: number;
  autoUpdate: boolean;
  updateRate: number;

  startOffset: "minutes" | "seconds" | "days" | "weeks" | "months" | "years";
  startOffsetIntervall: number;
  endOffset: "minutes" | "seconds" | "days" | "weeks" | "months" | "years";
  endOffsetIntervall: number;
}

interface ccwWfUMUserActionsDTO {
  Icon: string;
  Time: string;
  Event: KnockoutComputed<string>;
  Text: KnockoutComputed<string>;
  UserName: string;
  AffectedUserName: string;
  Signal: Signal;
  AliasName: string;
  SignalNewValue: string;
  SignalOldValue: string;
  ClientMachine: string;
}

class WfUMUserActionsComponent extends ComponentBaseModel<IWfUMUserActionsParams> {
  private busyContext: BusyIndicator;
  private SortOrder = SortOrder;
  private customSubscriptions;

  private tableDS: KnockoutObservableArray<ccwWfUMUserActionsDTO>;
  private tableViewDS: KnockoutObservableArray<ccwWfUMUserActionsDTO>;
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

  private userActivityEventFilter: UserActivityEventFilter;

  private userLevel: KnockoutObservable<number>;
  private dateStart:KnockoutObservable<string>;
  private dateEnd:KnockoutObservable<string>;

  constructor(params: IWfUMUserActionsParams) {
    super(params);
  }

  protected initializeSettings() {
    super.initializeSettings();

    this.busyContext = new BusyIndicator(this);
    this.customSubscriptions = [];

    this.tableDS = ko.observableArray([]);
    this.tableViewDS = ko.observableArray([]);
    this.searchText = ko.observable("");
    this.sortedColumn = { name: ko.observable(""), order: ko.observable("") };

    this.userActionFilter = this.settings.userActionFilter;
    this.activeUserActionConfigName = this.settings.activeUserActionConfigName;
    this.userLevel = ko.observable(-1);
    this.dateStart = ko.observable('');
    this.dateEnd = ko.observable('');

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

  private async initializeComputeds() {
    this.connector.currentLoggedInUser.subscribe(async newValue => {
      // console.log(this.connector.getCurrentLoggedInUser());
      UsersService.getCurrentUserDetails().then(userDetails => {
        this.userLevel(userDetails ? userDetails.UserLevel : -1);
        // console.log("UserLevel = " + ul);
        var userEnable = this.userLevel() >= 3; //UserLevel: Ergebnisse -1..3  -1=nicht angemeldet
        if (!userEnable) {
          console.log(
            "%cFür den Benutzer-Manager ist der UserLevel zu niedrig! UserLevel ist " + this.userLevel(),
            "background:yellow"
          );
        }
        if (Utils.isNullOrUndefined(newValue) || !userEnable) {
          this.clearAutoRefreshInterval();
          this.tableDS([]);
          this.tableViewDS([]);
        } else {
          this.refreshPage();
        }
      });
    });

    let ul = await UsersService.getCurrentUserDetails();
    this.userLevel(ul ? ul.UserLevel : -1);

    this.searchText.subscribe(newValue => {
      this.onSearch(newValue);
    });

    this.activeUserActionConfigName.extend({ notify: "always" });
    let actionConfigNameSubscription = this.activeUserActionConfigName.subscribe(newValue => {
      this.getAllUserActions();
    });
    this.customSubscriptions.push(actionConfigNameSubscription);

    let autoUpdateSubscription = this.userActionFilter.AutoUpdate.subscribe(newValue => {
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
    console.log("refreshPage");
    if (this.connector.currentLoggedInUser()) {
      let users = await this.getAllUsers();

      let currentFilterUsers = this.userActionFilter.Users().map(item => item.ID);
      if (currentFilterUsers.length > 0) {
        let onlyCurrentSelectedUsers = users.filter(item => currentFilterUsers.indexOf(item.ID) > -1);
        this.userActionFilter.Users(onlyCurrentSelectedUsers);
      } else {
        this.userActionFilter.Users(users);
      }
      // console.log("refreshPage");

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
        // this.refreshPage();
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
    };
    this.timeIntervalDialog.show = this.settings.showTimeIntervalDialog; // use reference from main page
    // filter
    this.filterDialog = {
      show: ko.observable(false),
      responseMethod: async () => {
        this.getAllUserActions();
      }
    };
    this.filterDialog.show = this.settings.showfilterDialog; // use reference from main page
  }

  private async getAllUserActions() {
    this.busyContext.runLongAction(this.connector.translate("I4SCADA_UM_BusyLoadingUserActions")(), async () => {
      try {
        if (this.userActionFilter.AutoUpdate() === true) {
          var newDate = new TimePeriodObs();
          newDate.End(moment(new Date()).toMSDate());
          this.userActionFilter.Time(newDate);
        }

        var myStart = this.userActionFilter.Time().Start();  ///Date(1557130031956)/
        myStart = myStart.substr(myStart.indexOf('(',1)+1);  //ab '(' kopieren
        myStart = moment(parseInt(myStart)).format('YYYY.MM.DD HH:mm');
        this.dateStart(myStart);
        var myEnd = this.userActionFilter.Time().End();  ///Date(1557130031956)/
        myEnd = myEnd.substr(myEnd.indexOf('(',1)+1);  //ab '(' kopieren
        myEnd = moment(parseInt(myEnd)).format('YYYY.MM.DD HH:mm');
        this.dateEnd(myEnd);
        
        var response = null;
        if (this.userLevel() >= 3) {
          response = await SilverlightToolsService.getWFEvents(
            this.userActionFilter.toDto(),
            this.connector.currentLanguageId()
          );
        }
        
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
    const response = await UsersService.getAllUsers();
    console.log("getAllUsers");

    console.log(response);

    if (!isNullOrUndefined(response)) {
      return response.map(item => {
        return <NameDTO>{
          ID: item.ID,
          Name: item.Name
        };
      });
    } else {
      return [];
    }
  }

  private parseResponseData(data: VisualEvent[]): ccwWfUMUserActionsDTO[] {
    return data.map(item => {
      var myStart = item.Time.substr(item.Time.indexOf('(',1)+1);  //ab '(' kopieren
      var offsetMinuten = moment().utcOffset();  //Zeitzone ermitteln
      var myDate = (parseInt(myStart) ) + (offsetMinuten * 60 * 1000);  //Zahl nehmen und mit 2 Stunden (hier in ms) addieren
      // console.log(parseInt(myStart) + " / " + (offsetMinuten * 60) );
      myStart = moment(myDate).format('YYYY.MM.DD HH:mm:ss');
      return <ccwWfUMUserActionsDTO>{
        Icon: item.Icon,
        Time: myStart,//moment(item.Time).format("DD.MM.YYYY HH:mm:ss"),
        Event: item.EventText,
        Text: item.Text,
        UserName: item.User.Name,
        AffectedUserName: item.AffectedUserName,
        Signal: item.Signal,
        AliasName: item.Signal ? item.Signal.AliasName : "",
        SignalNewValue: item.SignalNewValue,
        SignalOldValue: item.SignalOldValue,
        ClientMachine: item.ClientMachine
      };
    });
  }

  private onSearch(newValue) {
    this.tableViewDS(
      Utils.filterArrayMultiple(this.tableDS(), ["Event", "Text", "UserName", "ClientMachine", "AliasName"], newValue)
    );
  }

  private onSortClick(columnName) {
    this.sortedColumn.name(columnName);
    this.sortedColumn.order(this.sortedColumn.order() === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc);

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
}

export = WfUMUserActionsComponent;
