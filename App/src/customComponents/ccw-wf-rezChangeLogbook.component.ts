import Connector = require("src/services/connector");

import LogbookFilter = require("src/services/models/logbookFilter");
import LogbookSource = require("src/services/logbookSource");
import StandaloneParametersReplacementService = require("src/components/services/standalone-parameters-replacement.service");

import ComponentBaseModel = require("src/components/component-base.model");
import { ConfigControlType } from "src/services/connectorEnums"
import Moment = moment.Moment;


import Api = require("src/services/api");

declare var uuid;

interface IWfLogbookParams extends IComponentBaseParams, IStandaloneParameters {
    headerVisibility: boolean;
    buttonBarCssClass: string;
    panelBarCssClass: string;
    configurationButtonIconClass: string;
    settingsButtonVisibility: boolean;
    configurationButtonVisibility: boolean;
    initialConfiguration: string;
    configurationNamespace: string;
    titleText: string;
    defaultEntryTopic: string;
    defaultEntrySubject: string;

    defaultItemClass: string
    selectedTopic: string;
    startOffset: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
    startOffsetIntervall: number;
    height: number;
    getLatestLogdata: boolean;
    updateRate: number;
    maxResults: number;
}

interface ccwLogbookEntryDTO extends LogbookEntryDTO {
    isJSON: boolean;
    BodyJson: any;

}

class ccwLogbookSource {
    protected isPollingEnabled = false;
    public logsEntries: KnockoutObservableArray<ccwLogbookEntryDTO> = ko.observableArray<ccwLogbookEntryDTO>([]);
    protected filterDto: LogbookEntryQueryDTO;
    constructor(public filter: LogbookFilter, public updateRate: number) {
        this.filterDto = filter.toDto();
        this.updateRate = updateRate;
    }

    public startPolling() {
        if (this.isPollingEnabled) {
            return;
        }
        this.filterDto = this.filter.toDto();
        this.isPollingEnabled = true;
        this.pollData(true);
    }

    public stopPolling() {
        this.isPollingEnabled = false;
    }

    public pollData(immediate = true): any {
        if (!this.isPollingEnabled) {
            return;
        }

        var timeOut = immediate ? 0 : this.updateRate;
        _.delay(() => this.getLogbookEntries(), timeOut);
    }

    protected getLogbookEntries() {
        Api.logbookService.getLogbookEntries(this.filterDto)
            .then((logsEntries: any) => {
                //this.logsEntries(logsEntries);
                this.pollData(false);
                var l = logsEntries;//this.logsEntries();
                for(var i=0;i<l.length;i++){
                    try {
                        l[i].BodyJson = JSON.parse(l[i].Body);
                        l[i].isJSON = true;

                    } catch (e) {
                        l[i].BodyJson = null;
                        l[i].isJSON = false;
                    }
                }
                this.logsEntries(l);
            });
    }

    public getEntries() {
        Api.logbookService.getLogbookEntries(this.filterDto)
            .then((logsEntries: any) => {
                this.logsEntries(logsEntries);
                console.log("getEntries()");
                
            });
    }

    public getFilterDto() {
        var filter = this.filter;
        return filter.toDto();
    }

}

