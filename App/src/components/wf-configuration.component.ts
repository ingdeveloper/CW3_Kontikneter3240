import Connector = require("../services/connector");
import ComponentBaseModel = require("./component-base.model");
import StandaloneParametersReplacementService = require("./services/standalone-parameters-replacement.service");

declare var uuid;

interface IWfConfigurationParams extends IComponentBaseParams, IStandaloneParameters {
    controlType: number;
    namespace: string;
    buttonBarCssClass: string;
    selectedRowCssClass: string;
    operationButtonCssClass: string;
    buttonBarIconClass: string;
    tableMaxHeight: number;
    loadConfiguration: any;
    getConfiguration: any;
    showOnlyOwnConfigurations: boolean;
    isDataLoading: any;
    checkUser: boolean;
}

class WfConfigurationComponent extends ComponentBaseModel<IWfConfigurationParams> {
    private showOnlyOwnConfigurations: boolean;
    private checkUser: boolean;
    private selectedConfig: KnockoutObservable<ControlConfigurationDTO>;
    private callbakWhenNoClick: any;
    private callbakWhenYesClick: any;
    private isSaveButtonEnabled: KnockoutComputed<string>;
    private configurationItems: KnockoutComputed<ControlConfigurationDTO[]>;
    private isShowTable: KnockoutComputed<boolean>;
    private isDeleteTab: KnockoutObservable<boolean>;
    private isLoadTab: KnockoutObservable<boolean>;
    private isSaveTab: KnockoutObservable<boolean>;
    private showYesNoButtonOnError: KnockoutObservable<boolean>;
    private TextError: KnockoutObservable<string>;
    private selectedConfigName: KnockoutObservable<string>;
    private isOnlyMeConfig: KnockoutObservable<boolean>;
    private showError: KnockoutObservable<boolean>;
    private showConfig: KnockoutObservable<boolean>;
    private configurations: KnockoutObservableArray<ControlConfigurationDTO>;
    private tableMaxHeight: number;
    private buttonBarIconClass: string;
    private operationButtonCssClass: string;
    private selectedRowCssClass: string;
    private buttonBarCssClass: string;
    private namespace: KnockoutObservable<string>;
    private controlType: number;
    private isLoading: KnockoutObservable<boolean>;
    private standaloneParametersReplacementService: StandaloneParametersReplacementService;
    private canLoadConfigurations: KnockoutObservable<boolean>;
    private isButtonDisabled: KnockoutComputed<boolean>;

    constructor(params: IWfConfigurationParams) {
        super(params)
        this.initializeComputeds();
        this.getConfigurations();
    }
    

    protected initializeSettings() {
        super.initializeSettings();
        //#region public options

        this.showOnlyOwnConfigurations = this.settings.showOnlyOwnConfigurations !== undefined ? this.settings.showOnlyOwnConfigurations : false;
        this.checkUser = this.settings.checkUser !== undefined ? this.settings.checkUser : true;

        this.controlType = this.settings.controlType ? this.settings.controlType : -1;
        this.namespace = ko.observable(this.settings.namespace ? this.settings.namespace : "");
        this.namespace.subscribe(() => {
            this.getConfigurations();
        }, this);

        this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
        this.selectedRowCssClass = ko.unwrap(this.settings.selectedRowCssClass) || "danger";
        this.operationButtonCssClass = ko.unwrap(this.settings.operationButtonCssClass) || "btn btn-primary";
        this.buttonBarIconClass = ko.unwrap(this.settings.buttonBarIconClass) || "wf wf-cog";
        this.tableMaxHeight = ko.unwrap(this.settings.tableMaxHeight) || 300;

        //#region private options
        this.isLoading = ko.observable(false);
        this.configurations = ko.observableArray<ControlConfigurationDTO>([]);

        this.showConfig = ko.observable(false);
        this.showError = ko.observable(false);
        this.isOnlyMeConfig = ko.observable(this.showOnlyOwnConfigurations);

        this.selectedConfig = ko.observable<ControlConfigurationDTO>();
        this.selectedConfigName = ko.observable("");

        this.TextError = ko.observable("");
        this.showYesNoButtonOnError = ko.observable(false);
        this.callbakWhenYesClick = null;
        this.callbakWhenNoClick = null;

        this.isSaveTab = ko.observable(false);
        this.isLoadTab = ko.observable(false);
        this.isDeleteTab = ko.observable(false);

        this.canLoadConfigurations = ko.observable(true);    

        this.standaloneParametersReplacementService = new StandaloneParametersReplacementService(this.settings);
        this.isButtonDisabled = ko.computed(() => {
            return this.isLoading() || (this.settings.isDataLoading && this.settings.isDataLoading());
        });
    }

