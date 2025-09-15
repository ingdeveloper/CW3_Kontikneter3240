import SecuredService = require("../services/secured.service");
import SignalsService = require("../../services/signalsService");
import { ConfigControlType } from "../../services/connectorEnums"
import ComponentBaseModel = require("../component-base.model");
import StandaloneParametersReplacementService = require("../services/standalone-parameters-replacement.service");

interface IWfSignalListComponentParams extends IComponentBaseParams, IConfigurationParams, IStandaloneParameters {
    listTemplate: string;
    listValidationCssClass: string;
    listButtonCssClass: string;
    addButtonCssClass: string;
    valueDisplayClass: string;
    format: string;
    title: string;
    groupsFilter: string[];
    signalsFilter: string[];
    showDialog: boolean;
    signals: IWfSignalListComponentSignalModel[];
    signalsButtonVisibility: boolean;
    showOnlyOwnConfigurations: boolean;
    signalNamePatterns: string[];
    signalFilterText: string;
    configurationProjectAuthorization: string;
    signalSelectionProjectAuthorization: string;
    signalInformationColumns: string[];
    maxSignalCount: number;
    maxSignalsForGroupAdd: number;
}

interface IWfSignalListComponentSignalModel {
    signalName: string;
    signalLabel?: string;
    staticUnitText?: string;
    isAlphanumeric?: boolean;
}

interface ISelectedItem<T> {
    selected: KnockoutObservable<boolean>,
    item: T;
}

class WfSignalListComponent extends ComponentBaseModel<IWfSignalListComponentParams> {
    private signalInformationColumns: any;
    private signalFilterText: string;
    private showControlBar: KnockoutComputed<string | boolean>;
    private signalNamePatterns: string[];
    private signalsButtonVisibility: boolean;
    private showOnlyOwnConfigurations: boolean;
    private items: KnockoutObservableArray<IWfSignalListComponentSignalModel>;
    private isAlphanumeric: KnockoutObservable<boolean>;
    private filtersChanged: KnockoutObservable<boolean>;
    private hasData: KnockoutComputed<boolean>;
    private listTemplate: string;
    private listValidationCssClass: string;
    private listButtonCssClass: string;
    private addButtonCssClass: string;
    private valueDisplayClass: string;
    private format: string;
    private title: string;
    private groupsFilter: Array<string>;
    private signalsFilter: Array<string>;
    private showDialog: KnockoutObservable<boolean>;
    private configurationButtonIconClass: string;
    private controlType: ConfigControlType;
    private configurationNamespace: string;
    private initialConfiguration: string;
    private configurationButtonVisibility: boolean;

    private hasSignalSelectionAuthorization: KnockoutComputed<boolean>;
    private hasConfigurationAuthorization: KnockoutComputed<boolean>;

    private signalSecuredService: SecuredService;
    private configurationSecuredService: SecuredService;

    private signalSelectionProjectAuthorization: string;
    private configurationProjectAuthorization: string;

    private signals: KnockoutObservableArray<IWfSignalListComponentSignalModel>;
    public maxSignalCount: number;
    public maxSignalsForGroupAdd: number;
    private readonly groupItems = ko.observableArray<NameDTO>([]);
    private readonly selectedGroupId = ko.observable<string>(null);
    public readonly signalItems = ko.observableArray<ISelectedItem<NameDTO>>([]);
    public readonly pattern = ko.observable("");
    public readonly delayedPattern = ko.computed(this.pattern).extend({ throttle: 500 });
    public readonly hasMoreSignals = ko.observable(false);
    public readonly isLoading = ko.observable(false);

    private standaloneParametersReplacementService: StandaloneParametersReplacementService;

    constructor(params: IWfSignalListComponentParams) {
        super(params);
        this.initializeComputeds();
        this.populateItems();
    }