class WfLogbookComponent extends ComponentBaseModel<IWfLogbookParams> {
    private source: LogbookSource;
    private filter: LogbookFilter;
    private settingsButtonBarCssClass: KnockoutComputed<string>;
    private sendButtonEnabled: KnockoutComputed<boolean>;
    private newTopicName: KnockoutObservable<string>;
    private topicsForNewEntry: KnockoutObservableArray<string>;
    private isNewAdding: KnockoutObservable<boolean>;
    private logsEntries: KnockoutObservableArray<LogbookEntryDTO>;
    private topics: KnockoutObservableArray<string>;
    private getLatestLogdata: KnockoutObservable<boolean>;
    private endDate: KnockoutObservable<Moment>;
    private startDate: KnockoutObservable<Moment>;
    private startOffsetIntervall: number;
    private startOffset: string;
    private panelBodyHeight: KnockoutComputed<number | boolean>;
    private loggedInUserName: KnockoutComputed<string>;
    private maxResults: KnockoutObservable<number>;
    private updateRate: number;
    private defaultEntrySubject: string;
    private defaultEntryTopic: string;
    private titleText: string;
    private defaultItemClass: string;
    private controlType: ConfigControlType;
    private configurationNamespace: string;
    private initialConfiguration: string;
    private configurationButtonVisibility: KnockoutObservable<boolean>;
    private settingsButtonVisibility: KnockoutObservable<boolean>;
    private warningCssClass: string;
    private configurationButtonIconClass: string;
    private panelBarCssClass: string;
    private buttonBarCssClass: string;
    private headerVisibility: KnockoutObservable<boolean>;
    private height: KnockoutObservable<number | boolean>;
    private filtersChanged: KnockoutObservable<boolean>;
    private selectedTopic: KnockoutObservable<string>;
    private entryBody: KnockoutObservable<string>;
    private entryTopic: KnockoutObservable<string>;
    private entrySubject: KnockoutObservable<string>;
    private showSendDialog: KnockoutObservable<boolean>;
    private showSettingsDialog: KnockoutObservable<boolean>;
    private standaloneParametersReplacementService: StandaloneParametersReplacementService;
    private logEntriesBody: KnockoutObservable<Object>;
    private ccwLogsEntries: KnockoutObservableArray<ccwLogbookEntryDTO>;
    private logsEntries2: KnockoutComputed<any>;
    private source2: ccwLogbookSource;

