import ComponentBaseModel = require("src/components/component-base.model");
import BusyIndicator = require("src/decorators/busyIndicator");
import Logger = require("src/services/logger");
import EventsFilterObs = require("src/components/security/wf-user-manager/shared/wf-um-events-filter-obs-model");
import Moment = moment.Moment;
import { Utils } from "src/components/security/wf-user-manager/shared/utils";

interface IWfUMTimeIntervalDialogParams extends IComponentBaseParams {
    showModalFromOutside: KnockoutObservable<boolean>;
    confirmCallBackMethod: Function; 
    userActionFilter: EventsFilterObs;
    
    startOffset: "minutes" | "seconds" | "days" | "weeks" | "months" | "years";
    startOffsetIntervall: number;
    endOffset: "minutes" | "seconds" | "days" | "weeks" | "months" | "years";
    endOffsetIntervall: number;
}

class WfUMTimeIntervalDialogComponent extends ComponentBaseModel<IWfUMTimeIntervalDialogParams> {
    private busyContext: BusyIndicator;

    private customSubscriptions;

    private showModal: KnockoutObservable<boolean>;
    // modal fields
    private showModalFromOutside: KnockoutObservable<boolean>;   
    private confirmCallBackMethod: Function;
    private userActionFilter: EventsFilterObs;
    // date range
    private endDateInput: KnockoutObservable<Moment>;
    private startDateInput: KnockoutObservable<Moment>;
   

    constructor(params: IWfUMTimeIntervalDialogParams) {
        super(params);
    }


    protected initializeSettings() {
        super.initializeSettings();

        this.busyContext = new BusyIndicator(this);

        this.customSubscriptions = [];

        this.showModal = ko.observable(false);
        // input settings
        this.showModalFromOutside = this.settings.showModalFromOutside;
        this.confirmCallBackMethod = this.settings.confirmCallBackMethod;
        this.userActionFilter = this.settings.userActionFilter;         
        // date range
        this.startDateInput = ko.observable(null);
        this.endDateInput = ko.observable(null);

        // methods
        this.initializeComputeds();
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

    private initializeData() {
        this.startDateInput(moment(this.userActionFilter.Time().Start()));
        this.endDateInput(moment(this.userActionFilter.Time().End()));
    }

    private onSaveClick() {
        this.userActionFilter.Time().Start(moment(this.startDateInput()).toMSDate());
        this.userActionFilter.Time().End(moment(this.endDateInput()).toMSDate());

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

export = WfUMTimeIntervalDialogComponent;
