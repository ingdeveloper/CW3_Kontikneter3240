import Connector = require("../../../services/connector");
import SignalsService = require("../../../services/signalsService");
import ComponentBaseModel = require("../../component-base.model");

interface IWfSignalAlarmListSignalsBrowsewrDialogParams extends IComponentBaseParams {
    buttonBarCssClass: string;
    maxSignalCount: number;
    maxSignalsForGroupAdd: number;

    groupsFilter: string[];
    signalsFilter: string[];
    filterPattern: string;

    aliasNames: KnockoutObservableArray<string>;
    onSignalsSelected: (aliasNames: string[]) => void

    isModalDialogsDraggable: boolean;
}

interface ISelectedItem<T> {
    selected: KnockoutObservable<boolean>,
    item: T;
}

class WfSignalAlarmListSignalsBrowserDialogComponent extends ComponentBaseModel<IWfSignalAlarmListSignalsBrowsewrDialogParams> {

    private emptyGuid = "00000000-0000-0000-0000-000000000000";

    public onSignalsSelected: (aliasNames: string[]) => void;

    public readonly dialog = ko.observable(false);
    public readonly isSignalLoading = ko.observable(false);
    public buttonBarCssClass: string;

    public connector = new Connector();

    public maxSignalCount: number;
    public maxSignalsForGroupAdd: number;
    public aliasNames: string[];
    public groupsFilter: string[];
    public signalsFilter: string[];
    public filterPattern: string;

    private delayedPatternSubscription: KnockoutSubscription;
    private selectedGroupIdSubscription: KnockoutSubscription;

    public readonly pattern = ko.observable<string>("");
    public readonly delayedPattern = ko.computed(this.pattern).extend({ throttle: 500 });
    public readonly isLoading = ko.observable(false);
    public readonly selectedGroupId = ko.observable<string>(this.emptyGuid);
    public readonly groupItems = ko.observableArray<NameDTO>([]);
    public readonly signalItems = ko.observableArray<ISelectedItem<DescriptionDTO>>([]);
    public readonly selectedItems = ko.observableArray<DescriptionDTO>([]);
    public readonly hasMoreSignals = ko.observable(false);
    public isModalDialogsDraggable: boolean;

    constructor(params: IWfSignalAlarmListSignalsBrowsewrDialogParams) {
        super(params);
        this.pattern(ko.unwrap(this.settings.filterPattern) || "");
        this.initializeComputeds();
    }

    public async populateItems() {
        await this.getGroupNamesAsync();
        await this.getSignalNamesAsync();
    }

    private initializeComputeds() {
        this.delayedPatternSubscription = this.delayedPattern.subscribe(() => this.getSignalNamesAsync());
        this.selectedGroupIdSubscription = this.selectedGroupId.subscribe(() => this.getSignalNamesAsync());
    }

    protected initializeSettings() {
        super.initializeSettings();
        this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
        this.maxSignalCount = ko.unwrap(this.settings.maxSignalCount);
        this.maxSignalsForGroupAdd = ko.unwrap(this.settings.maxSignalsForGroupAdd);
        this.groupsFilter = ko.unwrap(this.settings.groupsFilter) || [];
        this.signalsFilter = ko.unwrap(this.settings.signalsFilter) || [];
        this.onSignalsSelected = this.settings.onSignalsSelected || ((aliasNames: string[]) => { });
        this.isModalDialogsDraggable = this.settings.isModalDialogsDraggable !== undefined ? this.settings.isModalDialogsDraggable : true;
    }

    private async getSignalNamesAsync() {
        const pattern = `*${this.pattern()}*`;

        const filter = {
            ServerNames: [],
            AliasNames: this.signalsFilter,
            Pattern: pattern,
            GroupIds: (this.selectedGroupId() && this.selectedGroupId() != this.emptyGuid) ? [this.selectedGroupId()] : []
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
            this.connector.error(WfSignalAlarmListSignalsBrowserDialogComponent, error);
        } finally {
            this.isLoading(false);
        }
    }