    constructor(params: IWfLogbookParams) {
        super(params);

        this.initializeComputeds();

        this.getCurrentLoggedInUser();
        this.setFilter();
        this.getTopics();
        this.setEntries();
        this.loadInitialConfiguration();
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.standaloneParametersReplacementService = new StandaloneParametersReplacementService(this.settings);

        this.showSettingsDialog = ko.observable(false);
        this.showSendDialog = ko.observable(false);

        this.logsEntries = ko.observableArray<LogbookEntryDTO>([]);
        this.ccwLogsEntries = ko.observableArray<ccwLogbookEntryDTO>([]);
        this.topics = ko.observableArray<string>([]);
        this.entrySubject = ko.observable<string>();
        this.entryTopic = ko.observable<string>();
        this.entryBody = ko.observable<string>();
        this.filtersChanged = ko.observable(false);
        this.warningCssClass = "btn btn-warning";
        this.controlType = ConfigControlType.Logbook;
        this.filter = new LogbookFilter();
        this.isNewAdding = ko.observable(false);
        this.topicsForNewEntry = ko.observableArray<string>();
        this.newTopicName = ko.observable<string>();

        this.selectedTopic = ko.observable((this.settings.selectedTopic || '').stringPlaceholderResolver(this.objectID));
        this.height = ko.observable(ko.unwrap(this.settings.height) !== undefined ? ko.unwrap(this.settings.height) : false);

        this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
        this.panelBarCssClass = ko.unwrap(this.settings.panelBarCssClass) || "panel panel-default";
        this.configurationButtonIconClass = ko.unwrap(this.settings.configurationButtonIconClass);

        this.headerVisibility = ko.observable(ko.unwrap(this.settings.headerVisibility) !== undefined ? ko.unwrap(this.settings.headerVisibility) : true);

        this.settingsButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsButtonVisibility) : true);
        this.configurationButtonVisibility = ko.observable(ko.unwrap(this.settings.configurationButtonVisibility) !== undefined ? ko.unwrap(this.settings.configurationButtonVisibility) : true);

        this.initialConfiguration = (ko.unwrap(this.settings.initialConfiguration) || "").stringPlaceholderResolver(this.objectID);
        this.configurationNamespace = (ko.unwrap(this.settings.configurationNamespace) || "").stringPlaceholderResolver(this.objectID);

        this.defaultItemClass = ko.unwrap(this.settings.defaultItemClass) || "wf-callout-box wf-callout-box-info";
        this.titleText = (ko.unwrap(this.settings.titleText) || "Liste Logdaten").stringPlaceholderResolver(this.objectID);
        this.defaultEntryTopic = (ko.unwrap(this.settings.defaultEntryTopic) || this.connector.translate("I4SCADA_Info")() || "").stringPlaceholderResolver(this.objectID);
        this.defaultEntrySubject = (ko.unwrap(this.settings.defaultEntrySubject) || "").stringPlaceholderResolver(this.objectID);

        this.updateRate = ko.unwrap(this.settings.updateRate) || 5000;
        this.maxResults = ko.observable(this.settings.maxResults || 5);

        this.startOffset = ko.unwrap(this.settings.startOffset) ? ko.unwrap(this.settings.startOffset) : "hour"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
        this.startOffsetIntervall = ko.unwrap(this.settings.startOffsetIntervall) ? ko.unwrap(this.settings.startOffsetIntervall) : 24;
        this.startDate = ko.observable(moment().subtract(this.startOffset, this.startOffsetIntervall));
        this.endDate = ko.observable(moment());

        this.getLatestLogdata = ko.observable(this.settings.getLatestLogdata !== undefined ? this.settings.getLatestLogdata : true);

        this.logEntriesBody = ko.observable<Object>();
    }

    protected initializeComputeds() {
        this.panelBodyHeight = ko.pureComputed(() => {
            if (!this.height()) {
                return null;
            }

            if (this.headerVisibility()) {
                if (this.height())
                    return (this.height() as number - 45);
            }
            return this.height();
        });

        this.maxResults.subscribe(() => {
            this.filtersChanged(true);
        });

        this.startDate.subscribe(() => {
            this.filtersChanged(true);
        });

        this.endDate.subscribe(() => {
            this.filtersChanged(true);
        });

        this.topics.subscribe((newValues) => {
            this.topicsForNewEntry(this.addDefaultTopics(newValues));
        });
        this.sendButtonEnabled = ko.pureComputed(() => {
            return this.entryBody() && !this.isNewAdding();
        });

        this.settingsButtonBarCssClass = ko.computed(() => {
            return this.filtersChanged() ? this.warningCssClass : this.buttonBarCssClass;
        });



    }

    private async getCurrentLoggedInUser() {
        this.loggedInUserName = this.connector.currentLoggedInUser;
        try {
            await this.connector.getCurrentLoggedInUser()
        } catch (error) {
            this.connector.handleError(WfLogbookComponent)(error);
        }
    }

    private async getTopics() {
        const topics = await this.connector.getLogbookTopics();
        this.topics(topics);
        this.selectedTopic(this.selectedTopic());
    }

    private async addLogBookEntry() {
        var entry = {
            Body: this.entryBody(),
            Subject: this.entrySubject() || this.defaultEntrySubject,
            Format: 0,
            CreatedOn: moment().utc().toMSDate(),
            ID: uuid.v4(),
            Author: this.loggedInUserName(),
            Topic: this.entryTopic()
        };
        this.closeSend();

        try {
            const item = this.connector.addLogbookEntry(entry);
            this.entryBody(null);
            this.entrySubject(null);
            this.entryTopic(null);
            this.source2.getEntries();

            if (_.indexOf(this.topics(), this.entryTopic()) === -1)
                this.topics.push(this.entryTopic());
        } catch (error) {
            this.connector.handleError(WfLogbookComponent)(error);
        }

    }

    private setEntries() {
        //this.source = this.connector.getLogbookEntries(this.filter);
        //this.logsEntries = this.source.logsEntries;

        this.source2 = new ccwLogbookSource(this.filter, 5000);
        this.logsEntries = this.source2.logsEntries;
        this.source2.updateRate = this.updateRate;
    }

    private setFilter() {
        this.filter.from(moment(this.startDate()));
        this.getLatestLogdata() ? this.filter.to(null) : this.filter.to(moment(this.endDate()));
        this.filter.topN(this.maxResults());
        this.filter.format(0);
        this.filter.topic(this.selectedTopic());
        this.filtersChanged(false);
    }

    private applyFilterSettings() {
        this.closeSettings();
        this.source2.stopPolling();
        this.setFilter();
        this.source2.startPolling();
        this.filtersChanged(false);
        if (!this.getLatestLogdata()) {
            this.source2.stopPolling();
        }
    }

    private topicsFiltersChanged(obj, event) {
        if (event.originalEvent) { //Triggered by user changing selection?
            this.filtersChanged(true);
        }
    }

    private showSettings() {
        this.showSettingsDialog(true);
    }

    private closeSettings() {
        this.showSettingsDialog(false);
    }

    private showSend() {
        this.showSendDialog(true);
        this.setDefaultTopic();
    }

    private closeSend() {
        this.showSendDialog(false);
        this.isNewAdding(false);
        this.newTopicName(null);
        this.entryBody(null);
        this.entrySubject(null);
    }

    private getCssClassForTopic(topic: string) {
        let text = "";

        switch (topic) {
            case this.connector.translate("I4SCADA_Danger")():
                text = "Danger";
                break;
            case this.connector.translate("I4SCADA_Warning")():
                text = "Warning";
                break;
            case this.connector.translate("I4SCADA_Info")():
                text = "Info";
                break;
            case this.connector.translate("I4SCADA_Error")():
                text = "Error";
                break;
            case this.connector.translate("I4SCADA_Critical")():
                text = "Critical";
                break;
            case this.connector.translate("I4SCADA_Maintenance")():
                text = "Maintenance";
                break;
            case this.connector.translate("I4SCADA_Success")():
                text = "Success";
                break;
            default:
                text = topic;
        }
        return text ? text.toLowerCase().replace(/ /g, '').replace(/[^a-zA-Z]/g, '') : '';
    }

    private getConfig() {
        var content = {
            getLatestLogdata: this.getLatestLogdata(),
            maxResults: this.maxResults(),
            topic: this.selectedTopic(),
            startDate: moment(this.startDate()).toMSDate(),
            endDate: moment(this.endDate()).toMSDate(),
        }

        return content;
    }

    private loadConfig(content) {

        this.startDate(moment(content.startDate));
        this.endDate(moment(content.endDate));
        this.getLatestLogdata(content.getLatestLogdata);
        this.maxResults(content.maxResults);
        this.selectedTopic(content.topic);

        this.applyFilterSettings();
    }

    private async loadInitialConfiguration() {
        try {
            const config = await this.connector.getControlConfigurationsByName(this.initialConfiguration, this.configurationNamespace, this.controlType)
            if (config) {
                let configuration = this.standaloneParametersReplacementService.replaceConfigurationParameters(config.Content);
                this.loadConfig(JSON.parse(configuration));
            }
            else {
                this.source2.startPolling();
            }
        }
        catch (error) {
            this.connector.handleError(WfLogbookComponent)(error);
        }

    }

    private handleAddNewTopic() {
        this.isNewAdding(true);
    }

    private breakNewTopic() {

        this.isNewAdding(false);
        this.setDefaultTopic();
    }

    private addNewTopic() {
        var newTopic = this.newTopicName();
        this.newTopicName(null);
        this.isNewAdding(false);

        if (!newTopic) return;

        if (_.indexOf(this.topicsForNewEntry(), newTopic) === -1)
            this.topicsForNewEntry.push(newTopic);

        this.entryTopic(newTopic);
    }

    private addDefaultTopics(topics) {
        var defaultValues = [
            this.connector.translate("I4SCADA_Danger")(),
            this.connector.translate("I4SCADA_Warning")(),
            this.connector.translate("I4SCADA_Info")(),
            this.connector.translate("I4SCADA_Error")(),
            this.connector.translate("I4SCADA_Critical")(),
            this.connector.translate("I4SCADA_Maintenance")(),
            this.connector.translate("I4SCADA_Success")(),
        ];

        if (this.defaultEntryTopic)
            defaultValues.push(this.defaultEntryTopic);

        Array.prototype.push.apply(defaultValues, topics);
        var uniqueValues = _.uniq(defaultValues);

        return uniqueValues;
    }

    private setDefaultTopic() {
        this.defaultEntryTopic ? this.entryTopic(this.defaultEntryTopic) : this.entryTopic(this.topicsForNewEntry()[0]);
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

export = WfLogbookComponent;
