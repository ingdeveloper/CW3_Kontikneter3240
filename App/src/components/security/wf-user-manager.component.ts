import ComponentBaseModel = require("../component-base.model");
import UsersService = require("../../services/usersService");
import { WfUMDropDownItem, EventsFilterExtended } from "./wf-user-manager/shared/wf-um-interfaces";
import { ConfigControlType } from "../../services/connectorEnums"
import { Pages } from "./wf-user-manager/shared/wf-um-enyms"
import { Utils } from "./wf-user-manager/shared/utils";
import EventsFilterObs = require("./wf-user-manager/shared/wf-um-events-filter-obs-model");
import { TimeRangeService } from "../services/time-range.service";

interface IWfUserManagerParams extends IComponentBaseParams {
    autoUpdate: boolean;
    updateRate: number;

    startOffset: "minutes" | "seconds" | "days" | "weeks" | "months" | "years";
    startOffsetIntervall: number;
    endOffset: "minutes" | "seconds" | "days" | "weeks" | "months" | "years";
    endOffsetIntervall: number;
}

class WfUserManagerComponent extends ComponentBaseModel<IWfUserManagerParams> {
    private Pages = Pages;
    
    private userActionFilter: EventsFilterObs;
    // user action configuration params control type
    private controlType: ConfigControlType;
    // user action auto refresh btn
    private autoUpdate: boolean;
    private updateRate: number;

    private startOffsetIntervall: number;
    private startOffset: string;
    private endOffset: string;
    private endOffsetIntervall: number;
    // main drop down
    private dropDownItems: WfUMDropDownItem[] = [
        { value: Pages.Users, text: '' }, 
        { value: Pages.AuthorizationGroups, text: '' }, 
        { value: Pages.ProjectAuthorizations, text: '' }, 
        { value: Pages.AccessGroups, text: '' }, 
        { value: Pages.AccessAuthorizations, text: '' }, 
        { value: Pages.UserActions, text: '' }
    ];
    private dropDownSelectedItem = ko.observable(this.dropDownItems[0]);
    
    // users dialogs
    private showDefaultSettingsDialog: KnockoutObservable<boolean>;
    private showPasswordPolicyDialog: KnockoutObservable<boolean>;
    // action dialogs
    private showTimeIntervalDialog: KnockoutObservable<boolean>;
    private showfilterDialog: KnockoutObservable<boolean>;
    private activeUserActionConfigName: KnockoutObservable<string>;

    private refreshPageTrigger: KnockoutObservable<string>;
    

    constructor(params: IWfUserManagerParams) {
        super(params);  

        this.setLocalizations();
    }
    

    protected initializeSettings() {
        super.initializeSettings();

        this.controlType = ConfigControlType.UserManager;
        // user action auto refresh btn
        this.autoUpdate = this.settings.autoUpdate ? this.settings.autoUpdate : false;
        this.updateRate = (this.settings.updateRate && this.settings.updateRate >= 1000) ? this.settings.updateRate : 2000;

        this.startOffset = ko.unwrap(this.settings.startOffset) ? ko.unwrap(this.settings.startOffset).trim().toLowerCase() : "minutes"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
        this.startOffsetIntervall = ko.unwrap(this.settings.startOffsetIntervall) ? ko.unwrap(this.settings.startOffsetIntervall) : 30;
        this.endOffset = ko.unwrap(this.settings.endOffset) ? ko.unwrap(this.settings.endOffset).trim().toLowerCase() : "minutes"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
        this.endOffsetIntervall = ko.unwrap(this.settings.endOffsetIntervall) ? ko.unwrap(this.settings.endOffsetIntervall) : 0;
        // users dialogs
        this.showDefaultSettingsDialog = ko.observable(false);
        this.showPasswordPolicyDialog = ko.observable(false);
        // action dialogs
        this.showTimeIntervalDialog = ko.observable(false);
        this.showfilterDialog = ko.observable(false);
        this.activeUserActionConfigName = ko.observable(null); 
        this.userActionFilter = new EventsFilterObs();

        this.refreshPageTrigger = ko.observable(null);   

        this.setDefaultUserActionFilter();
        this.addCustomExtenders();   
    }


