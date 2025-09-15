import ComponentBaseModel = require("../../component-base.model");
import SecuredService = require("../../services/secured.service");
import { SignalAlarmListService } from "./services/signal-alarm-list.service";
import { ConfigControlType } from "../../../services/connectorEnums";
import { SignalAlarmExportService } from "./services/signal-alarm-export.service";
import StandaloneParametersReplacementService = require("../../services/standalone-parameters-replacement.service");
import { ISignalAlarmListColumnParams } from "./models/signal-alarm-list-column.params";
import { ISignalAlarmColumnNameServiceParams, SignalAlarmColumnNameService } from "./services/signal-alarm-column-name.service";

interface IWfSignalAlarmListParams extends IComponentBaseParams, IConfigurationParams, IConvertCsvParams, IStandaloneParameters, ISignalAlarmColumnNameServiceParams {
    titleText: string;
    configurationProjectAuthorization: string;
    exportProjectAuthorization: string;
    exportButtonVisibility: boolean;
    showOnlyOwnConfigurations: boolean;
    buttonBarCssClass: string;
    panelBarCssClass: string;
    headerVisibility: boolean;
    signalSelectionProjectAuthorization: string;
    signalsButtonVisibility: boolean;
    settingsButtonVisibility: boolean;
    cssClass: string;
    rowItemCssClass: string;
    maxSignalPageCount: number;
    format: string;
    dateTimeFormat: string;
    maxSignalCount: number;
    maxSignalsForGroupAdd: number;
    groupsFilter: string[];
    signalsFilter: string[];
    aliasNames: string[];
    pattern: string;
    unit: string;
    signalNamePattern: string;

    inactiveAlarmForeground: string;
    inactiveAlarmBackground: string;
    acknowledgedAlarmForeground: string;
    acknowledgedAlarmBackground: string;
    onAlarmForeground: string;
    onAlarmBackground: string;
    offAlarmForeground: string;
    offAlarmBackground: string;

    patternVisibility: boolean;
    unitVisibility: boolean;
}

interface IWfSignalAlarmListConfiguration {
    aliasNames: string[]
    columns: ISignalAlarmListColumnParams[];
    maxSignalPageCount: number;
    pattern: string;
    unit: string;
}

class WfSignalAlarmListComponent extends ComponentBaseModel<IWfSignalAlarmListParams> {
    private readonly subscriptions: KnockoutSubscription[] = [];
    public signalAlarmListService: SignalAlarmListService;
    public signalAlarmExportService: SignalAlarmExportService;
    public signalAlarmColumnNameService: SignalAlarmColumnNameService;
    private standaloneParametersReplacementService: StandaloneParametersReplacementService;
    private columns: KnockoutObservableArray<string>;
    protected titleText: string;
    protected cssClass: string;
    protected panelBarCssClass: string;
    protected buttonBarCssClass: string;
    protected headerVisibility: boolean;
    private exportSecuredService: SecuredService;
    protected exportButtonVisibility: boolean;
    protected exportProjectAuthorization: string;
    protected hasExportAuthorization: KnockoutComputed<boolean>;
    private configurationSecuredService: SecuredService;
    protected configurationButtonVisibility: boolean;
    protected configurationProjectAuthorization: string;
    protected hasConfigurationAuthorization: KnockoutComputed<boolean>;
    protected controlType: ConfigControlType;
    protected configurationNamespace: string;
    protected initialConfiguration: string;
    protected configurationButtonIconClass: string;
    protected showOnlyOwnConfigurations: boolean;
    private signalSecuredService: SecuredService;
    protected signalsButtonVisibility: boolean;
    protected signalSelectionProjectAuthorization: string;
    protected hasSignalSelectionAuthorization: KnockoutComputed<boolean>;
    protected settingsButtonVisibility: boolean;
    protected format: string;
    protected dateTimeFormat: string;
    protected maxSignalCount: number;
    protected maxSignalsForGroupAdd: number;
    protected groupsFilter: string[];
    protected signalsFilter: string[];
    protected signalNamePattern: string;

