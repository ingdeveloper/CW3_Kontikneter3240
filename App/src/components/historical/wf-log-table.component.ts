import Connector = require("../../services/connector");
import LogValuesFilter = require("../../services/models/logValuesFilter");
import Signal = require("../../services/models/signal");
import SecuredService = require("../services/secured.service");
import ConvertCsvService = require("../services/convert-csv.service");
import StandaloneParametersReplacementService = require("../services/standalone-parameters-replacement.service");

import BusyIndicator = require("../../decorators/busyIndicator");
import ComponentBaseModel = require("../component-base.model");

import { ConfigControlType } from "../../services/connectorEnums"

import Moment = moment.Moment;

interface IWfLogTableParams extends IComponentBaseParams, IConfigurationParams, IConvertCsvParams, IStandaloneParameters {
    tableHeight: number;
    headerVisibility: boolean;
    footerVisibility: boolean;
    statisticsVisibility: boolean;
    signalsButtonVisibility: boolean;
    settingsButtonVisibility: boolean;
    exportButtonVisibility: boolean;
    buttonBarCssClass: string;
    panelBarCssClass: string;
    cssClass: string;
    format: string;
    maxResults: number;
    maxSignalCount: number;
    pagingControlEnabled: boolean;
    startOffset: string;
    startOffsetIntervall: number;
    getLatestLogdata: boolean;
    title: string;
    emptyColumnSymbol: string;
    logTags: ITableLogTagConfiguration[];

    configurationProjectAuthorization: string;
    signalSelectionProjectAuthorization: string;
    exportProjectAuthorization: string;

    showOnlyOwnConfigurations: boolean;

    columnTooltipIconVisibility: boolean;
    columnTitleTemplate: string;
    isAlphanumeric: boolean;
    showDateTimeTooltip: boolean;
    dateTimeTooltipFormat: string;

    dateTimeFormat: string;

    autoUpdate: boolean;
    updateRate: number;
}

interface ITableLogTagConfiguration {
    signalName: string;
    logTagName: string;
    isAlphanumeric: boolean;
}

interface ITableLogTag extends ITableLogTagConfiguration {
    columnTitle?: KnockoutObservable<string>;
}

interface ISortingData {
    index: number;
    asc: boolean;
}

