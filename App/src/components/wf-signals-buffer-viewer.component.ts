import Connector = require("../services/connector");
import ComponentBaseModel = require("./component-base.model");

interface IWfSignalsBufferViewerParams extends IComponentBaseParams {
    updateRate: number;
    tableHeight: number;
}

interface ISortingData {
    index: number;
    asc: boolean;
}
class WfSignalsBufferViewerComponent extends ComponentBaseModel<IWfSignalsBufferViewerParams> {
    private sortingData: KnockoutObservable<ISortingData>;
    private signals: KnockoutObservableArray<KeyValuePair<string, any>>;
    private pollTimer: number;
    private tableHeight: KnockoutObservable<number>;
    private updateRate: number;

    constructor(params: IWfSignalsBufferViewerParams) {
        super(params)
        this.handleAutoUpdate();
    }

    protected initializeSettings() {
        super.initializeSettings();
        this.sortingData = ko.observable<ISortingData>(null);
        this.signals = ko.observableArray([] as KeyValuePair<string, any>[]);
        this.pollTimer = null;

        this.updateRate = Math.max(ko.unwrap(this.settings.updateRate) ? ko.unwrap(this.settings.updateRate) : 1000, 100);
        this.tableHeight = ko.observable(ko.unwrap(this.settings.tableHeight) !== undefined ? ko.unwrap(this.settings.tableHeight) : 300);
    }

    private handleAutoUpdate() {
        if (this.pollTimer) {
            clearTimeout(this.pollTimer);
        }

        this.pollTimer = window.setTimeout(() => {
            this.refreshChartData();
        }, this.updateRate);
    }

    private async refreshChartData() {
        try {
            await this.setSignalsFromBuffer();
            await this.handleAutoUpdate();
        } catch (error) {
            this.connector.handleError(WfSignalsBufferViewerComponent)(error);
        }

    }

    private setSignalsFromBuffer() {
        let signalsFromBuffer = this.connector.getSignalsFromBuffer();

        if (this.sortingData()) {
            signalsFromBuffer = signalsFromBuffer.sort((a, b) => {
                var propertyName = this.sortingData().index === 0 ? 'key' : 'value';
                var x = a[propertyName]; var y = b[propertyName];
                return this.sortingData().asc ? ((x < y) ? -1 : ((x > y) ? 1 : 0)) : ((x > y) ? -1 : ((x < y) ? 1 : 0));
            });
        }

        this.signals(signalsFromBuffer);
    }

    protected async dispose() {
        super.dispose();
        if (this.pollTimer) {
            clearTimeout(this.pollTimer);
            this.pollTimer = null;
        }
    }
}

export = WfSignalsBufferViewerComponent;
