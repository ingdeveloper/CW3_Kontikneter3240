import ComponentBaseModel = require("../../component-base.model");
import SignalsService = require("../../../services/signalsService");

interface IWfHistoricalDataSignalSelectorParams extends IComponentBaseParams {
    onSelect?: (item: NameDTO) => void;
    value?: KnockoutObservable<string>;
}

class WfHistoricalDataSignalSelectorComponent extends ComponentBaseModel<IWfHistoricalDataSignalSelectorParams> {

    private readonly dialog = ko.observable(false);
    private delayedPatternSubscription: KnockoutSubscription;
    private selectedGroupIdSubscription: KnockoutSubscription;

    public readonly maxSignalCount: number = 25;
    public readonly groupItems = ko.observableArray<NameDTO>([]);
    public readonly selectedGroupId = ko.observable<string>(null);
    public readonly signalItems = ko.observableArray<NameDTO>([]);
    public readonly pattern = ko.observable("");
    public readonly delayedPattern = ko.computed(this.pattern).extend({ throttle: 500 });
    public readonly hasMoreSignals = ko.observable(false);
    public readonly isLoading = ko.observable(false);
    public readonly signal: KnockoutObservable<string>;

    constructor(params: IWfHistoricalDataSignalSelectorParams) {
        super(params);
        this.initializeComputeds();

        if (this.settings.value && ko.isObservable(this.settings.value)) {
            this.signal = this.settings.value;
        } else {
            this.signal = ko.observable(null);
        }
    }

    protected initializeSettings() {
        super.initializeSettings();
    }

    private initializeComputeds() {
        this.delayedPatternSubscription = this.delayedPattern.subscribe(this.getSignalNamesAsync);
        this.selectedGroupIdSubscription = this.selectedGroupId.subscribe(this.getSignalNamesAsync);
    }

    public async populateItems() {
        await this.getGroupNamesAsync();
    }

    private getSignalNamesAsync = async () => {
        const pattern = `*${this.pattern()}*`;

        const filter = {
            ServerNames: [],
            AliasNames: [],
            Pattern: pattern,
            GroupIds: this.selectedGroupId() ? [this.selectedGroupId()] : []
        } as GetSignalNamesFilterDTO;

        try {
            this.isLoading(true);
            const signalItems = await SignalsService.getSignalNames(filter, 0, this.maxSignalCount + 1);

            this.hasMoreSignals(signalItems.length >= this.maxSignalCount + 1);
            if (signalItems.length > this.maxSignalCount) {
                signalItems.pop();
            }

            this.signalItems(signalItems);
        } catch (error) {
            this.connector.error(WfHistoricalDataSignalSelectorComponent, error);
        } finally {
            this.isLoading(false);
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
            this.connector.handleError(WfHistoricalDataSignalSelectorComponent)(error);
        } finally {
            this.isLoading(false);
        }
    }

    public onSelect(signal: NameDTO) {
        if (this.settings.onSelect) {
            this.settings.onSelect(signal);
        }

        this.signal(signal.Name);
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
        this.selectedGroupIdSubscription.dispose();
        this.delayedPatternSubscription.dispose();
        var dialog = $(document).find('#modal-dialog-' + ko.unwrap(this.id));
        dialog.remove();
    }
}

export = WfHistoricalDataSignalSelectorComponent;