class WfLogTableComponent extends ComponentBaseModel<IWfLogTableParams> {
    private showOnlyOwnConfigurations: boolean;
    private timeRangeDateInput: KnockoutObservable<Date>;
    private selectedRangeInput: KnockoutObservable<CalendarTimeRanges>;
    private selectedRange: KnockoutObservable<CalendarTimeRanges>;
    private convertCsvService: ConvertCsvService;
    private hasSignalSelectionAuthorization: KnockoutComputed<boolean>;
    private hasConfigurationAuthorization: KnockoutComputed<boolean>;
    private hasExportAuthorization: KnockoutComputed<boolean>;
    private signalSecuredService: SecuredService;
    private configurationSecuredService: SecuredService;
    private exportSecuredService: SecuredService;
    private signalSelectionProjectAuthorization: string;
    private exportProjectAuthorization: string;
    private configurationProjectAuthorization: string;
    private emptyValueSymbol: string;
    private title: string;
    private selectedLogTags: KnockoutObservableArray<ITableLogTag>;
    private isSignalLoading: KnockoutObservable<boolean>;
    private hasSelectedItems: KnockoutComputed<boolean>;
    private lastPage: () => void;
    private lastPageEnabled: KnockoutComputed<boolean>;
    private previousPage: () => void;
    private previousPageEnabled: KnockoutComputed<boolean>;
    private nextPage: () => void;
    private nextPageEnabled: KnockoutComputed<boolean>;
    private firstPage: () => void;
    private firstPageEnabled: KnockoutComputed<boolean>;
    private pagedItems: KnockoutComputed<any[]>;
    private totalPages: KnockoutComputed<number>;
    private currentPage: KnockoutObservable<number>;
    private _pagingDisabled: KnockoutComputed<boolean>;
    private values: KnockoutObservableArray<any>;
    private logTags: KnockoutObservableArray<ITableLogTag>;
    private signalDefinitions: SignalDefinitionDTO[];
    private sortOrder: KnockoutObservable<LogValuesSortOrder>;
    private getLatestLogdata: boolean;
    private maxResultsInput: KnockoutObservable<number>;
    private endDateInput: KnockoutObservable<Moment>;
    private startDateInput: KnockoutObservable<Moment>;
    private endDate: KnockoutObservable<Date>;
    private startDate: KnockoutObservable<Date>;
    private startOffsetIntervall: number;
    private startOffset: string;
    private itemsPerPage: KnockoutObservable<number>;
    private pagingControlEnabled: boolean;
    private maxResults: KnockoutObservable<number>;
    private maxSignalCount: KnockoutObservable<number>;
    private format: string;
    private configurationButtonIconClass: string;
    private cssClass: string;
    private panelBarCssClass: string;
    private buttonBarCssClass: string;
    private controlType: ConfigControlType;
    private configurationNamespace: string;
    private initialConfiguration: string;
    private configurationButtonVisibility: KnockoutObservable<boolean>;
    private exportButtonVisibility: KnockoutObservable<boolean>;
    private settingsButtonVisibility: KnockoutObservable<boolean>;
    private signalsButtonVisibility: KnockoutObservable<boolean>;
    private statisticsVisibility: KnockoutObservable<boolean>;
    private footerVisibility: KnockoutObservable<boolean>;
    private headerVisibility: KnockoutObservable<boolean>;
    private tableHeight: KnockoutObservable<number>;
    private languageId: number | KnockoutComputed<number>;
    private busyContext: BusyIndicator;
    private showSignalsDialog: KnockoutObservable<boolean>;
    private showDialog: KnockoutObservable<boolean>;
    private showEditDialog: KnockoutObservable<boolean>;
    private isDataLoading: KnockoutObservable<boolean>;
    private standaloneParametersReplacementService: StandaloneParametersReplacementService;

    private columnTooltipIconVisibility: boolean;
    private columnTitleTemplate: string;
    private isAlphanumeric: boolean;
    private showDateTimeTooltip: boolean;
    private dateTimeTooltipFormat: string;
    private dateTimeFormat: string;

    private pollTimer: number;
    private autoUpdate: KnockoutObservable<boolean>;
    private updateRate: number;
    private isAutoUpdating: KnockoutObservable<boolean>;

