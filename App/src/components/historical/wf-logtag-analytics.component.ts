import Connector = require("../../services/connector");
import LogValuesFilter = require("../../services/models/logValuesFilter");
import Signal = require("../../services/models/signal");
import StandaloneParametersReplacementService = require("../services/standalone-parameters-replacement.service");

import BusyIndicator = require("../../decorators/busyIndicator");
import ComponentBaseModel = require("../component-base.model");

import { ConfigControlType } from "../../services/connectorEnums"

import Moment = moment.Moment;
declare var numeral;

interface IWfLogTagAnalyticsParams extends IComponentBaseParams, IConfigurationParams, IStandaloneParameters {
    title: string;
    buttonBarCssClass: string;
    panelBarCssClass: string;
    datasetItemCssClass: string;
    datasetItemHeaderCssClass: string;
    settingsButtonVisibility: boolean;
    headerVisibility: boolean;
    showHeaderForDataset: boolean;
    format: string;
    dateTimeFormat: string;
    showMaxValue: boolean;
    showMaxDate: boolean;
    showMaxLabel: boolean;
    maxLabelText: string;
    maxIconClass: string;
    showMinValue: boolean;
    showMinDate: boolean;
    showMinLabel: boolean;
    minLabelText: string;
    minIconClass: string;
    showAvg: boolean;
    showAvgDate: boolean;
    showAvgLabel: boolean;
    avgIconClass: string;
    avgLabelText: string;
    autoUpdate: boolean;
    updateRate: number;
    startOffset: "days" | "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
    startOffsetIntervall: number;
    endOffset: "minutes" | "seconds" | "days" | "weeks" | "months" | "years";
    endOffsetIntervall: number;
    logTags: any[];
    showException: boolean;
    showExceptionLabel: boolean;
    exceptionLabel: string;
    showPanelHeader: boolean;
    showOnlyOwnConfigurations: boolean;
    getLatestLogdata: boolean;
    showUnitLabel: boolean;
}

interface ITableLogTag {
    signalName: string;
    logTagName: string;
    Id?: KnockoutObservable<string>;
    unit?: KnockoutObservable<string>;
}

class WfLogTagAnalyticsComponent extends ComponentBaseModel<IWfLogTagAnalyticsParams> {
    private showOnlyOwnConfigurations: boolean;
    private showPanelHeader: boolean;
    private exceptionLabel: string;
    private showExceptionLabel: boolean;
    private showException: boolean;
    private showMainPanel: KnockoutComputed<string | true>;
    private logTags: ITableLogTag[];
    private hasData: KnockoutComputed<boolean>;
    private isSignalLoading: KnockoutObservable<boolean>;
    private isLoading: KnockoutObservable<boolean>;
    private toDateInput: KnockoutObservable<Moment>;
    private fromDateInput: KnockoutObservable<Moment>;
    private toDate: KnockoutObservable<Moment>;
    private fromDate: KnockoutObservable<Moment>;
    private startOffsetIntervall: number;
    private startOffset: string;
    private avgIconClass: string;
    private avgLabelText: string;
    private showAvgLabel: boolean;
    private showAvg: boolean;
    private minIconClass: string;
    private minLabelText: string;
    private showMinLabel: boolean;
    private showMinDate: boolean;
    private showMinValue: boolean;
    private maxIconClass: string;
    private maxLabelText: string;
    private showMaxLabel: boolean;
    private showMaxDate: boolean;
    private showMaxValue: boolean;
    private viewModel: KnockoutObservableArray<any>;
    private selectedLogTags: KnockoutObservableArray<ITableLogTag>;
    private dateTimeFormat: string;
    private format: string;
    private showHeaderForDataset: boolean;
    private datasetItemCssClass: string;
    private datasetItemHeaderCssClass: string;
    private controlType: ConfigControlType;
    private configurationNamespace: string;
    private initialConfiguration: string;
    private headerVisibility: boolean;
    private configurationButtonVisibility: boolean;
    private settingsButtonVisibility: boolean;
    private panelBarCssClass: string;
    private configurationButtonIconClass: string;
    private buttonBarCssClass: string;
    private title: string;
    private signalDefenitions: SignalDefinitionDTO[];
    private showDialog: KnockoutObservable<boolean>;
    private endOffsetIntervall: number;
    private endOffset: string;
    private updateRate: number;
    private autoUpdate: KnockoutObservable<boolean>;
    private pollTimer: number;
    private isRealTimeUpdating: KnockoutComputed<boolean>;
    private isAutoUpdating: KnockoutObservable<boolean>;
    private getLatestLogdata: boolean;
    private timeRangeDateInput: KnockoutObservable<Moment>;
    private selectedRangeInput: KnockoutObservable<CalendarTimeRanges>;
    private selectedRange: KnockoutObservable<CalendarTimeRanges>;
    private standaloneParametersReplacementService: StandaloneParametersReplacementService;
    private showUnitLabel: boolean;

