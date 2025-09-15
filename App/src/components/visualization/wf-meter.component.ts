import Connector = require("../../services/connector");
import Signal = require("../../services/models/signal");
import ComponentBaseModel = require("../component-base.model");
import SignalArrayService = require("../services/signal-array.service");

interface IWfMeterParams extends IComponentBaseParams, ISignalArrayParams {
    label: string;
    unitLabel: boolean;
    staticUnitText: string;
    signalName: string;
}

class WfMeterComponent extends ComponentBaseModel<IWfMeterParams> {
    private signalArrayService: SignalArrayService;
    private label: string;
    private unitLabel: boolean;
    private staticUnitText: string;
    private signalName: string;
    private signalValue: KnockoutObservable<any>;
    private signal: Signal;

    private fullNumbers: KnockoutComputed<string>;
    private decimalNumbers: KnockoutComputed<string>;


    constructor(params: IWfMeterParams) {
        super(params);

        this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);

        this.label = (ko.unwrap(this.settings.label) || '').stringPlaceholderResolver(this.objectID);
        this.unitLabel = ko.unwrap(this.settings.unitLabel) !== undefined ? ko.unwrap(this.settings.unitLabel) : true;
        this.staticUnitText = (ko.unwrap(this.settings.staticUnitText) || '').stringPlaceholderResolver(this.objectID);
        
        this.signal = this.connector.getSignal(this.signalName);
        this.initializeSignalArray();

        if (this.signalArrayService.isArray) {
            this.signalValue = this.signalArrayService.signalValue;
        } else {
            this.signalValue = this.signal.value;
        }

        this.initializeComputeds();

        this.connector.getOnlineUpdates();//.fail(this.connector.handleError(self));
    }

    protected initializeSettings() {
        super.initializeSettings();
    }

    protected initializeComputeds() {
        this.fullNumbers = ko.computed(() => {
            if (this.signalValue() === undefined || this.signalValue() === null || this.signalValue() === "n/a") return "";

            const value = this.signalValue().toString().split(".")[0];

            if (value !== "n/a") {
                return value.toString().lpad("0", 7);
            }
        });

        this.decimalNumbers = ko.computed(() => {
            let value = this.signalValue();
            if (value === undefined || value === null || this.signalValue() === "n/a") return "";
            value = (Math.round(value * 100) / 100).toFixed(2).toString().split(".")[1];
            return value;
        });

    }

    private initializeSignalArray() {
        this.signalArrayService = new SignalArrayService(this.settings, this.signal);
    }

    protected async dispose() {
        await super.dispose();
        if (!this.signal)
            return;
        await this.connector.unregisterSignals(this.signal);
    }
}

export = WfMeterComponent;