    protected patternSubscription: KnockoutSubscription;
    protected unitSubscription: KnockoutSubscription;

    private inactiveAlarmForeground: string;
    private inactiveAlarmBackground: string;
    private acknowledgedAlarmForeground: string;
    private acknowledgedAlarmBackground: string;
    private onAlarmForeground: string;
    private onAlarmBackground: string;
    private offAlarmForeground: string;
    private offAlarmBackground: string;
    protected rowItemCssClass: string;

    protected patternVisibility: boolean;
    protected unitVisibility: boolean;

    public readonly pattern = ko.observable("");
    public readonly unit = ko.observable("");
    public delayedPattern: KnockoutComputed<string>;
    public delayedUnit: KnockoutComputed<string>;

    constructor(params: IWfSignalAlarmListParams) {
        super(params);

        this.initializeConfiguration();

        this.signalAlarmColumnNameService = new SignalAlarmColumnNameService(this.settings)
        this.columns = ko.observableArray(this.signalAlarmColumnNameService.getColumnNames());

        this.signalAlarmListService = new SignalAlarmListService(this.signalAlarmColumnNameService)
        this.signalAlarmListService.aliasNames(_.map(ko.unwrap(this.settings.aliasNames) || [], item => (item || "").stringPlaceholderResolver(this.objectID)));
        this.signalAlarmListService.setSignalInformationColumns(this.columns());
        this.signalAlarmListService.maxSignalCount(ko.unwrap(this.settings.maxSignalPageCount) || 50);

        this.dateTimeFormat = ko.unwrap(this.settings.exportDateTimeFormat) || ko.unwrap(this.settings.dateTimeFormat) || "DD.MM.YYYY HH:mm:ss";
        this.signalAlarmExportService = new SignalAlarmExportService(this.signalAlarmListService, { ...this.settings, exportDateTimeFormat: this.dateTimeFormat });

        this.initializeColors();

        this.pattern((ko.unwrap(this.settings.pattern) || "").stringPlaceholderResolver(this.objectID));
        this.unit((ko.unwrap(this.settings.unit) || "").stringPlaceholderResolver(this.objectID));
        this.subscribePattern();
        this.subscribeUnit();
        this.getData();
    }

    public subscribePattern() {
        this.delayedPattern = ko.computed(this.pattern).extend({ throttle: 500 });
        this.patternSubscription = this.delayedPattern.subscribe(this.onRefresh);
    }

    public subscribeUnit() {
        this.delayedUnit = ko.computed(this.unit).extend({ throttle: 500 });
        this.unitSubscription = this.delayedUnit.subscribe(this.onRefresh);
    }

    public unSubscribePattern() {
        this.patternSubscription.dispose();
        this.delayedPattern.dispose();
    }

