import ComponentBaseModel = require("./component-base.model");
import SignalsService = require("../services/signalsService");
import Wflogbrowser = require("./_wf-log-browser");
import IWfSignalBrowser = Wflogbrowser.IWfSignalBrowser;

interface ISelectedItem<T> {
    selected: KnockoutObservable<boolean>,
    item: T;
}

class WfLogBrowserComponent extends ComponentBaseModel<IWfSignalBrowser> {

    private availableTypes: string[];
    private hasItems: KnockoutComputed<boolean>;

    private availableAxis: string[];
    private signalText: string;
    private labelCssClass: string;
    private isMultipleMode: boolean;
    private showType: boolean;
    private showAxis: boolean;
    private showColor: boolean;
    private showIsAlphanumeric: boolean;
    private showIsStaticColumn: boolean;
    private signalCount: number;

    public readonly signals = ko.observableArray<SignalDefinitionDTO>([]);
    public readonly logs = ko.observableArray<ISelectedItem<LogDTO>>([]);
    public readonly pattern = ko.observable("");
    public readonly delayedPattern = ko.computed(this.pattern).extend({ throttle: 500 });
    public readonly selectedSignal = ko.observable<SignalDefinitionDTO>(null);
    public readonly hasMoreSignals = ko.observable(false);
    public readonly isLoading = ko.observable(false);


    constructor(params: IWfSignalBrowser) {
        super(params);

        this.initializeComputeds();
        this.populateItemsInitialAsync();

    }

    protected initializeSettings() {
        super.initializeSettings();

        this.availableAxis = ['y1', 'y2'];

        this.showColor = this.settings.showColor !== undefined ? this.settings.showColor : false;
        this.showAxis = this.settings.showAxis !== undefined ? this.settings.showAxis : false;
        this.showType = this.settings.showType !== undefined ? this.settings.showType : false;
        this.showIsAlphanumeric = this.settings.showIsAlphanumeric !== undefined ? this.settings.showIsAlphanumeric : false;
        this.isMultipleMode = this.settings.isMultipleMode !== undefined ? this.settings.isMultipleMode : true;
        this.labelCssClass = this.settings.labelCssClass !== undefined ? this.settings.labelCssClass : "";
        this.showIsStaticColumn = this.settings.showIsStaticColumn || false;
        this.signalCount = ko.unwrap(this.settings.signalCount) || 50;

        this.signalText = ko.unwrap(this.settings.signalText) || "AliasName"; //'Name', 'Description', 'DescriptionSymbolicText',
        this.availableTypes = ['line', 'step', 'spline', 'bar', 'area', 'area-spline', 'area-step'];
    }

    private initializeComputeds() {
        this.hasItems = ko.computed(() => {
            return this.settings.items && this.settings.items().length > 0;
        });

        this.delayedPattern.subscribe(this.getSignalDefinitionsAsync);
        this.selectedSignal.subscribe(async () => {
            const selectedSignal = this.selectedSignal();
            if (!selectedSignal) {
                this.logs([]);
                return;
            }
            this.isLoading(true);
            try {
                const logs = await SignalsService.getLogs(selectedSignal.ID);
                this.logs(logs.map(log => {
                    return {
                        selected: ko.observable(this.isLogTagSelected(log)),
                        item: log
                    }
                }));
            } catch (error) {
                this.connector.error(WfLogBrowserComponent, error);
            } finally {
                this.isLoading(false);
            }
        });
    }

    private async populateItemsInitialAsync() {
        if (this.settings.beginLoadSignalsFunc)
            this.settings.beginLoadSignalsFunc();

        await this.getSignalDefinitionsAsync();

        if (this.settings.endLoadSignalsFunc)
            this.settings.endLoadSignalsFunc();
    }

    private getSignalDefinitionsAsync = async () => {
        this.selectedSignal(null);

        this.isLoading(true);

        const filter = {
            ServerNames: [],
            AliasNames: [`*${this.pattern()}*`],
            LogTags: [],
            ResultsFilter: SignalDefinitionResultsFilter.Logs | SignalDefinitionResultsFilter.Group
        } as GetSignalDefinitionsFilterDTO;
        try {
            const signals = await SignalsService.getSignalDefinitions(filter, 0, this.signalCount + 1);
            this.hasMoreSignals(signals.length >= this.signalCount + 1);
            if (signals.length >= this.signalCount)
                signals.pop();

            const validSignals = await this.validateSignals(signals);

            this.signals(validSignals);
        } catch (error) {
            this.connector.error(WfLogBrowserComponent, error);
        } finally {
            this.isLoading(false);
        }

    }

    public async validateSignals(signals: SignalDefinitionDTO[]): Promise<SignalDefinitionDTO[]> {
        return Promise.resolve(signals);
    }

    public onSignalClicked = (item: SignalDefinitionDTO) => {
        this.selectedSignal(item);
    }

    //problem with this, it or the color picker caused: [Violation] Added non-passive event listener to a scroll-blocking 'touchstart' event. Consider marking event handler as 'passive' to make the page more responsive. See https://www.chromestatus.com/feature/5745543795965952
    public onLogClicked = (item: ISelectedItem<LogDTO>) => {
        this.addItem(this.selectedSignal().AliasName, item.item.LogTag);
        this.setSelectedLog();
    }

    public isLogTagSelected(item: LogDTO) {
        const signal = _.find(this.settings.items(), (x) => ko.unwrap(x.logTagName) === item.LogTag &&  ko.unwrap(x.signalName) === this.selectedSignal().AliasName);
        return !!signal;
    }

    private setSelectedLog() {
        for (let item of this.logs()) {
            item.selected(this.isLogTagSelected(item.item));
        }
    }

    private addItem(signalName: string, logTagName: string) {

        if (_.any(this.settings.items(), (item) => {
            return  ko.unwrap(item.signalName) === signalName &&  ko.unwrap(item.logTagName) === logTagName;
        })) {
            return;
        }

        var newItem = {
            signalName: ko.observable(signalName),
            logTagName: ko.observable(logTagName),
            type: ko.observable("line")
        } as any;

        if (this.showColor)
            newItem.color = ko.observable("#880000");
        if (this.showAxis)
            newItem.axis = ko.observable();
        if (this.showIsStaticColumn)
            newItem.isStatic = ko.observable(false);
        if (this.showIsAlphanumeric)
            newItem.isAlphanumeric = ko.observable(false);

        this.settings.items.push(newItem);
    }

    private removeItem = (context: any) => {
        this.settings.items.remove(context);
        this.setSelectedLog();
    }

    protected async dispose() {
        await super.dispose();
    }
}

export = WfLogBrowserComponent;