    constructor(params: IWfLogTagAnalyticsParams) {
        super(params)
        this.loadInitialConfiguration();
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.standaloneParametersReplacementService = new StandaloneParametersReplacementService(this.settings);

        this.showOnlyOwnConfigurations = this.settings.showOnlyOwnConfigurations !== undefined ? this.settings.showOnlyOwnConfigurations : false;

        this.showDialog = ko.observable(false);

        this.selectedLogTags = ko.observableArray<ITableLogTag>([]);
        this.signalDefenitions = [];
        this.viewModel = ko.observableArray<any>();

        this.title = (ko.unwrap(this.settings.title) ? ko.unwrap(this.settings.title) : "").stringPlaceholderResolver(this.objectID);

        this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
        this.configurationButtonIconClass = ko.unwrap(this.settings.configurationButtonIconClass);
        this.panelBarCssClass = ko.unwrap(this.settings.panelBarCssClass) !== undefined ? ko.unwrap(this.settings.panelBarCssClass) : "panel panel-default";
        this.datasetItemCssClass = ko.unwrap(this.settings.datasetItemCssClass) || "panel panel-primary";
        this.datasetItemHeaderCssClass = ko.unwrap(this.settings.datasetItemHeaderCssClass) || "panel-heading";

        this.settingsButtonVisibility = ko.unwrap(this.settings.settingsButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsButtonVisibility) : true;
        this.configurationButtonVisibility = ko.unwrap(this.settings.configurationButtonVisibility) !== undefined ? ko.unwrap(this.settings.configurationButtonVisibility) : true;
        this.headerVisibility = ko.unwrap(this.settings.headerVisibility) !== undefined ? ko.unwrap(this.settings.headerVisibility) : true;

        this.initialConfiguration = (ko.unwrap(this.settings.initialConfiguration) || "").stringPlaceholderResolver(this.objectID);
        this.configurationNamespace = (ko.unwrap(this.settings.configurationNamespace) || "").stringPlaceholderResolver(this.objectID);
        this.controlType = ConfigControlType.LogStatistics;

        this.showHeaderForDataset = ko.unwrap(this.settings.showHeaderForDataset) !== undefined ? ko.unwrap(this.settings.showHeaderForDataset) : true;

        //#region Settings of formats
        this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[00]";
        this.dateTimeFormat = ko.unwrap(this.settings.dateTimeFormat) ? ko.unwrap(this.settings.dateTimeFormat) : "DD.MM.YYYY HH:mm:ss.SSS";
        //endergion                

        // #region Settings of Maximum
        this.maxIconClass = ko.unwrap(this.settings.maxIconClass) || "wf wf-max";
        this.showMaxValue = ko.unwrap(this.settings.showMaxValue) !== undefined ? ko.unwrap(this.settings.showMaxValue) : true;
        this.showMaxDate = ko.unwrap(this.settings.showMaxDate) !== undefined ? ko.unwrap(this.settings.showMaxDate) : true;
        this.showMaxLabel = ko.unwrap(this.settings.showMaxLabel) !== undefined ? ko.unwrap(this.settings.showMaxLabel) : true;
        this.maxLabelText = ko.unwrap(this.settings.maxLabelText) ? ko.unwrap(this.settings.maxLabelText) : "Maximum";
        //#endregion

        // #region Settings of Minimum
        this.minIconClass = ko.unwrap(this.settings.minIconClass) || "wf wf-min";
        this.showMinValue = ko.unwrap(this.settings.showMinValue) !== undefined ? ko.unwrap(this.settings.showMinValue) : true;
        this.showMinDate = ko.unwrap(this.settings.showMinDate) !== undefined ? ko.unwrap(this.settings.showMinDate) : true;
        this.showMinLabel = ko.unwrap(this.settings.showMinLabel) !== undefined ? ko.unwrap(this.settings.showMinLabel) : true;
        this.minLabelText = ko.unwrap(this.settings.minLabelText) ? ko.unwrap(this.settings.minLabelText) : "Minimum";
        //#endregion

        // #region Settings of Avg
        this.avgIconClass = ko.unwrap(this.settings.avgIconClass) || "wf wf-average";
        this.showAvg = ko.unwrap(this.settings.showAvg) !== undefined ? ko.unwrap(this.settings.showAvg) : true;
        this.showAvgLabel = ko.unwrap(this.settings.showAvgLabel) !== undefined ? ko.unwrap(this.settings.showAvgLabel) : true;
        this.avgLabelText = ko.unwrap(this.settings.avgLabelText) ? ko.unwrap(this.settings.avgLabelText) : "Average";
        //#endregion

        this.pollTimer = null;
        this.isAutoUpdating = ko.observable(false);
        this.autoUpdate = ko.observable(ko.unwrap(this.settings.autoUpdate) ? ko.unwrap(this.settings.autoUpdate) : false);
        this.updateRate = Math.max(ko.unwrap(this.settings.updateRate) ? ko.unwrap(this.settings.updateRate) : 2000, 100);

        this.isRealTimeUpdating = ko.pureComputed(() => {
            return this.autoUpdate() && !this.isAutoUpdating();
        }, this);

        this.getLatestLogdata = (this.settings.getLatestLogdata != undefined) ? ko.unwrap(this.settings.getLatestLogdata) : true;

        this.endOffset = ko.unwrap(this.settings.endOffset) ? ko.unwrap(this.settings.endOffset).trim().toLowerCase() : "minutes"; //"seconds", "minutes", "days", "weeks", "months", "years"
        this.endOffsetIntervall = ko.unwrap(this.settings.endOffsetIntervall) ? ko.unwrap(this.settings.endOffsetIntervall) : 0;

        this.startOffset = ko.unwrap(this.settings.startOffset) ? ko.unwrap(this.settings.startOffset).trim().toLowerCase() : "days"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
        this.startOffsetIntervall = ko.unwrap(this.settings.startOffsetIntervall) ? ko.unwrap(this.settings.startOffsetIntervall) : 1;

        this.fromDate = ko.observable(moment().startOf('minute').subtract(this.startOffsetIntervall, this.startOffset));
        this.toDate = ko.observable(moment());
        this.fromDateInput = ko.observable(this.fromDate());
        this.toDateInput = ko.observable(this.toDate());

        this.selectedRange = ko.observable(CalendarTimeRanges.Custom);
        this.selectedRangeInput = ko.observable(this.selectedRange());
        this.timeRangeDateInput = ko.observable<Moment>();

        this.isLoading = ko.observable(false);

        this.showUnitLabel = ko.unwrap(this.settings.showUnitLabel) != undefined ? ko.unwrap(this.settings.showUnitLabel) : true

        //#endregion

        this.showException = ko.unwrap(this.settings.showException) !== undefined ? ko.unwrap(this.settings.showException) : false;
        this.showExceptionLabel = ko.unwrap(this.settings.showExceptionLabel) !== undefined ? ko.unwrap(this.settings.showExceptionLabel) : false;
        this.showPanelHeader = ko.unwrap(this.settings.showPanelHeader) !== undefined ? ko.unwrap(this.settings.showPanelHeader) : false;
        this.exceptionLabel = ko.unwrap(this.settings.exceptionLabel) !== undefined ? ko.unwrap(this.settings.exceptionLabel) : null;

        this.isSignalLoading = ko.observable(false);

        this.hasData = ko.pureComputed(() => {
            return this.viewModel().length > 0;
        });

        this.logTags = this.settings.logTags && this.settings.logTags.length > 0 ? _.filter(this.settings.logTags, (e) => {
            return e.signalName && e.logTagName;
        }) : [];

        this.showMainPanel = ko.pureComputed(() => {
            return this.settingsButtonVisibility || this.configurationButtonVisibility || this.title;
        });

    }
    private getConfig() {
        var content = {
            logTags: this.logTags,
            fromDate: moment(this.fromDate()).toMSDate(),
            toDate: moment(this.toDate()).toMSDate(),
            autoUpdate: this.autoUpdate()
        }
        return content;
    }