    public async populateItems() {
        await this.getGroupNamesAsync();
        //await this.getSignalNamesAsync();
        await this.loadInitialConfigurationAsync();
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.standaloneParametersReplacementService = new StandaloneParametersReplacementService(this.settings);

        this.showDialog = ko.observable(false);
        this.controlType = ConfigControlType.SignalList;
        this.items = ko.observableArray<IWfSignalListComponentSignalModel>();
        this.filtersChanged = ko.observable(false);
        this.isAlphanumeric = ko.observable(false);
        this.signals = ko.observableArray<IWfSignalListComponentSignalModel>();

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

        this.showOnlyOwnConfigurations = this.settings.showOnlyOwnConfigurations !== undefined ? this.settings.showOnlyOwnConfigurations : false;

        this.configurationButtonVisibility = ko.unwrap(this.settings.configurationButtonVisibility) !== undefined ? ko.unwrap(this.settings.configurationButtonVisibility) : true;
        this.signalsButtonVisibility = ko.unwrap(this.settings.signalsButtonVisibility) !== undefined ? ko.unwrap(this.settings.signalsButtonVisibility) : true;

        this.initialConfiguration = (ko.unwrap(this.settings.initialConfiguration) || "").stringPlaceholderResolver(this.objectID);
        this.configurationNamespace = (ko.unwrap(this.settings.configurationNamespace) || "").stringPlaceholderResolver(this.objectID);
        this.configurationButtonIconClass = ko.unwrap(this.settings.configurationButtonIconClass);
        this.signalNamePatterns = this.resolveObjectIds(this.settings.signalNamePatterns || []);
        this.tooltipText = (ko.unwrap(this.connector.translate(this.settings.tooltipText)()) || "").stringPlaceholderResolver(this.objectID);
        this.signalsFilter = _.map(ko.unwrap(this.settings.signalsFilter) || [], item => (item || "").stringPlaceholderResolver(this.objectID));
        this.groupsFilter = _.map(ko.unwrap(this.settings.groupsFilter) || [], item => (item || "").stringPlaceholderResolver(this.objectID));

        this.title = (ko.unwrap(this.settings.title) || "").stringPlaceholderResolver(this.objectID);
        this.format = ko.unwrap(this.settings.format) || '0,0.[00]';
        this.valueDisplayClass = ko.unwrap(this.settings.valueDisplayClass) || "label-info";

        this.addButtonCssClass = ko.unwrap(this.settings.addButtonCssClass) || "btn btn-success";
        this.listButtonCssClass = ko.unwrap(this.settings.listButtonCssClass) || "btn btn-default";
        this.listValidationCssClass = ko.unwrap(this.settings.listValidationCssClass) || "btn btn-info";

        this.listTemplate = ko.unwrap(this.settings.listTemplate) || "wf-value-display"; //Available options are: wf-value-display, wf-value, wf-signal-information, wf-input 

        this.maxSignalCount = ko.unwrap(this.settings.maxSignalCount) !== undefined ? ko.unwrap(this.signalsFilter.length || this.settings.maxSignalCount) : 50;
        this.maxSignalsForGroupAdd = ko.unwrap(this.settings.maxSignalsForGroupAdd) !== undefined ? ko.unwrap(this.settings.maxSignalsForGroupAdd) : 500;
    }

    private initializeComputeds() {
        this.hasData = ko.computed(() => {
            return ko.unwrap(this.signals) && ko.unwrap(this.signals).length > 0;
        });

        this.showControlBar = ko.computed(() => {
            return this.title || this.configurationButtonVisibility || this.signalsButtonVisibility;
        }, this);

        this.signalFilterText = ko.unwrap(this.settings.signalFilterText) || "AliasName";
        this.signalInformationColumns = this.getSignalInformationColumns();

        this.delayedPattern.subscribe(this.getSignalNamesAsync);
        this.selectedGroupId.subscribe(this.getSignalNamesAsync);
    }

