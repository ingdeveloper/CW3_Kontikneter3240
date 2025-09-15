import Connector = require("../../services/connector");
import StatesService = require("../services/states.service");
import ValueConversionsService = require("../services/value-conversions.service");
import Signal = require("../../services/models/signal");
import ComponentBaseModel = require("../component-base.model");
import SignalArrayService = require("../services/signal-array.service");

interface IWfRotationContainerParams extends IComponentBaseParams, ISignalArrayParams {
    minRange: number;
    maxRange: number;
    signalName: string;
    endAngle: number;
    startAngle: number;
}

class WfRotationContainerComponent extends ComponentBaseModel<IWfRotationContainerParams> {
    private signalArrayService: SignalArrayService;
    private startAngle: number;
    private endAngle: number;
    private needleAngle: KnockoutComputed<string> | KnockoutObservable<number>;
    private currentSignalValue: KnockoutObservable<any>;
    private signal: Signal;

    private signalName: string;
    private maxRange: number;
    private minRange: number;

    private valueConversionsService: ValueConversionsService;

    constructor(params: IWfRotationContainerParams) {
        super(params)
        this.initializeComputeds();

        this.signal = this.connector.getSignal(this.signalName);
        this.initializeSignalArray();

        if (this.signalName) {
            if (this.signalArrayService.isArray) {
                this.currentSignalValue = this.signalArrayService.signalValue;
            } else {
                this.currentSignalValue = this.signal.value;
            }
        }

        this.connector.getOnlineUpdates(); 
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.valueConversionsService = new ValueConversionsService();

        this.minRange = ko.unwrap(this.settings.minRange) ? ko.unwrap(this.settings.minRange) : 0;
        this.maxRange = ko.unwrap(this.settings.maxRange) ? ko.unwrap(this.settings.maxRange) : 100;

        this.startAngle = ko.unwrap(this.settings.startAngle) !== undefined ? ko.unwrap(this.settings.startAngle) : 0;
        this.endAngle = ko.unwrap(this.settings.endAngle) ? ko.unwrap(this.settings.endAngle) : 360;

        this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
    }

    private initializeComputeds() {
        // Stop here and return if no signalName was configured
        if (!this.signalName) {
            this.needleAngle = ko.observable(0);
            return;
        }

        // Calc and return the deg value
        this.needleAngle = ko.pureComputed(() => {
            const value = this.currentSignalValue();
            if (value > this.maxRange) {
                return 'rotate(' + this.endAngle + 'deg)';
            }
            if (value < this.minRange) {
                return 'rotate(' + this.startAngle + 'deg)';
            }
            const degree = this.valueConversionsService.linearScale(this.currentSignalValue(), this.minRange, this.maxRange, this.startAngle, this.endAngle);
            return 'rotate(' + degree + 'deg)';

        });
    }

    private initializeSignalArray() {
        this.signalArrayService = new SignalArrayService(this.settings, this.signal);
    }

    protected async dispose() {
        await super.dispose();
        if (this.signal)
            await this.connector.unregisterSignals(this.signal);
    }
}

export = WfRotationContainerComponent;