    private loadConfig(content) {
        this.logTags = content.logTags;
        this.fromDate(moment(content.fromDate));
        this.toDate(moment(content.toDate));

        if (content.autoUpdate !== undefined) {
            this.autoUpdate(content.autoUpdate);
        }

        if (this.autoUpdate()) {
            if (this.logTags.length == 0) {
                this.isAutoUpdating(true);
            }
            else {
                this.isAutoUpdating(false);
            }
        }

        this.getSignalDefinitions();
    }


    private async triggerRefreshChartData() {
        // If getLatestLogdata property is set, then the endtimestamp will be set to "now"
        if (ko.unwrap(this.getLatestLogdata) === true) {
            this.fromDate(moment().subtract(this.startOffsetIntervall, this.startOffset));
            this.fromDateInput(this.fromDate());
            this.selectedRangeInput(CalendarTimeRanges.Custom);
            this.timeRangeDateInput(this.fromDate());
            this.toDate(moment().add(this.endOffsetIntervall, this.endOffset));
            this.toDateInput(this.toDate());
        }
        this.refreshData();
    }

    private toggleIsAutoUpdating() {
        this.isAutoUpdating(!this.isAutoUpdating());
        this.handleAutoUpdate();
    }

    private async refreshData() {
        await this.getData();
        this.handleAutoUpdate();
    }

