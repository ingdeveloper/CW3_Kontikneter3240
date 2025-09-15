import Connector = require("../../services/connector");

import LogbookFilter = require("../../services/models/logbookFilter");
import LogbookSource = require("../../services/logbookSource");

import ComponentBaseModel = require("../component-base.model");
import { ConfigControlType } from "../../services/connectorEnums"
import Moment = moment.Moment;

declare var uuid;

interface IWfLogbookViewerParams extends IComponentBaseParams {
    defaultItemClass: string
    selectedTopic: string;
    startOffset: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
    startOffsetIntervall: number;
    height: number;
    getLatestLogdata: boolean;
    updateRate: number;
    maxResults: number;
}

class WfLogbookViewerComponent extends ComponentBaseModel<IWfLogbookViewerParams> {
    private source: LogbookSource;
    private filter: LogbookFilter;
    private loggedInUserName: KnockoutComputed<string>;
    private getLatestLogdata: KnockoutObservable<boolean>;
    private endDate: KnockoutObservable<Moment>;
    private startDate: KnockoutObservable<Moment>;
    private startOffsetIntervall: number;
    private startOffset: string;
    private height: KnockoutObservable<number | boolean>;
    private maxResults: KnockoutObservable<number>;
    private updateRate: number;
    private defaultItemClass: string;
    private filtersChanged: KnockoutObservable<boolean>;
    private selectedTopic: KnockoutObservable<string>;
    private showSettingsDialog: KnockoutObservable<boolean>;
    private showSendDialog: KnockoutObservable<boolean>;
    private entryBody: KnockoutObservable<string>;
    private entryTopic: KnockoutObservable<string>;
    private entrySubject: KnockoutObservable<string>;
    private topics: KnockoutObservableArray<string>;
    private logsEntries: KnockoutObservableArray<LogbookEntryDTO>;

    constructor(params: IWfLogbookViewerParams) {
        super(params)
        this.initializeComputeds();

        this.getCurrentLoggedInUser();
        this.setFilter();
        this.setEntries();
        this.getTopics();


    }

    protected initializeSettings() {
        super.initializeSettings();
        this.showSettingsDialog = ko.observable(false);
        this.showSendDialog = ko.observable(false);

        this.logsEntries = ko.observableArray<LogbookEntryDTO>([]);
        this.topics = ko.observableArray<string>([]);
        this.entrySubject = ko.observable<string>();
        this.entryTopic = ko.observable<string>();
        this.entryBody = ko.observable<string>();
        this.filtersChanged = ko.observable(false);
        this.selectedTopic = ko.observable(this.settings.selectedTopic);
        this.filter = new LogbookFilter();

        this.defaultItemClass = ko.unwrap(this.settings.defaultItemClass) || "wf-callout-box wf-callout-box-info";

        this.updateRate = ko.unwrap(this.settings.updateRate) || 5000;
        this.maxResults = ko.observable(this.settings.maxResults || 5);

        this.height = ko.observable(ko.unwrap(this.settings.height) !== undefined ? ko.unwrap(this.settings.height) : false);

        this.startOffset = ko.unwrap(this.settings.startOffset) ? ko.unwrap(this.settings.startOffset).trim().toLowerCase() : "hour"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
        this.startOffsetIntervall = ko.unwrap(this.settings.startOffsetIntervall) ? ko.unwrap(this.settings.startOffsetIntervall) : 24;
        this.startDate = ko.observable(moment().subtract(this.startOffset, this.startOffsetIntervall));
        this.endDate = ko.observable(moment());
        this.getLatestLogdata = ko.observable(this.settings.getLatestLogdata !== undefined ? this.settings.getLatestLogdata : true);
    }

    protected initializeComputeds() {

    }

    private async getCurrentLoggedInUser() {
        this.loggedInUserName = this.connector.currentLoggedInUser;
        try {
            await this.connector.getCurrentLoggedInUser()
        } catch (error) {
            this.connector.handleError(WfLogbookViewerComponent)(error);
        }
    }

    private async getTopics() {
        const topics = await this.connector.getLogbookTopics();
        this.topics(topics);
        this.selectedTopic(this.selectedTopic());
    }

    private setEntries() {

        this.source = this.connector.getLogbookEntries(this.filter);
        this.logsEntries = this.source.logsEntries;
        this.source.updateRate = this.updateRate;
        this.source.startPolling();
    }

    private setFilter() {

        this.filter.from(moment(this.startDate()));
        this.getLatestLogdata() ? this.filter.to(null) : this.filter.to(moment(this.endDate()));
        this.filter.topN(this.maxResults());
        this.filter.format(0);
        this.filter.topic(this.selectedTopic());
    }

    private getSaveTopicName(topic) {
        return topic ? topic.toLowerCase().replace(/ /g, '').replace(/[^a-zA-Z]/g, '') : '';
    }

    protected async dispose() {
        await super.dispose();
        this.source.stopPolling();
        //clear dialogs
        var formDialog = $(document).find('#modal-form-' + ko.unwrap(this.id));
        var formBackContainer = $(document).find('#modal-form-back-container-' + ko.unwrap(this.id));

        var settingsDialog = $(document).find('#modal-settings-' + ko.unwrap(this.id));
        var settingsBackContainer = $(document).find('#modal-settings-back-container-' + ko.unwrap(this.id));

        formDialog.remove();
        formBackContainer.remove();
        settingsDialog.remove();
        settingsBackContainer.remove();
    }

}

export = WfLogbookViewerComponent;