    private getSignalNamesAsync = async () => {
        const pattern = _.any(this.signalsFilter) ? "" : `*${this.pattern()}*`;

        const filter = {
            ServerNames: [],
            AliasNames: [pattern].concat(this.signalsFilter),
            GroupIds: this.selectedGroupId() ? [this.selectedGroupId()] : []
        } as GetSignalNamesFilterDTO;

        try {
            this.isLoading(true);
            const signalItems = await SignalsService.getSignalNames(filter, 0, this.maxSignalCount + 1);

            this.hasMoreSignals(signalItems.length >= this.maxSignalCount + 1);
            if (signalItems.length >= this.maxSignalCount) {
                signalItems.pop();
            }

            this.signalItems(signalItems.map((signal) => {
                return {
                    item: signal,
                    selected: ko.observable(this.isSignalSelected(signal))
                }
            }));
        } catch (error) {
            this.connector.error(WfSignalListComponent, error);
        } finally {
            this.isLoading(false);
        }

    }

    public onSignalClicked = (item: ISelectedItem<NameDTO>) => {
        this.addItem(item.item.Name);
        this.setSelceted();
    }

    private setSelceted() {
        for (let item of this.signalItems()) {
            item.selected(this.isSignalSelected(item.item));
        }
    }

    private isSignalSelected(item: NameDTO) {
        const signal = _.find(this.items(), x => x.signalName === item.Name);
        return !!signal;
    }

    private getSignalInformationColumns() {

        var defaultColumns = ["AliasName", "Name", "Unit"];
        var columnsFroimSettings = ko.unwrap(this.settings.signalInformationColumns);

        if (!columnsFroimSettings)
            return defaultColumns;
        if (columnsFroimSettings.length === 0)
            return defaultColumns;

        return columnsFroimSettings;
    }

    private async showSettings() {

        this.showDialog(true);

        const result = [] as IWfSignalListComponentSignalModel[];
        const signals = ko.unwrap(this.signals);

        if (!this.filtersChanged()) {
            if (signals) {
                for (let signal of signals)
                    result.push({
                        signalName: signal.signalName,
                        isAlphanumeric: signal.isAlphanumeric !== undefined ? signal.isAlphanumeric : false,
                    });
            }
            this.items(result);
        }
    }

    private closeSettings() {
        this.showDialog(false);
    }

    private applyFilterSettings() {
        this.showDialog(false);
        this.filtersChanged(false);

        var temp = _.map(this.items(), (item: IWfSignalListComponentSignalModel) => {
            var signal = _.findWhere(ko.unwrap(this.settings.signals), { signalName: item });

            return {
                signalName: item.signalName,
                signalLabel: signal ? signal.signalLabel : '',
                staticUnitText: signal ? signal.staticUnitText : '',
                isAlphanumeric: item.isAlphanumeric,
            };
        });

        this.signals(temp);
    }

    private clearFilterSettings() {
        this.items([]);
    }

    private addItem(signalName: string) {

        if (_.find(this.items(), signal => signal.signalName === signalName)) {
            return;
        }

        this.items.push({
            signalName: signalName,
            isAlphanumeric: this.isAlphanumeric()
        });

        this.isAlphanumeric(false);
        this.filtersChanged(true);
    }

    private async addGroup() {
        try {
            const filter = {
                GroupIds: [this.selectedGroupId],
                AliasNames: [],
                ServerNames: []
            } as GetSignalNamesFilterDTO;

            this.isLoading(true);
            const signals = await SignalsService.getSignalNames(filter, 0, this.maxSignalsForGroupAdd);

            this.items.valueWillMutate();
            for (let signal of signals) {

                if (_.find(this.items(), x => x.signalName === signal.Name)) {
                    continue;
                }

                this.items.push({
                    signalName: signal.Name,
                    isAlphanumeric: this.isAlphanumeric()
                });
            }
            this.items.valueHasMutated();
            this.isAlphanumeric(false);
            this.filtersChanged(true);

        } catch (error) {
            this.connector.handleError(WfSignalListComponent)(error);
        } finally {
            this.isLoading(false);
        }
    }

    private removeItem(removedItem: IWfSignalListComponentSignalModel) {
        this.items.remove(removedItem);
        this.filtersChanged(true);
        this.setSelceted();
    }

