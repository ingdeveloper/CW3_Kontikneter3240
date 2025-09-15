import Connector = require("../../services/connector");
import VisualStatesService = require("../services/visual-states.service");
import Signal = require("../../services/models/signal");

import ComponentBaseModel = require("../component-base.model");

interface IWfToggleButtonParams extends IComponentBaseParams, IState, ICssClassStateParams, IWriteSecureParams {
    buttonText: string;
    signalName: string;
    toggleValue1: any;
    toggleValue2: any;
    cssClass: string;
    iconClass: string;
    buttonStyle: string;
    iconStyle: string;
    textStyle: string;
    isBufferedClass: string;
}

class WfToggleButtonComponent extends ComponentBaseModel<IWfToggleButtonParams> {
    private showWriteSecure: KnockoutObservable<boolean>;
    private writeSecureValues: KnockoutObservable<any[]>;
    private writeSecure: boolean;

    private displayClassNames: KnockoutComputed<string>;
    private isBuffered: KnockoutComputed<boolean>;
    private isBufferedClass: string;
    private writeToBuffer: boolean;
    private textStyle: string;
    private iconStyle: string;
    private buttonStyle: string;
    private iconClass: string;
    private cssClass: string;
    private toggleValue2: any;
    private toggleValue1: any;
    private signalName: string;
    private buttonText: string;

    private statusCssClass: KnockoutComputed<string>;
    private states: VisualStatesService;


    constructor(params: IWfToggleButtonParams) {
        super(params)
        this.initializeWriteSecure();
        this.initializeStates();
        this.initializeComputeds();
        // Stop here and return if no signalName was configured
        if (!ko.unwrap(this.signalName)) {
            return null;
        }
        this.connector.getOnlineUpdates(); 
    }

    private initializeStates() {
        this.states = new VisualStatesService(this.settings);
        this.statusCssClass = this.states.statusCssClass;
    }

    protected initializeSettings() {
        super.initializeSettings();
        this.buttonText = (ko.unwrap(this.settings.buttonText) || '').stringPlaceholderResolver(this.objectID);
        this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);

        this.toggleValue1 = ko.unwrap(this.settings.toggleValue1) !== undefined ? ko.unwrap(this.settings.toggleValue1) : 0;
        this.toggleValue2 = ko.unwrap(this.settings.toggleValue2) !== undefined ? ko.unwrap(this.settings.toggleValue2) : 1;

        this.cssClass = ko.unwrap(this.settings.cssClass) || 'btn-default';
        this.iconClass = ko.unwrap(this.settings.iconClass) || '';
        this.buttonStyle = ko.unwrap(this.settings.buttonStyle) || '';
        this.iconStyle = ko.unwrap(this.settings.iconStyle) || '';
        this.textStyle = ko.unwrap(this.settings.textStyle) || '';

        this.writeToBuffer = ko.unwrap(this.settings.writeToBuffer) !== undefined ? ko.unwrap(this.settings.writeToBuffer) : false;
        this.isBufferedClass = ko.unwrap(this.settings.isBufferedClass) || "btn-info";
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

    private initializeWriteSecure() {
        this.writeSecure = ko.unwrap(this.settings.writeSecure) !== undefined ? ko.unwrap(this.settings.writeSecure) : false;
        this.writeSecureValues = ko.observable();
        this.showWriteSecure = ko.observable(false);
    }

    private writeInputValueSecure(value: any) {
        this.writeSecureValues([value]);
        this.showWriteSecure(true);
    }

    private async writeInputValue(value, isNegative = false) {
        if (this.isDisabled()) return;
        var values : SignalValue = {};


        values[this.signalName] = ko.unwrap(value);

        if (isNullOrUndefined(this.signalName)) return;

        if (this.writeToBuffer)
            this.connector.writeSignalsToBuffer(values);
        else if (this.writeSecure) {
            this.writeInputValueSecure(values[this.signalName]);
        }
        else {
            try {
                const result = await this.connector.writeSignals(values);
                if (!result.successful) {
                    this.connector.error("Signal write", result.errorMessage);
                }
            } catch (error) {
                this.connector.handleError(WfToggleButtonComponent)(error)
            }
        }
    }

    private async toggleSignal() {
        if (!this.signalName) return;

        if (this.isBuffered()) {
            var signals = this.connector.readSignalsFromBuffer([this.signalName]);
            var valueToWrite = signals[0] == this.toggleValue1 || signals.length === 0 ? this.toggleValue2 : this.toggleValue1;
            this.writeInputValue(valueToWrite);
        } else {
            try {
                const signals = await this.connector.readSignals([this.signalName])
                if (signals[0].Result === 0 || signals) {
                    var valueToWrite = signals[0].Value == this.toggleValue1 ? this.toggleValue2 : this.toggleValue1;
                    this.writeInputValue(valueToWrite);
                } else {
                    this.connector.warn(this, signals[0].Result.toString());
                }
            } catch (error) {
                this.connector.handleError(WfToggleButtonComponent)(error)
            }
        }

    }

    protected async dispose() {
        await super.dispose();
        await this.states.unregisterSignals();
    }
}

export = WfToggleButtonComponent;