    private async getGroupNamesAsync() {
        try {
            const filter = {
                ServerNames: [],
                GroupNames: ([] as string[]).concat(this.groupsFilter)
            } as GetGroupNamesFilterDTO;
            this.isLoading(true);
            const groupItems = await SignalsService.getGroupNames(filter, 0, 1000);
            this.groupItems(groupItems);

            if (!_.any(this.groupsFilter)) {
                this.groupItems.unshift({ Name: "*", ID: this.emptyGuid });
            }
            else {
                if (_.any(groupItems)) {
                    this.selectedGroupId(_.first(groupItems).ID);
                }
            }

        } catch (error) {
            this.connector.handleError(WfSignalAlarmListSignalsBrowserDialogComponent)(error);
        } finally {
            this.isLoading(false);
        }
    }


    public async addGroup() {
        try {
            const filter = {
                GroupIds: (this.selectedGroupId() && this.selectedGroupId() != this.emptyGuid) ? [this.selectedGroupId()] : [],
                AliasNames: this.signalsFilter,
                ServerNames: []
            } as GetSignalNamesFilterDTO;

            this.isLoading(true);
            const signals = await SignalsService.getSignalNames(filter, 0, this.maxSignalsForGroupAdd);

            this.selectedItems.valueWillMutate();
            for (let signal of signals) {
                this.addItem(signal);
            }
            this.setSelceted();
            this.selectedItems.valueHasMutated();

        } catch (error) {
            this.connector.handleError(WfSignalAlarmListSignalsBrowserDialogComponent)(error);
        } finally {
            this.isLoading(false);
        }
    }

    public async addSignals() {
        this.isLoading(true);
        this.selectedItems.valueWillMutate();
        for (let signal of this.signalItems()) {
            this.addItem(signal.item);
        }
        this.setSelceted();
        this.selectedItems.valueHasMutated();
        this.isLoading(false);
    }

    private isSignalSelected(item: DescriptionDTO) {
        const signal = _.find(this.selectedItems(), x => x.Name === item.Name);
        return !!signal;
    }

    public onSignalClicked = (item: ISelectedItem<DescriptionDTO>) => {
        if (this.isSignalSelected(item.item)) {
            this.selectedItems.remove(x => x.ID === item.item.ID);
            item.selected(false);
        } else {
            this.addItem(item.item);
            item.selected(true);
        }
    }

    public removeItem(item: DescriptionDTO) {
        this.selectedItems.remove(item);
        this.setSelceted();
    }

    private addItem(item: DescriptionDTO) {
        if (_.find(this.selectedItems(), signal => signal.Name === item.Name)) {
            return;
        }
        this.selectedItems.push(item);
    }

    private setSelceted() {
        for (let item of this.signalItems()) {
            item.selected(this.isSignalSelected(item.item));
        }
    }

    public onClose() {
        this.dialog(false);
    }

    public onDialog() {
        this.onSignalsSelected(this.selectedItems().map(x => x.Name));
        this.onClose();
    }

    public onReset() {
        this.selectedItems([]);
        this.onSignalsSelected([]);
        this.setSelceted();
    }

    public async onOpen() {
        this.dialog(true);
        this.selectedItems([]);
        this.aliasNames = ko.unwrap(this.settings.aliasNames) || [];
        if (this.aliasNames.length > 0) {
            await this.resolveSelectedItems(this.aliasNames);
        }
        await this.populateItems();
    }

    private async resolveSelectedItems(aliasNames: string[]) {
        const filter = {
            ServerNames: [],
            AliasNames: aliasNames,
            GroupIds: []
        } as GetSignalNamesFilterDTO;

        try {
            this.isLoading(true);
            const signals = await SignalsService.getSignalNames(filter, 0, 2147483647);

            this.selectedItems.valueWillMutate();
            for (let signal of signals) {
                if (aliasNames.find(x => x === signal.Name)) {
                    this.addItem(signal);
                }
            }
            for (let signal of aliasNames) {
                this.addItem({
                    ID: null,
                    Name: signal,
                    Description: null
                });
            }
            this.setSelceted();
            this.selectedItems.valueHasMutated();

        } catch (error) {
            this.connector.error(WfSignalAlarmListSignalsBrowserDialogComponent, error);
        } finally {
            this.isLoading(false);
        }
    }


    protected async dispose() {
        var dialog = $(document).find('#modal-dialog-' + ko.unwrap(this.id));
        dialog.remove();
        this.delayedPatternSubscription.dispose();
        this.selectedGroupIdSubscription.dispose();
    }
}

export = WfSignalAlarmListSignalsBrowserDialogComponent;