    private async getGroupNamesAsync() {
        try {
            const filter = {
                ServerNames: [],
                GroupNames: ([] as string[]).concat(this.groupsFilter)
            } as GetGroupNamesFilterDTO;
            this.isLoading(true);
            const groupItems = await SignalsService.getGroupNames(filter, 0, 500);
            this.groupItems(groupItems);

            if (!_.any(this.groupsFilter)) {
                this.groupItems.unshift({ Name: "*", ID: null });
                this.selectedGroupId.notifySubscribers();
            }
            else {
                if (_.any(groupItems)) {
                    this.selectedGroupId(_.first(groupItems).ID);
                }
            }

        } catch (error) {
            this.connector.handleError(WfSignalListComponent)(error);
        } finally {
            this.isLoading(false);
        }
    }

    private resolvePlaceHolder(signalNames: IWfSignalListComponentSignalModel[]) {
        for (var i = 0; i < signalNames.length; i++) {
            signalNames[i].signalName = (ko.unwrap(signalNames[i].signalName) || "").stringPlaceholderResolver(this.objectID);
            signalNames[i].signalLabel = (ko.unwrap(signalNames[i].signalLabel) || "").stringPlaceholderResolver(this.objectID);
            signalNames[i].staticUnitText = (ko.unwrap(signalNames[i].staticUnitText) || "").stringPlaceholderResolver(this.objectID);
        }

        return signalNames;
    }

    private getConfig() {
        var content = {
            signals: this.signals
        }
        return content;
    }

    private loadConfig(content: any) {
        this.signals(content.signals);
    }

    private async loadInitialConfigurationAsync() {
        try {
            const configuration = await this.connector.getControlConfigurationsByName(this.initialConfiguration, this.configurationNamespace, this.controlType);

            if (configuration) {
                let config = this.standaloneParametersReplacementService.replaceConfigurationParameters(configuration.Content);
                this.loadConfig(JSON.parse(config));
                return;
            }

            let signals = await this.getSettingsSignalsThatActullyExists();

            if (this.signalNamePatterns && this.signalNamePatterns.length > 0) {
                const filter = {
                    ServerNames: [],
                    AliasNames: this.signalNamePatterns,
                    GroupIds: []
                } as GetSignalNamesFilterDTO;

                const dtos = await SignalsService.getSignalNames(filter, 0, this.maxSignalsForGroupAdd);
                signals = signals.concat(_.map(dtos,
                    dto => {
                        return { signalName: dto.Name } as IWfSignalListComponentSignalModel;
                    }));

                this.signals(signals);
                return;

            }

            this.signals(signals);
        }
        catch (error) {
            this.connector.handleError(WfSignalListComponent)(error);
        }

    }

    private async getSettingsSignalsThatActullyExists() {
        const signals = ko.unwrap(this.settings.signals) || [];
        const resolvedSignals = this.resolvePlaceHolder(ko.unwrap(signals));
        const result: IWfSignalListComponentSignalModel[] = [];
        const promisses = resolvedSignals.map(signal => this.addSignal(signal, result));
        await Promise.all(promisses);
        return result;
    }

    private async addSignal(signal: IWfSignalListComponentSignalModel, result: IWfSignalListComponentSignalModel[]) {
        if (await this.connector.isSignalDefined(signal.signalName)) {
            result.push(signal);
        }
    }

    protected async dispose() {
        await super.dispose();
        //clear dialogs
        var settingsDialog = $(document).find('#modal-settings-' + ko.unwrap(this.id));
        var settingsBackContainer = $(document).find('#modal-settings-back-container-' + ko.unwrap(this.id));

        settingsDialog.remove();
        settingsBackContainer.remove();
    }

    private resolveObjectIds(signalNamePatterns: string[]) {
        const result: string[] = [];

        for (let signalName of _.filter(signalNamePatterns, name => name !== null)) {
            result.push(signalName.stringPlaceholderResolver(this.objectID));
        }

        return result;
    }

    private getSymbolicText(propertyName: string) {
        return "I4SCADA_" + propertyName.replace(".", "");
    }
}

export = WfSignalListComponent;
