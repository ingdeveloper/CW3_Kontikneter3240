import SignalsService = require("../../services/signalsService");
import ComponentBaseModel = require("../component-base.model");

interface IWfSignalInformationPopupListParams extends IComponentBaseParams {
    objectSettings: string;
    signalPrefix: string;
    writeToBuffer: boolean;
}

class WfSignalInformationPopupListComponent extends ComponentBaseModel<IWfSignalInformationPopupListParams> {

    private readonly signalDefinitions = ko.observableArray<SignalDefinitionDTO>([]);
    private readonly languageIdChangedSubscription: KnockoutSubscription;

    public objectSettings: string;
    public signalPrefix: string;
    public writeToBuffer: boolean;

    public readonly pattern = ko.observable("");
    private readonly filteredSignalDefinitions = ko.computed(() => {
        const pattern = ko.unwrap(this.pattern).toLowerCase();
        return this.signalDefinitions().filter((i) => {
            return (i.AliasName || i.Name || "").toLowerCase().indexOf(pattern) >= 0 ||
                (i.Description || "").toLowerCase().indexOf(pattern) >= 0 ||
                (i.Unit || "").toLowerCase().indexOf(pattern) >= 0;
        });
    });

    constructor(params: IWfSignalInformationPopupListParams) {
        super(params);
        this.getDataAsync();
        this.languageIdChangedSubscription = this.connector.currentLanguageId.subscribe(() => this.getDataAsync());
    }

    protected initializeSettings() {
        super.initializeSettings();
        this.objectSettings = (ko.unwrap(this.settings.objectSettings) || "").stringPlaceholderResolver(this.objectID);
        this.signalPrefix = (ko.unwrap(this.settings.signalPrefix) || "").stringPlaceholderResolver(this.objectID);
        this.writeToBuffer = (ko.unwrap(this.settings.writeToBuffer) || false);
    }

    private async getDataAsync() {
        const signals = this.getSignalNamesFromPartameter();
        await this.getSignalDefinitionsAsync(this.objectSettings.length > 0 ? signals : null);
    }

    private getSignalNamesFromPartameter() {
        return this.objectSettings
            .replace(/;\s*$/, "")
            .split(";")
            .map(objectName => `${this.signalPrefix}${objectName}`);
    }

    private async getSignalDefinitionsAsync(signals: string[] = null) {
        const aliasNames = signals || [`${this.signalPrefix}*`];
        const filter = {
            ServerNames: [],
            AliasNames: aliasNames,
            LogTags: [],
            ResultsFilter: SignalDefinitionResultsFilter.Extended
        } as GetSignalDefinitionsFilterDTO;
        const signalDefinitions = await SignalsService.getSignalDefinitions(filter, 0, 250);
        this.signalDefinitions(signalDefinitions);
    }

    protected async dispose() {
        this.languageIdChangedSubscription.dispose();
        this.filteredSignalDefinitions.dispose();
        await super.dispose();
    }
}

export = WfSignalInformationPopupListComponent;