    private handleAutoUpdate() {

        if (this.autoUpdate() && !this.isAutoUpdating()) {
            this.fromDate(moment().subtract(this.startOffsetIntervall, this.startOffset));
            this.toDate(moment().add(this.endOffsetIntervall, this.endOffset));

            if (this.pollTimer) {
                clearTimeout(this.pollTimer);
            }

            this.pollTimer = window.setTimeout(() => {
                this.refreshData();
            }, this.updateRate);
        }
    }

    private async getData() {
        this.isLoading(true);
        this.viewModel.removeAll();

        var filter = {} as LogStatisticsFilterDTO;

        filter.StartDate = moment(this.fromDate()).toMSDateTimeOffset();
        filter.EndDate = moment(this.toDate()).toMSDateTimeOffset();

        var logIDs = [];
        var logInfo = [];

        if (_.any(this.signalDefenitions)) {
            for (var i = 0; i < this.logTags.length; i++) {
                var signalName = this.logTags[i].signalName;
                var definition = _.find(this.signalDefenitions, (definition) => {
                    return definition.AliasName === signalName;
                });
                var logs = definition.Logs;
                var selectedLog = _.filter(logs, (item: any) => { return item.LogTag === this.logTags[i].logTagName });

                if (selectedLog.length === 1) {
                    logIDs.push(selectedLog[0].ID);
                    logInfo[selectedLog[0].ID] = { signalName: signalName, logTagName: selectedLog[0].LogTag, unit: definition.Unit };
                }
            }
            filter.LogIDs = logIDs;
        }

        try {
            const dtosFromServer = await this.connector.getLogStatistics(filter)
            var viewModels = _.map(dtosFromServer as any, (dto: any) => {
                var info = logInfo[dto.LogID];

                return {
                    maxPanelIsVisible: dto && this.showMaxValue,
                    showMaxLabel: this.showMaxLabel,
                    maxLabelText: this.maxLabelText ? this.maxLabelText : '',
                    showMaxValue: this.showMaxValue,
                    maxValue: this.getDisplayValue(this.showMaxValue, dto.Maximum),
                    showMaxDate: this.showMaxDate,
                    maxDate: this.getDisplayDate(this.showMaxDate, dto.Maximum),

                    minPanelIsVisible: dto && this.showMinValue,
                    showMinLabel: this.showMinLabel,
                    minLabelText: this.minLabelText ? this.minLabelText : '',
                    showMinValue: this.showMinValue,
                    minValue: this.getDisplayValue(this.showMinValue, dto.Minimum),
                    showMinDate: this.showMinDate,
                    minDate: this.getDisplayDate(this.showMinDate, dto.Minimum),

                    avgPanelIsVisible: dto && this.showAvg,
                    showAvgLabel: this.showAvgLabel,
                    avgLabelText: this.avgLabelText ? this.avgLabelText : '',
                    avgValue: this.getDisplayValue(this.showAvg, dto.Average),

                    exceptionPanelIsVisible: !dto && this.showException,
                    showExceptionLabel: this.showExceptionLabel,
                    exceptionLabel: this.exceptionLabel + ': ',
                    //exception: dto.Exception,

                    caption: info.signalName + ' - ' + info.logTagName,
                    showPanelHeader: this.showPanelHeader,
                    unit: info.unit
                };
            });
            this.viewModel(viewModels);
        } catch (error) {
            this.connector.handleError(WfLogTagAnalyticsComponent)(error);
        } finally {
            this.isLoading(false);
        }
    }