    private initializeComputeds() {

        this.isShowTable = ko.computed(() => {
            return this.isLoadTab() || this.isDeleteTab();
        });

        this.configurationItems = ko.computed(() => {
            if (this.isOnlyMeConfig())
                return this.configurations().filter((data) => {
                    return data.Owner === this.connector.currentLoggedInUser();
                });

            return this.configurations();
        });

        this.isSaveButtonEnabled = ko.computed(() => {
            return this.selectedConfigName() && this.selectedConfigName().replace(/ /g, '');
        });
    }


    private showConfigPopup() {
        //  $('#wf-config-dialog-' + ko.unwrap(this.id) + ' .nav-tabs a[role=tab]:first').tab('show');
        this.tabClick(0);
        this.showConfigPopupInner(true);
    }

    private showConfigPopupInner(value = true) {
        this.showConfig(value);
    }

    private closeConfigPopup() {
        this.showConfig(false);
        this.showError(false);
        this.selectedConfig(null);
        this.selectedConfigName(null);
    }

    private showErrorDialog(errorText, showYesNoButton, callbakWhenYesClick, callbakWhenNoClick) {
        this.showConfig(false);
        this.showError(true);

        this.TextError(errorText);
        this.showYesNoButtonOnError(showYesNoButton === undefined ? false : showYesNoButton);
        this.callbakWhenYesClick = callbakWhenYesClick;
        this.callbakWhenNoClick = callbakWhenNoClick;
    }

    private closeErrorDialog() {
        this.showError(false);
        this.TextError("");

        if (this.callbakWhenNoClick)
            this.callbakWhenNoClick();
    }

    private errorYes() {
        this.closeErrorDialog();

        if (this.callbakWhenYesClick)
            this.callbakWhenYesClick();
    }

    private async saveNewConfig() {
        const existingsConfig = _.findWhere(this.configurations(), { Name: this.selectedConfigName() });
        if (existingsConfig) {
            this.closeConfigPopup();
            this.selectConfig(existingsConfig);
            this.updateConfig();
            return;
        }

        var config = {} as ControlConfigurationDTO;

        config.ID = uuid.v4();
        config.Name = this.selectedConfigName();
        config.Namespace = this.namespace();
        config.CreatedOn = moment.utc().toMSDate();
        config.Version = 0;
        config.ControlType = this.controlType;
        config.Owner = this.connector.currentLoggedInUser();
        config.Content = ko.toJSON(this.settings.getConfiguration ? this.settings.getConfiguration() : "");
        try {
            const result = await this.connector.insertControlConfiguration(config);
            this.closeConfigPopup();
            this.getConfigurations();
            this.selectedConfigName(null);
        } catch (error) {
            this.connector.handleError(this)(error);
        }
    }