    constructor(params: IWfLogTableParams) {
        super(params);
        this.initializePaging();
        this.convertCsvService = new ConvertCsvService(this.settings);
        this.loadInitialConfiguration();
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.standaloneParametersReplacementService = new StandaloneParametersReplacementService(this.settings);

        //#region configuration project authorization
        this.configurationProjectAuthorization = (ko.unwrap(this.settings.configurationProjectAuthorization) || "").stringPlaceholderResolver(this.objectID);
        this.configurationSecuredService = new SecuredService(this.configurationProjectAuthorization);
        this.hasConfigurationAuthorization = this.configurationSecuredService.hasAuthorization;
        //#endregion

        //#region signal selection project authorization
        this.signalSelectionProjectAuthorization = (ko.unwrap(this.settings.signalSelectionProjectAuthorization) || "").stringPlaceholderResolver(this.objectID);
        this.signalSecuredService = new SecuredService(this.signalSelectionProjectAuthorization);
        this.hasSignalSelectionAuthorization = this.signalSecuredService.hasAuthorization;
        //#endregion

        //#region export project authorization
        this.exportProjectAuthorization = (ko.unwrap(this.settings.exportProjectAuthorization) || "").stringPlaceholderResolver(this.objectID);
        this.exportSecuredService = new SecuredService(this.exportProjectAuthorization);
        this.hasExportAuthorization = this.exportSecuredService.hasAuthorization;
        //#endregion

        this.isDataLoading = ko.observable(false);
        this.showDialog = ko.observable(false);
        this.showSignalsDialog = ko.observable(false);
        this.showEditDialog = ko.observable(false);
        this.busyContext = new BusyIndicator(this);
        this.languageId = this.connector.currentLanguageId || 9;

        this.showDateTimeTooltip = this.settings.showDateTimeTooltip || false;
        this.dateTimeFormat = this.settings.dateTimeFormat !== undefined ? this.settings.dateTimeFormat : "DD.MM.YYYY HH:mm:ss";
        this.dateTimeTooltipFormat = this.settings.dateTimeTooltipFormat !== undefined ? this.settings.dateTimeTooltipFormat : this.dateTimeFormat;
        this.showOnlyOwnConfigurations = this.settings.showOnlyOwnConfigurations !== undefined ? this.settings.showOnlyOwnConfigurations : false;
        this.tableHeight = ko.observable(ko.unwrap(this.settings.tableHeight) !== undefined ? ko.unwrap(this.settings.tableHeight) : 300);

        this.headerVisibility = ko.observable(ko.unwrap(this.settings.headerVisibility) !== undefined ? ko.unwrap(this.settings.headerVisibility) : true);
        this.footerVisibility = ko.observable(ko.unwrap(this.settings.footerVisibility) !== undefined ? ko.unwrap(this.settings.footerVisibility) : true);
        this.statisticsVisibility = ko.observable(ko.unwrap(this.settings.statisticsVisibility) !== undefined ? ko.unwrap(this.settings.statisticsVisibility) : true);

        this.signalsButtonVisibility = ko.observable(ko.unwrap(this.settings.signalsButtonVisibility) !== undefined ? ko.unwrap(this.settings.signalsButtonVisibility) : true);
        this.settingsButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsButtonVisibility) : true);
        this.configurationButtonVisibility = ko.observable(ko.unwrap(this.settings.configurationButtonVisibility) !== undefined ? ko.unwrap(this.settings.configurationButtonVisibility) : true);
        this.exportButtonVisibility = ko.observable(ko.unwrap(this.settings.exportButtonVisibility) !== undefined ? ko.unwrap(this.settings.exportButtonVisibility) : true);

        this.initialConfiguration = (ko.unwrap(this.settings.initialConfiguration) || "").stringPlaceholderResolver(this.objectID);
        this.configurationNamespace = (ko.unwrap(this.settings.configurationNamespace) || "").stringPlaceholderResolver(this.objectID);
        this.controlType = ConfigControlType.LogTagTable;

        this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
        this.panelBarCssClass = ko.unwrap(this.settings.panelBarCssClass) || "panel panel-default";
        this.cssClass = ko.unwrap(this.settings.cssClass) || "";
        this.configurationButtonIconClass = ko.unwrap(this.settings.configurationButtonIconClass);

        this.format = this.settings.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[00]";

        this.maxResults = ko.observable(ko.unwrap(this.settings.maxResults) ? ko.unwrap(this.settings.maxResults) : 100);
        this.maxSignalCount = ko.observable(ko.unwrap(this.settings.maxSignalCount) ? ko.unwrap(this.settings.maxSignalCount) : 50);

        this.pagingControlEnabled = ko.unwrap(this.settings.pagingControlEnabled) !== undefined ? ko.unwrap(this.settings.pagingControlEnabled) : true;
        this.itemsPerPage = ko.observable(20);

        this.pollTimer = null;
        this.isAutoUpdating = ko.observable(false);

        this.autoUpdate = ko.observable(ko.unwrap(this.settings.autoUpdate) ? ko.unwrap(this.settings.autoUpdate) : false);
        this.updateRate = Math.max(ko.unwrap(this.settings.updateRate) ? ko.unwrap(this.settings.updateRate) : 2000, 100);

        this.startOffset = ko.unwrap(this.settings.startOffset) ? ko.unwrap(this.settings.startOffset).trim().toLowerCase() : "minutes"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
        this.startOffsetIntervall = ko.unwrap(this.settings.startOffsetIntervall) ? ko.unwrap(this.settings.startOffsetIntervall) : 1;

        this.startDate = ko.observable(moment().subtract(this.startOffsetIntervall, this.startOffset).toDate());
        this.endDate = ko.observable(moment().toDate());

        this.startDateInput = ko.observable(moment(this.startDate()));
        this.endDateInput = ko.observable(moment(this.endDate()));
        this.maxResultsInput = ko.observable(this.maxResults());

        this.selectedRange = ko.observable(CalendarTimeRanges.Custom);
        this.selectedRangeInput = ko.observable(this.selectedRange());
        this.timeRangeDateInput = ko.observable<Date>();

        this.getLatestLogdata = ko.unwrap(this.settings.getLatestLogdata) !== undefined ? ko.unwrap(this.settings.getLatestLogdata) : true;
        this.sortOrder = ko.observable(LogValuesSortOrder.DateDescending);

        this.logTags = ko.observableArray<ITableLogTag>([]);
        this.signalDefinitions = [];
        this.values = ko.observableArray<any>();

        this.isSignalLoading = ko.observable(false);
        this.selectedLogTags = ko.observableArray<ITableLogTag>();

        this.title = (ko.unwrap(this.settings.title) ? ko.unwrap(this.settings.title) : "").stringPlaceholderResolver(this.objectID);
        this.emptyValueSymbol = ko.unwrap(this.settings.emptyColumnSymbol) ? ko.unwrap(this.settings.emptyColumnSymbol) : "-";

        this.columnTooltipIconVisibility = ko.unwrap(this.settings.columnTooltipIconVisibility) !== undefined ? ko.unwrap(this.settings.columnTooltipIconVisibility) : true;
        this.columnTitleTemplate = ko.unwrap(this.settings.columnTitleTemplate) !== undefined ? ko.unwrap(this.settings.columnTitleTemplate) : this.connector.translate('I4SCADA_Value')() + " [%Unit%]";
        this.isAlphanumeric = ko.unwrap(this.settings.isAlphanumeric) !== undefined ? ko.unwrap(this.settings.isAlphanumeric) : false;
    }

    private initializePaging() {
        // Pagination
        this._pagingDisabled = ko.computed(() => {
            if (this.pagingControlEnabled) {
                return false;
            }

            this.itemsPerPage(this.maxResults());
            return true;

        });

        this.currentPage = ko.observable(1);
        this.totalPages = ko.computed(() => {
            var total = this.values().length / this.itemsPerPage();
            return Math.ceil(total);
        });

        this.pagedItems = ko.computed(() => {
            var pg = this.currentPage(),
                start = this.itemsPerPage() * (pg - 1),
                end = start + this.itemsPerPage();
            return this.values().slice(start, end);
        });

        this.firstPage = () => {
            if (this.firstPageEnabled()) {
                this.currentPage(1);
            }
        };

        this.firstPageEnabled = ko.computed(() => {
            return this.currentPage() > 1;
        });

        this.nextPage = () => {
            if (this.nextPageEnabled()) {
                this.currentPage(this.currentPage() + 1);
            }
        };

        this.nextPageEnabled = ko.computed(() => {
            return this.values().length > this.itemsPerPage() * this.currentPage();
        });

        this.previousPage = () => {
            if (this.previousPageEnabled()) {
                this.currentPage(this.currentPage() - 1);
            }
        };

        this.previousPageEnabled = ko.computed(() => {
            return this.currentPage() > 1;
        });

        this.lastPage = () => {
            if (this.lastPageEnabled()) {
                this.currentPage(this.totalPages());
            }
        };

        this.lastPageEnabled = ko.computed(() => {
            return this.values().length > (this.itemsPerPage() * this.currentPage());
        });

        this.hasSelectedItems = ko.pureComputed(() => {
            if (this.logTags() && this.logTags().length > 0)
                return true;

            return false;
        });

    }

    private updateSignals() {
        var aliases = _.map(ko.unwrap(this.logTags), (item: ITableLogTag) => { return item.signalName });

        if (this.connector.disableSignalBrowser && !_.any(aliases)) return;

        this.busyContext.runLongAction("Getting Signal Definitions", async () => {
            try {
                const definitions = await this.connector.getSignalDefinitions(aliases);

                this.signalDefinitions = [];
                for (const definition of definitions) {
                    this.signalDefinitions[(definition as SignalDefinitionDTO).AliasName] = definition;
                }

                await this.handleUpdateLogs();
            } catch (error) {
                this.connector.handleError(WfLogTableComponent)(error);
            }
        });
    }

    private async updateLogs() {

        var logIds = [];

        this.isDataLoading(true);

        _.each(this.logTags(), (line) => {
            const definition: SignalDefinitionDTO = this.signalDefinitions[ko.unwrap(line.signalName)];
            if (!definition) return; //signal not exists in DB

            var logTag = _.findWhere(definition.Logs, { LogTag: line.logTagName });
            if (!logTag) return;

            logIds.push(logTag.ID);
            line.columnTitle(this.getColumnTitle(line.signalName, line.logTagName));
        });


        // If getLatestLogdata property is set, then the endtimestamp will be set to "now"
        if (ko.unwrap(this.getLatestLogdata) == true) {
            this.endDate(moment().toDate());
        }

        // logIds contains a flat array with the ID of each log for each signal
        var filter = new LogValuesFilter(logIds, moment(ko.unwrap(this.startDate)), moment(ko.unwrap(this.endDate)), ko.unwrap(this.maxResults), ko.unwrap(this.sortOrder));

        // gets the log values for all log ids from all logs from all signals
        this.busyContext.runLongAction("Getting Log Values", async () => {
            try {
                const result: any = await this.connector.getLogValues(filter);
                const logValues = result as DatedLogValuesDTO[];
                let values = [];

                const logTags = this.logTags();

                for (let row of logValues) {
                    var line = [];
                    line.push(row.EntriesDate);

                    _.each(row.Values, (logValue, index) => {
                        if (typeof (logValue) !== "undefined" && logValue !== null) {
                            const isAlphanumeric = ko.unwrap(logTags[index].isAlphanumeric);
                            const value = this.getDisplayLogValue(logValue, isAlphanumeric);
                            line.push(value);
                        }
                        else line.push(this.emptyValueSymbol);
                    });
                    values.push(line);
                }
                this.values(values);

                this.isDataLoading(false);
            } catch (error) {
                this.connector.handleError(WfLogTableComponent)(error);
            }
        });
    }

    private getDisplayLogValue(logValue: LogValueDTO, isAlphanumeric: boolean) {
        const value1 = logValue.EditedValue != null ? logValue.EditedValue : logValue.Value;
        const value2 = logValue.EditedValue2 != null ? logValue.EditedValue2 : logValue.Value2;
        const value = isAlphanumeric && value2 != null ? value2 : value1;
        const isEdited = isAlphanumeric ? logValue.EditedValue2 != null : logValue.EditedValue != null;
        const roundedValue = isAlphanumeric
            ? ko.observable(value)
            : ko.observable(value).extend({ numeralNumber: this.format });
        return { value: roundedValue(), value1: value1, value2: value2, isEdited: isEdited };
    }

    public applyFilterSettings() {
        this.closeSettings();
        this.applySettings(this.startDateInput(), this.endDateInput(), this.maxResultsInput());
    }

    private applySettings(startDate, endDate, maxresult) {
        this.startDate(startDate);
        this.endDate(endDate);
        this.maxResults(maxresult);
        this.selectedRange(this.selectedRangeInput());

        this.updateSignals();
    }

    private showSettings() {
        this.showDialog(true);

        this.startDateInput(moment(this.startDate()));
        this.endDateInput(moment(this.endDate()));
        this.maxResultsInput(this.maxResults());
        this.timeRangeDateInput(this.startDate());
        this.selectedRangeInput(this.selectedRange());
    }

    private closeSettings() {
        this.showDialog(false);
    }

    private getConfig() {
        var content = {
            logTags: _.map(this.logTags(), (item) => {
                return { signalName: item.signalName, logTagName: item.logTagName, isAlphanumeric: ko.unwrap(item.isAlphanumeric) }
            }),
            startDate: moment(this.startDate()).toMSDate(),
            endDate: moment(this.endDate()).toMSDate(),
            maxResults: this.maxResults(),
        }

        return content;
    }

    private loadConfig(content) {
        this.applySignalsSettingsInner(content.logTags, true);
        this.applySettings(moment(content.startDate), moment(content.endDate), content.maxResults);
    }

    private getLineWithPropertiesOrDefault(line: ITableLogTag) {
        var result = {} as ITableLogTag;
        result.columnTitle = ko.observable("");
        result.signalName = line.signalName ? ko.unwrap(line.signalName) : "";
        result.logTagName = line.logTagName ? ko.unwrap(line.logTagName) : "";
        result.isAlphanumeric = line.isAlphanumeric != undefined ? ko.unwrap(line.isAlphanumeric) : this.isAlphanumeric;

        return result;
    }

    private showSignalsSettings() {

        this.showSignalsDialog(true);

        var tmp = [];
        this.logTags().forEach((current, index, array) => {
            tmp.push({
                signalName: current.signalName,
                logTagName: current.logTagName,
                isAlphanumeric: ko.observable(current.isAlphanumeric),
            });
        });

        this.selectedLogTags(tmp);
    }

    private closeSignalSettings() {
        this.showSignalsDialog(false);
    }

    private applySignalsSettings() {
        this.closeSignalSettings();
        this.applySignalsSettingsInner(this.selectedLogTags());
    }

    private async applySignalsSettingsInner(logTags: ITableLogTag[], checkDefinition: boolean = false) {
        var tempLogTags: ITableLogTag[] = [];

        if (checkDefinition) {
            var signalNames = _.pluck(logTags, "signalName");

            if (this.connector.disableSignalBrowser && !_.any(signalNames))
                return;

            const definitions = await this.connector.getSignalDefinitions(signalNames) as SignalDefinitionDTO[];

            for (var j = 0; j < logTags.length; j++) {
                var logTag = logTags[j];

                var definition = _.findWhere(definitions, { AliasName: logTag.signalName });
                if (!definition || !definition.Active)
                    continue;

                var logs = _.filter(definition.Logs, (log: LogDTO) => log && log.Active);

                if (!logs || logs.length === 0 || _.pluck(logs, "LogTag").indexOf(logTag.logTagName) === -1)
                    continue;

                tempLogTags.push(this.getLineWithPropertiesOrDefault(logTag));
            }

            if (tempLogTags.length === 0)
                this.values.removeAll(); //have to nothing show

            this.logTags(tempLogTags);
            this.updateSignals();
        } else {
            for (var i = 0; i < logTags.length; i++)
                if (ko.unwrap(logTags[i].signalName) && ko.unwrap(logTags[i].logTagName))
                    tempLogTags.push(this.getLineWithPropertiesOrDefault(logTags[i]));

            if (tempLogTags.length === 0)
                this.values.removeAll(); //have to nothing show

            this.logTags(tempLogTags);

            this.updateSignals();
        }
    }

    public handleSortTable(index: number, asc: boolean) {

        this.values(this.values().sort((a, b) => {
            var a, b;
            if (index !== 0) {
                const valueA = a[index].value;
                const valueB = b[index].value;
                const numericA = valueA === this.emptyValueSymbol ? Number.MAX_VALUE : parseFloat(valueA.replace(",", "."));
                const numericB = valueB === this.emptyValueSymbol ? Number.MAX_VALUE : parseFloat(valueB.replace(",", "."));
                a = isNaN(numericA) ? valueA : numericA;
                b = isNaN(numericB) ? valueB : numericB;
            }
            else {
                a = new Date(a[index]);
                b = new Date(b[index]);
            }
            return asc ? <any>(a > b) - <any>(a < b) : <any>(a < b) - <any>(a > b);
        }));
    }

    private async loadInitialConfiguration() {
        try {
            const config = await this.connector.getControlConfigurationsByName(this.initialConfiguration,
                this.configurationNamespace,
                this.controlType);
            if (config) {
                let configuration = this.standaloneParametersReplacementService.replaceConfigurationParameters(config.Content);
                this.loadConfig(JSON.parse(configuration));
            }
            else if (this.settings.logTags) {
                this.settings.logTags.forEach((logTag, array, index) => {
                    logTag.signalName = (ko.unwrap(logTag.signalName) || "").stringPlaceholderResolver(this.objectID);
                    logTag.logTagName = (ko.unwrap(logTag.logTagName) || "").stringPlaceholderResolver(this.objectID);

                });
                return this.applySignalsSettingsInner(this.settings.logTags, true);
            }
        } catch (error) {
            this.connector.handleError(WfLogTableComponent)(error);
        }
    }

    private handleExport() {
        const csvFile = this.convertCsvService.convertLogTableData(this.values() as any, this.logTags() as any);
        if (csvFile == null) return;

        this.convertCsvService.download();
    }

    private getColumnTitle(signalName: string, logTag: string) {
        var self = this;

        var columnTitle = self.columnTitleTemplate;

        var definition = self.signalDefinitions[signalName];
        if (isNullOrUndefined(definition))
            return columnTitle;

        var regex = /\%(.*?)\%/g;
        var founds = columnTitle.match(regex);
        if (founds === null || founds.length === 0)
            return columnTitle;

        for (var i = 0; i < founds.length; i++) {
            var propertyName =
                founds[i].substr(founds[i].indexOf("%") + 1, founds[i].length - 2); //always %property name%

            //It can be "Name" or "Logs.Name" or "Group.Name"
            var parts = propertyName.split(".");

            var object = definition[parts[0]];

            if (parts.length > 1) {
                if (parts[0] === "Logs") { //Must to find current log tag 
                    object = _.filter(object, (log: LogDTO) => { return log.LogTag === logTag; });
                    object = object.length > 0 ? object[0] : null;
                }

                for (var j = 1; j < parts.length; j++) {
                    object = object[parts[j]];
                }
            }

            if (object == null)
                object = "";

            columnTitle = columnTitle.replace(founds[i], object);
        }

        return columnTitle;
    }

    public onEditLogTagEntry = async (index: number, data) => {
        const logTags = this.logTags()[index - 1];
        const date = moment(data[0]);
        const signalName = logTags.signalName;
        const logTagName = logTags.logTagName;
        const isAlphanumeric = logTags.isAlphanumeric;

        const definition: SignalDefinitionDTO = this.signalDefinitions[ko.unwrap(signalName)];
        if (!definition) return; //signal not exists in DB

        var logTag = _.findWhere(definition.Logs, { LogTag: logTagName });
        if (!logTag) return;

        //   this.showEditDialog(true);
        //   console.log(logTag.ID);

        // await this.updateLogValueAsync(logTag.ID, date, 1, 1);
    }

    private closeEditDialog() {
        this.showEditDialog(false);
    }

    private async updateLogValueAsync(logId: string, entryDate: moment.Moment, value: any, value2: any) {
        await this.connector.updateLogValue(logId, entryDate, value, value2);
    }

    protected async dispose() {
        await super.dispose();
        //clear dialogs

        if (this.pollTimer) {
            clearTimeout(this.pollTimer);
            this.pollTimer = null;
        }

        const signalSettingsDialog = $(document).find('#modal-signal-settings-' + ko.unwrap(this.id));
        const signalSettingsBackContainer = $(document).find('#modal-signal-settings-back-container-' + ko.unwrap(this.id));

        const settingsDialog = $(document).find('#modal-settings-' + ko.unwrap(this.id));
        const settingsBackContainer = $(document).find('#modal-settings-back-container-' + ko.unwrap(this.id));

        signalSettingsDialog.remove();
        signalSettingsBackContainer.remove();
        settingsDialog.remove();
        settingsBackContainer.remove();
    }

    private toggleIsAutoUpdating() {
        this.isAutoUpdating(!this.isAutoUpdating());

        this.handleUpdateLogs();
    }

    private async handleUpdateLogs(): Promise<void> {
        await this.updateLogs();
        this.handleAutoUpdate();
    }

    private handleAutoUpdate(): void {
        if (this.autoUpdate() && !this.isAutoUpdating()) {

            if (this.pollTimer) {
                clearTimeout(this.pollTimer);
            }

            this.pollTimer = window.setTimeout(() => {
                this.handleUpdateLogs();
            },
                this.updateRate);
        }
    }
}

export = WfLogTableComponent;