    private closeSettings() {
        this.showDialog(false);
    }

    private applySettings() {

        this.showDialog(false);
        this.selectedRange(this.selectedRangeInput());

        this.logTags = [];
        if (this.selectedLogTags().length > 0) {
            for (var i = 0; i < this.selectedLogTags().length; i++) {
                if (ko.unwrap(this.selectedLogTags()[i].signalName) && ko.unwrap(this.selectedLogTags()[i].logTagName)) {
                    this.logTags.push({
                        signalName: ko.unwrap(this.selectedLogTags()[i].signalName),
                        logTagName: ko.unwrap(this.selectedLogTags()[i].logTagName)
                    });
                }
            }
        }

        this.fromDate(this.fromDateInput());
        this.toDate(this.toDateInput());

        if (this.logTags.length > 0)
            this.getSignalDefinitions();
        else
            this.viewModel([]);
    }

    private handleShowSettings() {
        this.showDialog(true);

        this.fromDateInput(this.fromDate());
        this.toDateInput(this.toDate());

        this.timeRangeDateInput(this.fromDate());
        this.selectedRangeInput(this.selectedRange());

        var tmp = [];
        this.logTags.forEach((current, index, array) => {
            tmp.push({
                signalName: ko.observable(current.signalName),
                logTagName: ko.observable(current.logTagName)
            });
        });

        this.selectedLogTags(tmp);
    }

    private async getSignalDefinitions() {
        const aliasNames = _.map(this.logTags, (item) => { return item.signalName });
        try {
            const definitions = await this.connector.getSignalDefinitions(aliasNames);

            this.signalDefenitions = <SignalDefinitionDTO[]>definitions;

            this.refreshData();
        } catch (error) {
            this.connector.handleError(WfLogTagAnalyticsComponent)(error)
        }
    }

    private getDisplayValue(shouldShow, logValue) {

        if (!shouldShow || !logValue || !logValue.Value)
            return "N/A";

        var value = logValue.Value.EditedValue ? logValue.Value.EditedValue : logValue.Value.Value;

        return numeral(value).format(this.format);
    }

    private getDisplayDate(shouldShow, logValue) {

        if (!shouldShow || !logValue || !logValue.Date)
            return "N/A";

        return moment.utc(logValue.Date).local().format(this.dateTimeFormat);
    }

    private async loadInitialConfiguration() {

        try {
            const config = await this.connector.getControlConfigurationsByName(this.initialConfiguration, this.configurationNamespace, this.controlType);
            if (config) {
                let configuration = this.standaloneParametersReplacementService.replaceConfigurationParameters(config.Content);
                this.loadConfig(JSON.parse(configuration));
            }

            else if (this.settings.logTags) {
                return this.getSignalDefinitions();
            }
        } catch (error) {
            this.connector.handleError(WfLogTagAnalyticsComponent)(error);
        }

    }

    protected async dispose() {
        await super.dispose();
        //clear dialogs
        var signalSettingsDialog = $(document).find('#modal-signal-settings-' + ko.unwrap(this.id));
        var signalSettingsBackContainer = $(document).find('#modal-signal-settings-back-container-' + ko.unwrap(this.id));

        signalSettingsDialog.remove();
        signalSettingsBackContainer.remove();
    }
}

export = WfLogTagAnalyticsComponent;