    private updateConfig() {
        if (this.checkUser) {
            if (this.selectedConfig().Owner && this.selectedConfig().Owner !== this.connector.currentLoggedInUser()) {
                this.showErrorDialog(this.connector.translate('I4SCADA_No_Permission_Overwrite_Other_Users_Configuration')(), null, null, this.showConfigPopupInner);
                return;
            }
        }
        this.showErrorDialog(this.connector.translate('I4SCADA_Overwrite_Configuration_Confirmation')(), true, async () => {
            var config = {} as ControlConfigurationDTO;

            config.ID = this.selectedConfig().ID;
            config.Name = this.selectedConfigName();
            config.Namespace = this.selectedConfig().Namespace;
            config.CreatedOn = moment.utc().toMSDate();
            config.Version = this.selectedConfig().Version;
            config.ControlType = this.controlType;
            config.Owner = this.connector.currentLoggedInUser() || this.selectedConfig().Owner;
            config.Content = ko.toJSON(this.settings.getConfiguration ? this.settings.getConfiguration() : "");

            try {
                const result = await this.connector.updateControlConfiguration(config);

                this.closeConfigPopup();
                this.getConfigurations();
                this.selectedConfig(null);
                this.selectedConfigName(null);
            } catch (error) {
                this.connector.handleError(this)(error);
            }
        }, this.showConfigPopupInner);
    }

    private loadConfig(data: ControlConfigurationDTO, event) {
        event.stopPropagation();

        if (!this.canLoadConfigurations()) {
            return;
        }

        this.canLoadConfigurations(false);

        if (ko.unwrap(this.settings.loadConfiguration)) {
            const configuration = this.standaloneParametersReplacementService.replaceConfigurationParameters(data.Content);
            this.settings.loadConfiguration(JSON.parse(configuration), data);
        }

        this.canLoadConfigurations(true);

        this.closeConfigPopup();
    }

    private selectConfig(data) {
        if (!this.isSaveTab())
            return;

        this.selectedConfig(data);
        this.selectedConfigName(data.Name);
    }

    private removeConfig(data, event) {
        event.stopPropagation();
        //this.selectConfig(data);

        if (this.checkUser) {
            if (data.Owner && data.Owner !== this.connector.currentLoggedInUser()) {
                this.showErrorDialog(this.connector.translate('I4SCADA_No_Permission_Delete_Other_Users_Configuration')(), null, null, this.showConfigPopupInner);
                return;
            }
        }

        this.showErrorDialog(this.connector.translate('I4SCADA_Delete_Configuration_Confirmation')(), true, async () => {
            try {
                const result = await this.connector.deleteControlConfiguration(data.ID);

                this.getConfigurations();
                this.showConfigPopupInner();
            } catch (error) {
                this.connector.handleError(this)(error);
            }
        }, this.showConfigPopupInner);
    }

    private async getConfigurations() {
        this.isLoading(true);
        try {
            const configs = await this.connector.getControlConfigurationsByNamespace(this.namespace(), this.controlType);

            var tmp = [];

            configs.forEach((current, index, array) => {
                var result = {} as ControlConfigurationDTO;

                result.ID = current.ID;
                result.Name = current.Name;
                result.Namespace = current.Namespace;
                result.CreatedOn = moment(current.CreatedOn).local().toISOString();
                result.UserId = current.UserId;
                result.Content = current.Content;
                result.Version = current.Version;
                result.ControlType = current.ControlType;
                result.Owner = current.Owner;

                tmp.push(result);
            });

            this.configurations(tmp);
            this.isLoading(false);
        } catch (error) {
            this.isLoading(false);
            this.connector.handleError(this)(error);
        }
    }


    private tabClick(tabID) {
        //0 - saveTab
        //1 - loadTab
        //2 - deleteTab
        this.isSaveTab(tabID === 0);
        this.isLoadTab(tabID === 1);
        this.isDeleteTab(tabID === 2);

        this.selectedConfig(null);
        this.selectedConfigName(null);
    }

    protected async dispose() {
        await super.dispose();
        //clear dialogs
        var configDialog = $(document).find('#wf-config-dialog-' + ko.unwrap(this.id));
        var configBackContainer = $(document).find('#wf-config-dialog-back-container-' + ko.unwrap(this.id));

        var errorDialog = $(document).find('#wf-config-error-dialog-' + ko.unwrap(this.id));
        var errorBackContainer = $(document).find('#wf-config-error-dialog-back-container-' + ko.unwrap(this.id));

        configDialog.remove();
        configBackContainer.remove();
        errorDialog.remove();
        errorBackContainer.remove();
    }
}

export = WfConfigurationComponent;
