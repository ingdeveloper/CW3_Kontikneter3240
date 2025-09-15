import ComponentBaseModel = require("../../../component-base.model");
import BusyIndicator = require("../../../../decorators/busyIndicator");
import UsersService = require("../../../../services/usersService");
import Logger = require("../../../../services/logger");
import CheckBoxObs = require("../shared/wf-um-check-box-obs-model");
import EventsFilterObs = require("../shared/wf-um-events-filter-obs-model");

interface IWfUMFilterDialogParams extends IComponentBaseParams {
    showModalFromOutside: KnockoutObservable<boolean>;
    confirmCallBackMethod: Function;  
    userActionFilter: EventsFilterObs;
}

class WfUMFilterDialogComponent extends ComponentBaseModel<IWfUMFilterDialogParams> {
    private busyContext: BusyIndicator;

    private customSubscriptions;

    private showModal: KnockoutObservable<boolean>;
    // modal fields
    private showModalFromOutside: KnockoutObservable<boolean>;   
    private confirmCallBackMethod: Function;
    private userActionFilter: EventsFilterObs;

    private maxCountEvents = ko.observable<number>(0);
    private shouldFilterByUsers = ko.observable<boolean>(true);
    private managamentEvents: KnockoutObservableArray<CheckBoxObs>;
    private activityEvents: KnockoutObservableArray<CheckBoxObs>;
    private filterUsers: KnockoutObservableArray<CheckBoxObs> = ko.observableArray<CheckBoxObs>([]);
    
    // localizations 
    private managamentEventsLoc = this.connector.translate('I4SCADA_UM_ManagamentEvents');
    private activityEventsLoc = this.connector.translate('I4SCADA_UM_ActivityEvents');  
    private filterUsersLoc = this.connector.translate('I4SCADA_UM_FilterUsers');   

   
    constructor(params: IWfUMFilterDialogParams) {
        super(params);
    }


    protected initializeSettings() {
        this.settings.systemAuthorization = "Show User Related Filtering In OperationDiary";
        super.initializeSettings();

        this.busyContext = new BusyIndicator(this);

        this.customSubscriptions = [];

        this.showModal = ko.observable(false);
        // input settings
        this.showModalFromOutside = this.settings.showModalFromOutside;
        this.confirmCallBackMethod = this.settings.confirmCallBackMethod;
        this.userActionFilter = this.settings.userActionFilter;
        // methods        
        this.initializeCheckBoxGroups();
        
        this.initializeComputeds();
    }

    private initializeCheckBoxGroups() {
        this.managamentEvents = ko.observableArray([
            new CheckBoxObs({ Name: this.connector.translate('I4SCADA_UM_UserCreated')(), ID: WFEventType.UserCreated.toString() }),
            new CheckBoxObs({ Name: this.connector.translate('I4SCADA_UM_UserIsDeleted')(), ID: WFEventType.UserDeleted.toString() }),
            new CheckBoxObs({ Name: this.connector.translate('I4SCADA_UM_UserIsModified')(), ID: WFEventType.UserModified.toString() }),
            new CheckBoxObs({ Name: this.connector.translate('I4SCADA_UM_UserPasswordIsChanged')(), ID: WFEventType.UserPasswordChanged.toString() })
        ]);

        this.activityEvents = ko.observableArray([
            new CheckBoxObs({ Name: this.connector.translate('I4SCADA_UM_UserLogsIn')(), ID: WFEventType.UserLoggedIn.toString() }),
            new CheckBoxObs({ Name: this.connector.translate('I4SCADA_UM_UserLogsOut')(), ID: WFEventType.UserLoggedOut.toString() }),
            new CheckBoxObs({ Name: this.connector.translate('I4SCADA_UM_UserWritesSignal')(), ID: WFEventType.UserWroteSignal.toString() })
        ]);
    }

    private initializeComputeds() {
        this.showModalFromOutside.extend({ notify: 'always' });
        let showModalSubscription = this.showModalFromOutside.subscribe((newValue) => {
            if (newValue) {
                this.showModal(true);
                this.initializeData();
            } else {
                this.showModal(false);
            }
        });
        this.customSubscriptions.push(showModalSubscription);
    }

    private async initializeData() {
        try {

            this.maxCountEvents(this.userActionFilter.MaximumCount());
            this.shouldFilterByUsers(this.userActionFilter.ShouldFilterByUsers());

            // select current filter events type
            const eventTypes = this.userActionFilter.EventTypes().map(item => item.toString());

            for (let i = 0; i < this.managamentEvents().length; i++) {
                let item = this.managamentEvents()[i];
                item.Selected(eventTypes.indexOf(item.ID) > -1);
            }

            for (let i = 0; i < this.activityEvents().length; i++) {
                let item = this.activityEvents()[i];
                item.Selected(eventTypes.indexOf(item.ID) > -1);
            }
            this.refreshUserRelatedInformation();

            this.connector.currentLoggedInUser.subscribe((newValue) => {
                //if (newValue !== null) {
                this.refreshUserRelatedInformation();
                //}
            });
        } catch (e) {
            Logger.error(this, "error" + ko.toJSON(e));
        }
    }

    private refreshUserRelatedInformation() {
        // check for new users every time dialog shows
        UsersService.getAllUsers(true).then(users => {
            //Logger.infoToast("Users [" + ko.toJSON(users) + "]");
            users = isNullOrUndefined(users) ? [] : users;
            

            const usersNames = this.userActionFilter.Users().map(item => item.Name);
            const usersCheckBoxObs = users.map(item => {
                const checkBoxObs = new CheckBoxObs(item);
                checkBoxObs.Selected(usersNames.indexOf(item.Name) > -1);
                return checkBoxObs;
            });

            this.filterUsers(usersCheckBoxObs);
        });
    }

    private onSaveClick() {

        let newEventTypes = [];
        this.managamentEvents().forEach(item => { 
            if (item.Selected()) {
                newEventTypes.push(Number(item.ID));
            }
        });
        this.activityEvents().forEach(item => { 
            if (item.Selected()) {
                newEventTypes.push(Number(item.ID));
            }
        });

        let newUsers = [];
        this.filterUsers().forEach(item => {
            if (item.Selected()) {
                let user = <NameDTO> {
                    ID: item.ID,
                    Name: item.Name
                };
                newUsers.push(user);
            }
        });
        
        this.userActionFilter.EventTypes(newEventTypes);
        this.userActionFilter.Users(newUsers);
        this.userActionFilter.MaximumCount(Number(this.maxCountEvents()));
        this.userActionFilter.ShouldFilterByUsers(this.shouldFilterByUsers());

        this.confirmCallBackMethod();
        this.close();
    }

    private close() {
        this.showModalFromOutside(false);
    }

    private clearCustomSubscriptions() {
        for (let i = 0; i < this.customSubscriptions.length; i++) { 
            this.customSubscriptions[i].dispose();          
        }
    }

    protected async dispose() {
        this.clearCustomSubscriptions();
        await super.dispose();
    }
}

export = WfUMFilterDialogComponent;