    public unSubscribeUnit() {
        this.unitSubscription.dispose();
        this.delayedUnit.dispose();
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.standaloneParametersReplacementService = new StandaloneParametersReplacementService(this.settings);

        //#region signal selection project authorization
        this.signalSelectionProjectAuthorization = (ko.unwrap(this.settings.signalSelectionProjectAuthorization) || "").stringPlaceholderResolver(this.objectID);
        this.signalSecuredService = new SecuredService(this.signalSelectionProjectAuthorization);
        this.hasSignalSelectionAuthorization = this.signalSecuredService.hasAuthorization;
        //#endregion


        //#region configuration project authorization
        this.configurationProjectAuthorization = (ko.unwrap(this.settings.configurationProjectAuthorization) || "").stringPlaceholderResolver(this.objectID);
        this.configurationSecuredService = new SecuredService(this.configurationProjectAuthorization);
        this.hasConfigurationAuthorization = this.configurationSecuredService.hasAuthorization;
        //#endregion

        //#region export project authorization
        this.exportProjectAuthorization = (ko.unwrap(this.settings.exportProjectAuthorization) || "").stringPlaceholderResolver(this.objectID);
        this.exportSecuredService = new SecuredService(this.exportProjectAuthorization);
        this.hasExportAuthorization = this.exportSecuredService.hasAuthorization;
        //#endregion

        this.initialConfiguration = (ko.unwrap(this.settings.initialConfiguration) || "").stringPlaceholderResolver(this.objectID);
        this.configurationNamespace = (ko.unwrap(this.settings.configurationNamespace) || "").stringPlaceholderResolver(this.objectID);
        this.controlType = ConfigControlType.SignalALarmList;
        this.configurationButtonIconClass = ko.unwrap(this.settings.configurationButtonIconClass);
        this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
        this.panelBarCssClass = ko.unwrap(this.settings.panelBarCssClass) || "panel panel-default";
        this.cssClass = ko.unwrap(this.settings.cssClass) || "";
        this.showOnlyOwnConfigurations = this.settings.showOnlyOwnConfigurations !== undefined ? this.settings.showOnlyOwnConfigurations : false;
        this.configurationButtonVisibility = ko.unwrap(this.settings.configurationButtonVisibility) !== undefined ? ko.unwrap(this.settings.configurationButtonVisibility) : true;

        this.headerVisibility = ko.unwrap(this.settings.headerVisibility) !== undefined ? ko.unwrap(this.settings.headerVisibility) : true;
        this.exportButtonVisibility = ko.unwrap(this.settings.exportButtonVisibility) !== undefined ? ko.unwrap(this.settings.exportButtonVisibility) : true;
        this.signalsButtonVisibility = ko.unwrap(this.settings.signalsButtonVisibility) !== undefined ? ko.unwrap(this.settings.signalsButtonVisibility) : true;

        this.settingsButtonVisibility = ko.unwrap(this.settings.settingsButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsButtonVisibility) : true;

        this.titleText = (ko.unwrap(this.settings.titleText) ? ko.unwrap(this.settings.titleText) : "WEBfactory SignalAlarmList").stringPlaceholderResolver(this.objectID);

        this.maxSignalCount = ko.unwrap(this.settings.maxSignalCount) !== undefined ? ko.unwrap(this.settings.maxSignalCount) : 100;
        this.maxSignalsForGroupAdd = ko.unwrap(this.settings.maxSignalsForGroupAdd) !== undefined ? ko.unwrap(this.settings.maxSignalsForGroupAdd) : 500;

        this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[000]";

        this.signalsFilter = _.map(ko.unwrap(this.settings.signalsFilter) || [], item => (item || "").stringPlaceholderResolver(this.objectID));
        this.groupsFilter = _.map(ko.unwrap(this.settings.groupsFilter) || [], item => (item || "").stringPlaceholderResolver(this.objectID));

        this.signalNamePattern = (ko.unwrap(this.settings.signalNamePattern) ? ko.unwrap(this.settings.signalNamePattern) : "").stringPlaceholderResolver(this.objectID);

        this.patternVisibility = ko.unwrap(this.settings.patternVisibility) !== undefined ? ko.unwrap(this.settings.patternVisibility) : true;
        this.unitVisibility = ko.unwrap(this.settings.unitVisibility) !== undefined ? ko.unwrap(this.settings.unitVisibility) : false;
    }