    private addCustomExtenders() {
        ko.extenders['required'] = (target) => {
            //add some sub-observables to our observable
            target.isFieldEmpty = ko.observable(true);
            //define a function to do validation
            function validate(newValue) {
               if (Utils.isNullUndefOrEmpty(newValue)) {
                    target.isFieldEmpty(true);
               } else {
                    target.isFieldEmpty(false);
               }
            }         
            //initial validation
            validate(target());    
            //validate whenever the value changes
            target.subscribe(validate);  
            //return the original observable
            return target;
        };
    }

    private async setDefaultUserActionFilter() {
        const defaultTimeRange =
            TimeRangeService.getRangeDates(
                CalendarTimeRanges.Today,
                new Date(),
                new Date(),
                new Date(),
                this.startOffsetIntervall,
                this.startOffset,
                this.endOffsetIntervall,
                this.endOffset);

        const filter: EventsFilterExtended = {
            ShouldFilterByUsers: true,
            Users: [],
            Time: {
                Start: moment(defaultTimeRange.startDate).toMSDate(),
                End: moment(defaultTimeRange.endDate).toMSDate()
            },
            MaximumCount: 20,
            EventTypes: [
                WFEventType.UserCreated,
                WFEventType.UserDeleted,
                WFEventType.UserLoggedIn,
                WFEventType.UserLoggedOut,
                WFEventType.UserModified,
                WFEventType.UserPasswordChanged,
                WFEventType.UserWroteSignal
            ],
            AutoUpdate: this.autoUpdate,
            SelectedRangeInput: CalendarTimeRanges.Today,
            TimeRangeDateInput: new Date(),
            EndOffset: this.endOffset,
            EndOffsetIntervall: this.endOffsetIntervall,
            StartOffset: this.startOffset,
            StartOffsetIntervall: this.startOffsetIntervall
        };
        this.userActionFilter.fromDto(filter);
    }

    private async getAllUsers(): Promise<NameDTO[]> {        
        const response = await UsersService.getAllUsers();
        if (!isNullOrUndefined(response)) {
            return response.map(item => { 
                return  <NameDTO> {
                    ID: item.ID,
                    Name: item.Name
                }
            });
        } else {
            return [];
        }
    }

    private getConfig(): EventsFilterExtended {    
        return this.userActionFilter.toDto();
    }

    private loadConfig(content: EventsFilterExtended, config: ControlConfigurationDTO) {  
        this.userActionFilter.fromDto(content);
        this.activeUserActionConfigName(config.Name);  
    }

    private setLocalizations() {
        this.dropDownItems[0].text = this.connector.translate('I4SCADA_UM_Users'); 
        this.dropDownItems[1].text = this.connector.translate('I4SCADA_UM_AuthorizationGroups');
        this.dropDownItems[2].text = this.connector.translate('I4SCADA_UM_ProjectAuthorizations');
        this.dropDownItems[3].text = this.connector.translate('I4SCADA_UM_AccessGroups');
        this.dropDownItems[4].text = this.connector.translate('I4SCADA_UM_AccessAuthorizations'); 
        this.dropDownItems[5].text = this.connector.translate('I4SCADA_UM_UserActions');
    }

    private onClickSelectItem(item) {
        this.dropDownSelectedItem(item);   
    }

    private onClickRefreshPage() {
        this.refreshPageTrigger(this.dropDownSelectedItem().value);
    }

    // users dialogs
    private onDefaultSettingsClick () {
        this.showDefaultSettingsDialog(true);       
    }

    private onPasswordPolicyClick () {
        this.showPasswordPolicyDialog(true);       
    }
    // action dialogs
    private onTimeIntervalClick () {
        this.showTimeIntervalDialog(true);       
    }

    private onClickAutoRefresh() {
        this.userActionFilter.AutoUpdate(!this.userActionFilter.AutoUpdate());
    }

    private onFilterClick () {
        this.showfilterDialog(true);       
    }

    protected async dispose() {
        await super.dispose();
    }
}

export = WfUserManagerComponent;
