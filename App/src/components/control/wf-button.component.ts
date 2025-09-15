import Connector = require("../../services/connector");
import Signal = require("../../services/models/signal");
import VisualStatesService = require("../services/visual-states.service");
import ComponentBaseModel = require("../component-base.model");
import SignalArrayService = require("../services/signal-array.service");

interface IWfButtonParams extends IComponentBaseParams, ICssClassStateParams, IState, IWriteSecureParams, ISignalArrayParams {
    buttonText: string;
    signalPrefix: string;
    signalSufix: string;
    isTipModeEnabled: boolean;
    minValue: number;
    maxValue: number;
    resetOnOverflow: boolean;
    writeValue: number;
    writeUpValue: number;
    writeUpDelay: number;
    incrementMode: boolean;
    iconClass: string;
    buttonStyle: string;
    iconStyle: string;
    signalName: string;
    cssClass: string;
    textStyle: string;
    isBufferedClass: string;
    writeItems: IWriteItem[];
}

interface IWriteItem {
    name: string,
    value: any
}

class WfButtonComponent extends ComponentBaseModel<IWfButtonParams> {
    private signalArrayService: SignalArrayService;
    private showWriteSecure: KnockoutObservable<boolean>;
    private writeSecureValues: KnockoutObservable<any[]>;
    private writeSecure: boolean;

    private states: VisualStatesService;
    private displayClassNames: KnockoutComputed<string>;
    private isBuffered: KnockoutComputed<boolean>;
    private isBufferedClass: string;
    private writeToBuffer: boolean;
    private textStyle: string;
    private iconStyle: string;
    private buttonStyle: string;
    private iconClass: string;
    private cssClass: string;
    private incrementMode: boolean;
    private writeUpDelay: number;
    private writeUpValue: number;
    private writeValue: number;
    private resetOnOverflow: boolean;
    private maxValue: number;
    private minValue: number;
    private isTipModeEnabled: boolean;
    private signalName: string;
    private signalSufix: string;
    private signalPrefix: string;
    private buttonText: string;
    private statusCssClass: KnockoutComputed<string>;
    private tipModeState: KnockoutComputed<string>;
    private writeItems: IWriteItem[];

    private signalNames: string[];
    protected signal: Signal;

    public isRunning = ko.observable(false);
    public isPressed = false;

    constructor(params: IWfButtonParams) {
        super(params)
        this.initializeWriteSecure();
        this.initializeStates();
        this.initializeComputeds();
        // Stop here and return if no signalName was configured
        if (!ko.unwrap(this.signalName)) {
            return null;
        }

        this.signal = this.connector.getSignal(this.signalName);
        this.initializeSignalArray();
        this.connector.getOnlineUpdates();
    }

    private initializeStates() {
        this.states = new VisualStatesService(this.settings);
        this.statusCssClass = this.states.statusCssClass;
        this.tipModeState = ko.computed(()=>{
            return this.isRunning() ? 'shadow-pulse': '';
        })
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.buttonText = (ko.unwrap(this.settings.buttonText) || '').stringPlaceholderResolver(this.objectID);

        this.signalPrefix = ko.unwrap(this.settings.signalPrefix) !== undefined ? ko.unwrap(this.settings.signalPrefix) : "";
        this.signalSufix = ko.unwrap(this.settings.signalSufix) !== undefined ? ko.unwrap(this.settings.signalSufix) : "";

        this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);

        this.isTipModeEnabled = ko.unwrap(this.settings.isTipModeEnabled) ? ko.unwrap(this.settings.isTipModeEnabled) : false;

        this.minValue = ko.unwrap(this.settings.minValue) !== undefined ? ko.unwrap(this.settings.minValue) : 0;
        this.maxValue = ko.unwrap(this.settings.maxValue) !== undefined ? ko.unwrap(this.settings.maxValue) : 100;
        this.resetOnOverflow = ko.unwrap(this.settings.resetOnOverflow) !== undefined ? ko.unwrap(this.settings.resetOnOverflow) : false;

        this.writeValue = ko.unwrap(this.settings.writeValue) !== undefined ? ko.unwrap(this.settings.writeValue) : 1;
        this.writeUpValue = ko.unwrap(this.settings.writeUpValue) !== undefined ? ko.unwrap(this.settings.writeUpValue) : 0;
        this.writeUpDelay = ko.unwrap(this.settings.writeUpDelay) !== undefined ? ko.unwrap(this.settings.writeUpDelay) : 500;
        this.incrementMode = ko.unwrap(this.settings.incrementMode) !== undefined ? ko.unwrap(this.settings.incrementMode) : false;

        this.cssClass = ko.unwrap(this.settings.cssClass) || 'btn-default';
        this.iconClass = ko.unwrap(this.settings.iconClass) || '';
        this.buttonStyle = `${ko.unwrap(this.settings.buttonStyle) || ""}; -webkit-touch-callout: none !important; -webkit-user-select: none !important; -moz-user-select: none !important; -ms-user-select: none !important; user-select: none !important;`;
        this.iconStyle = ko.unwrap(this.settings.iconStyle) || '';
        this.textStyle = ko.unwrap(this.settings.textStyle) || '';

        this.writeToBuffer = ko.unwrap(this.settings.writeToBuffer) !== undefined ? ko.unwrap(this.settings.writeToBuffer) : false;
        this.isBufferedClass = ko.unwrap(this.settings.isBufferedClass) || "btn-info";

