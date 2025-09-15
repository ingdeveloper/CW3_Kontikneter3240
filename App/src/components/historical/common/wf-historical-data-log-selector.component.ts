import ComponentBaseModel = require("../../component-base.model");
import SignalsService = require("../../../services/signalsService");

interface IWfHistoricalDataLogSelectorParams extends IComponentBaseParams {
    onSelect?: (item: SignalDefinitionDTO, log: LogDTO) => void;
    signal?: KnockoutObservable<string>;
    tag?: KnockoutObservable<string>;
}

class WfHistoricalDataLogSelectorComponent extends ComponentBaseModel<IWfHistoricalDataLogSelectorParams> {

    private readonly dialog = ko.observable(false);
    private delayedPatternSubscription: KnockoutSubscription;
    private selectedGroupIdSubscription: KnockoutSubscription;
    private selectedSignalDefinitionSubscription: KnockoutSubscription;

    public readonly maxSignalCount: number = 25;
    public readonly groupItems = ko.observableArray<NameDTO>([]);
    public readonly selectedGroupId = ko.observable<string>(null);
    public readonly signalItems = ko.observableArray<NameDTO>([]);

    public readonly logs = ko.observableArray<LogDTO>([]);
    public readonly signalDefinitions = ko.observableArray<SignalDefinitionDTO>([]);
    public readonly selectedSignalDefinition = ko.observable<SignalDefinitionDTO>();

    public readonly pattern = ko.observable("");
    public readonly delayedPattern = ko.computed(this.pattern).extend({ throttle: 500 });
    public readonly hasMoreSignals = ko.observable(false);
    public readonly isLoading = ko.observable(false);
    public readonly signal: KnockoutObservable<string>;
    public readonly tag: KnockoutObservable<string>;
    public readonly value: KnockoutComputed<string>;

    constructor(params: IWfHistoricalDataLogSelectorParams) {
        super(params);
        this.initializeComputeds();

        if (this.settings.signal && ko.isObservable(this.settings.signal)) {
            this.signal = this.settings.signal;
        } else {
            this.signal = ko.observable(null);
        }

        if (this.settings.tag && ko.isObservable(this.settings.tag)) {
            this.tag = this.settings.tag;
        } else {
            this.tag = ko.observable(null);
        }

        this.value = ko.computed(() => {
            if (this.signal() && this.tag())
                return `${this.signal()}\\${this.tag()}`;
            else
                return null;
        })
    }

    protected initializeSettings() {
        super.initializeSettings();
    }

    private initializeComputeds() {
        this.delayedPatternSubscription = this.delayedPattern.subscribe(this.getDataAsync);
        this.selectedGroupIdSubscription = this.selectedGroupId.subscribe(this.getDataAsync);
        this.selectedSignalDefinitionSubscription = this.selectedSignalDefinition.subscribe(() => { this.getLogsAsync() });
    }

    private setSelected() {
        this.selectedSignalDefinition(_.first(this.signalDefinitions()));
    }

    public async populateItems() {
        await this.getGroupNamesAsync();
        this.selectedGroupId(null);
    }

    private getDataAsync = async () => {
        this.isLoading(true);
        await this.getSignalNamesAsync();
        await this.getSignalDefinitionsAsync();
        this.setSelected();
        this.isLoading(false);
    }

    private async getSignalNamesAsync() {
        const pattern = `*${this.pattern()}*`;

        const filter = {
            ServerNames: [],
            AliasNames: [],
            Pattern: pattern,
            GroupIds: this.selectedGroupId() ? [this.selectedGroupId()] : [],
            WithLogs: true
        } as GetSignalNamesFilterDTO;

        try {
            const signalItems = await SignalsService.getSignalNames(filter, 0, this.maxSignalCount + 1);
            this.hasMoreSignals(signalItems.length >= this.maxSignalCount + 1);
            if (signalItems.length > this.maxSignalCount) {
                signalItems.pop();
            }

            this.signalItems(signalItems);
        } catch (error) {
            this.connector.error(WfHistoricalDataLogSelectorComponent, error);
        }
    }

    private async getSignalDefinitionsAsync() {
        const filter = {
            ServerNames: [],
            AliasNames: this.signalItems().map(x => x.Name),
            LogTags: [],
            ResultsFilter: SignalDefinitionResultsFilter.Basic | SignalDefinitionResultsFilter.Group | SignalDefinitionResultsFilter.Logs

        } as GetSignalDefinitionsFilterDTO;

        try {
            const signals = await SignalsService.getSignalDefinitions(filter, 0, this.maxSignalCount);
            this.signalDefinitions(signals);
        } catch (error) {
            this.connector.error(WfHistoricalDataLogSelectorComponent, error);
        }
    }

    private async getGroupNamesAsync() {
        try {
            const filter = {
                ServerNames: [],
                GroupNames: [],
            } as GetGroupNamesFilterDTO;
            this.isLoading(true);
            const groupItems = await SignalsService.getGroupNames(filter, 0, 500);
            this.groupItems(groupItems);

            this.groupItems.unshift({ Name: "*", ID: null });
            this.selectedGroupId.notifySubscribers();

        } catch (error) {
            this.connector.handleError(WfHistoricalDataLogSelectorComponent)(error);
        } finally {
            this.isLoading(false);
        }
    }


    private async getLogsAsync() {
        try {
            const logs = await SignalsService.getLogs(this.selectedSignalDefinition().ID);
            this.logs(logs);
        } catch (error) {
            this.connector.handleError(WfHistoricalDataLogSelectorComponent)(error);
        }
    }


    public async onSelectSignal(signal: SignalDefinitionDTO) {
        this.selectedSignalDefinition(signal);
    }

    public onSelect(log: LogDTO) {
        if (this.settings.onSelect) {
            this.settings.onSelect(this.selectedSignalDefinition(), log);
        }
        this.signal(this.selectedSignalDefinition().AliasName);
        this.tag(log.LogTag);

        this.onClose();
    }

    public onClicked() {
        this.dialog(true);
        this.populateItems();
    }

    public onClose() {
        this.dialog(false);
    }

    protected async dispose() {
        this.delayedPatternSubscription.dispose();
        this.selectedGroupIdSubscription.dispose();
        this.selectedSignalDefinitionSubscription.dispose();
        var dialog = $(document).find('#modal-dialog-' + ko.unwrap(this.id));
        dialog.remove();
    }
}

export = WfHistoricalDataLogSelectorComponent;