    private initializeColors() {
        this.acknowledgedAlarmBackground = ko.unwrap(this.settings.acknowledgedAlarmBackground) ? ko.unwrap(this.settings.acknowledgedAlarmBackground) : null;// "#E08F00";
        this.acknowledgedAlarmForeground = ko.unwrap(this.settings.acknowledgedAlarmForeground) ? ko.unwrap(this.settings.acknowledgedAlarmForeground) : null;//"#FFFFFF";

        this.offAlarmBackground = ko.unwrap(this.settings.offAlarmBackground) ? ko.unwrap(this.settings.offAlarmBackground) : null;//"#0c9900";
        this.offAlarmForeground = ko.unwrap(this.settings.offAlarmForeground) ? ko.unwrap(this.settings.offAlarmForeground) : null;//"#FFFFFF";

        this.onAlarmBackground = ko.unwrap(this.settings.onAlarmBackground) ? ko.unwrap(this.settings.onAlarmBackground) : null;//"#990100";
        this.onAlarmForeground = ko.unwrap(this.settings.onAlarmForeground) ? ko.unwrap(this.settings.onAlarmForeground) : null;//"#FFFFFF";

        this.inactiveAlarmBackground = ko.unwrap(this.settings.inactiveAlarmBackground) ? ko.unwrap(this.settings.inactiveAlarmBackground) : "";
        this.inactiveAlarmForeground = ko.unwrap(this.settings.inactiveAlarmForeground) ? ko.unwrap(this.settings.inactiveAlarmForeground) : "";

        this.rowItemCssClass = ko.unwrap(this.settings.rowItemCssClass) || "";

        this.signalAlarmListService.colors = {
            inactiveAlarmForeground: this.inactiveAlarmForeground,
            inactiveAlarmBackground: this.inactiveAlarmBackground,
            onAlarmForeground: this.onAlarmForeground,
            onAlarmBackground: this.onAlarmBackground,
            offAlarmForeground: this.offAlarmForeground,
            offAlarmBackground: this.offAlarmBackground,
            acknowledgedAlarmForeground: this.acknowledgedAlarmForeground,
            acknowledgedAlarmBackground: this.acknowledgedAlarmBackground,
            rowItemCssClass: this.rowItemCssClass
        };
    }

    private initializeConfiguration() {
        this.initialConfiguration = (ko.unwrap(this.settings.initialConfiguration) || "").stringPlaceholderResolver(this.objectID);
        this.configurationNamespace = (ko.unwrap(this.settings.configurationNamespace) || "").stringPlaceholderResolver(this.objectID);
        this.controlType = ConfigControlType.SignalALarmList;
    }

    public handleExport() {
        this.signalAlarmExportService.handleExport(this.columns());
    }

    protected onRefresh = async () => {
        this.signalAlarmListService.pattern = this.pattern();
        this.signalAlarmListService.unit = this.unit();
        this.signalAlarmListService.getDataAsync();
    }
    protected getData = async () => {
        await this.loadInitialConfiguration();
        await this.onRefresh();
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
            this.connector.handleError(WfSignalAlarmListComponent)(error);
        }
    }

    // configuration
    protected getConfig() {
        const content: IWfSignalAlarmListConfiguration = {
            aliasNames: this.signalAlarmListService.aliasNames(),
            columns: this.signalAlarmColumnNameService.columns,
            maxSignalPageCount: this.signalAlarmListService.maxSignalCount(),
            pattern: this.pattern(),
            unit: this.unit(),
        }
        return content;

    }

    public applyConfigurationLoad(content) {
        this.loadConfig(content);
        this.onRefresh();
    }

    protected loadConfig(content: IWfSignalAlarmListConfiguration) {
        this.signalAlarmColumnNameService.loadConfig(content.columns);
        this.columns(this.signalAlarmColumnNameService.getColumnNames());
        this.signalAlarmListService.aliasNames(content.aliasNames);
        this.signalAlarmListService.maxSignalCount(content.maxSignalPageCount);
        this.signalAlarmListService.setSignalInformationColumns(this.columns());
        this.signalAlarmListService.pattern = content.pattern;
        this.unSubscribePattern();
        this.unSubscribeUnit();
        this.pattern(content.pattern);
        this.unit(content.unit);
        this.subscribePattern();
        this.subscribeUnit();
    }

    protected onSignalsSelected = (aliasNames: string[]) => {
        this.signalAlarmListService.onSignalsSelected(aliasNames);
    };

    protected onSettingsApplied = (columnsOrder: string[], maxSignalPageCount: number) => {
        this.columns(columnsOrder);
        this.signalAlarmColumnNameService.onSettingsApplied(columnsOrder);
        this.signalAlarmListService.onSettingsApplied(columnsOrder, maxSignalPageCount);
    };

    protected async dispose() {
        await super.dispose();

        for (const subscription of this.subscriptions) {
            subscription.dispose();
        }

        this.unSubscribePattern();
        this.subscribeUnit();
        this.signalAlarmListService.dispose();
    }
}

export = WfSignalAlarmListComponent;