        this.initializeWriteItems();
    }

    private initializeWriteItems() {
        this.signalNames = [];
        if (this.signalName)
            this.signalNames.push(this.signalName);
        this.writeItems = ko.unwrap(this.settings.writeItems) || [] as IWriteItem[];

        if (!_.any(this.writeItems)) return;

        for (let item of this.writeItems) {
            item.name = (ko.unwrap(item.name) || '').stringPlaceholderResolver(this.objectID);
            this.signalNames.push(item.name);
            item.value = ko.unwrap(item.value) !== undefined ? ko.unwrap(item.value) : 1;
        }
        if (this.signalName)
            this.writeItems.unshift({ name: this.signalName, value: this.writeValue });
    }

    private initializeWriteSecure() {
        this.writeSecure = ko.unwrap(this.settings.writeSecure) !== undefined ? ko.unwrap(this.settings.writeSecure) : false;
        this.writeSecureValues = ko.observable();
        this.showWriteSecure = ko.observable(false);
    }

    private initializeComputeds() {
        this.isBuffered = ko.computed(() => {
            if (!this.writeToBuffer)
                return false;

            return this.connector.existSignalInBuffer(this.signalName) && !this.connector.signalBufferIsEmpty();
        });

        this.displayClassNames = ko.computed(() => {
            return this.isBuffered() == true ? this.isBufferedClass : this.cssClass;
        });
    }

    private initializeSignalArray() {
        this.signalArrayService = new SignalArrayService(this.settings, this.signal);
    }

    private writeInputValueSecure(values: any[]) {
        this.writeSecureValues(values);
        this.showWriteSecure(true);
    }

    private async writeInputValue(value: any, isNegative = false) {
        var values: SignalValue = {};

        var writeValue = ko.unwrap(value);

        if (writeValue < this.minValue)
            writeValue = this.incrementMode && this.resetOnOverflow ?
                isNegative ? this.maxValue : this.minValue :
                this.minValue;

        if (writeValue > this.maxValue)
            writeValue = this.incrementMode && this.resetOnOverflow ?
                isNegative ? this.maxValue : this.minValue :
                this.maxValue;

        values[this.signalName] = writeValue;

        if (isNullOrUndefined(this.signalName)) return;

        if (this.signalArrayService.isArray) {
            values[this.signalName] = this.signalArrayService.getWriteValues(values[this.signalName]);
        }

        if (this.writeToBuffer) {
            this.connector.writeSignalsToBuffer(values);
        }
        else if (this.writeSecure)
            this.writeInputValueSecure([values[this.signalName]]);
        else {
            try {
                const result = await this.connector.writeSignals(values);
                if (!result.successful) {
                    this.connector.error("Signal write", result.errorMessage);
                }
            } catch (error) {
                this.connector.handleError(WfButtonComponent)(error)
            }
        }
    }

    private async writeMultipleInputValue() {
        var values: SignalValue = {};

        const writeItems = this.writeItems;

        for (let item of writeItems) {
            values[item.name] = item.value;
        }

        if (this.resetOnOverflow) {
            this.connector.warn(WfButtonComponent, "resetOnOverflow is not supported if you define writeItems");
            return;
        }

        if (this.incrementMode) {
            this.connector.warn(WfButtonComponent, "incrementMode is not supported if you define writeItems");
            return;
        }

        if (ko.unwrap(this.settings.isArray)) {
            //  values[this.signalName] = this.signalArrayService.getWriteValues(values[this.signalName]);
            this.connector.warn(WfButtonComponent, "isArray is not supported if you define writeItems");
            return;
        }

        if (this.writeToBuffer) {
            this.connector.writeSignalsToBuffer(values);
        }
        else if (this.writeSecure) {
            this.writeInputValueSecure(writeItems.map((x) => { return x.value }));
        }
        else {
            try {
                const result = await this.connector.writeSignals(values);
                if (!result.successful) {
                    this.connector.error("Signal write", result.errorMessage);
                }
            } catch (error) {
                this.connector.handleError(WfButtonComponent)(error)
            }
        }
    }

    public async writeMouseDownValue(data, event) {
        if (this.isDisabled()) return;
        this.isPressed = true;
        event.preventDefault();

        if (!_.any(this.writeItems) && !this.incrementMode) {
            await this.writeInputValue(this.writeValue);
        } else if (this.incrementMode) {
            await this.incrementSignal(this.writeValue);
        } else {
            await this.writeMultipleInputValue();
        }
        this.isRunning(true && this.isTipModeEnabled);
    }

    public writeMouseUpValue(data, event) {
        this.isPressed = false;
        if (this.isDisabled()) return;
        if (!this.isTipModeEnabled) return;
        event.preventDefault();
        this.writeMouseUp();
    }

    public mouseleave(data, event) {
        if (this.isDisabled()) return;
        if (!this.isTipModeEnabled) return;
        event.preventDefault();
        if (this.isPressed === true) {
            this.writeMouseUp();
        }
    }

    private writeMouseUp() {
        this.isPressed = false;
        if (this.incrementMode) {
            _.delay(async () => {
                this.incrementSignal(this.writeUpValue);
                this.isRunning(false);
            }, this.writeUpDelay);
        }
        else {
            _.delay(async () => {
                this.writeInputValue(this.writeUpValue);
                this.isRunning(false);
            }, this.writeUpDelay);
        }
    }

    private async incrementSignal(value: any) {
        if (!this.signalName) return;

        try {
            const signals = await this.connector.readSignals([this.signalName]);
            if (signals[0].Result === 0 || signals) {
                var valueToWrite = signals[0].Value + (value);
                this.writeInputValue(valueToWrite, value < 0);
            } else {
                this.connector.warn(this, signals[0].Result.toString());
            }
        } catch (error) {
            this.connector.handleError(WfButtonComponent)(error)
        }
    }

    protected async dispose() {
        await super.dispose();
        this.states.unregisterSignals();
        if (!this.signal)
            return;
        await this.connector.unregisterSignals(this.signal);
    }
}

export = WfButtonComponent;
