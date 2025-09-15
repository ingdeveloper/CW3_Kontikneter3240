import Connector = require("../../services/connector");
import Signal = require("../../services/models/signal");
import ComponentBaseModel = require("../component-base.model");
import SignalArrayService = require("../services/signal-array.service");

interface IWfSwitchParams extends IComponentBaseParams, IWriteSecureParams, ISignalArrayParams {
    btnGroupJustified: boolean;
    onValue: any;
    offValue: any;
    onLabelText: string;
    offLabelText: string;
    onIconClass: string;
    offIconClass: string;
    defaultCssClass: string;
    activeCssClass: string;
    onCssClass: string;
    offCssClass: string;
    buttonStyle: string;
    iconStyle: string;
    textStyle: string;
    signalName: string;
    isBufferedClass: string;
    writeToBuffer: boolean;
}

class WfSwitchComponent extends ComponentBaseModel<IWfSwitchParams> {
    private signalArrayService: SignalArrayService;
    private showWriteSecure: KnockoutObservable<boolean>;
    private writeSecureValues: KnockoutObservable<any[]>;
    private writeSecure: boolean;

    private currentState: KnockoutComputed<"state-off" | "state-on" | "none">;
    private isBuffered: KnockoutComputed<boolean>;
    private writeToBuffer: boolean;
    private isBufferedClass: string;
    private signal: Signal;
    private signalValue: KnockoutObservable<any> | string;
    private signalName: string;
    private textStyle: string;
    private iconStyle: string;
    private buttonStyle: string;
    private offCssClass: KnockoutObservable<string>;
    private onCssClass: KnockoutObservable<string>;
    private activeCssClass: string;
    private defaultCssClass: string;
    private offIconClass: string;
    private onIconClass: string;
    private offLabelText: string;
    private onLabelText: string;
    private offValue: any;
    private onValue: any;
    private btnGroupJustified: boolean;

    constructor(params: IWfSwitchParams) {
        super(params);
        
        this.signal = this.connector.getSignal(this.signalName);
        this.initializeSignalArray();

        if (this.signalArrayService.isArray) {
            this.signalValue = this.signalArrayService.signalValue;
        } else {
            this.signalValue = this.signal.value;
        }

        this.initializeWriteSecure();
        this.initializeComputeds();
        this.connector.getOnlineUpdates(); 
    }

    protected initializeSettings() {
        super.initializeSettings();
        this.tooltipText = (ko.unwrap(this.connector.translate(this.settings.tooltipText)()) || "").stringPlaceholderResolver(this.objectID);
        this.btnGroupJustified = ko.unwrap(this.settings.btnGroupJustified) ? ko.unwrap(this.settings.btnGroupJustified) : true;

        this.onValue = ko.unwrap(this.settings.onValue) !== undefined ? ko.unwrap(this.settings.onValue) : 1;
        this.offValue = ko.unwrap(this.settings.offValue) !== undefined ? ko.unwrap(this.settings.offValue) : 0;

        this.onLabelText = (ko.unwrap(this.settings.onLabelText) ? ko.unwrap(this.settings.onLabelText) : 'I4SCADA_ON').stringPlaceholderResolver(this.objectID);
        this.offLabelText = (ko.unwrap(this.settings.offLabelText) ? ko.unwrap(this.settings.offLabelText) : 'I4SCADA_OFF').stringPlaceholderResolver(this.objectID);

        this.onIconClass = ko.unwrap(this.settings.onIconClass) ? ko.unwrap(this.settings.onIconClass) : 'wf wf-light-bulb';
        this.offIconClass = ko.unwrap(this.settings.offIconClass) ? ko.unwrap(this.settings.offIconClass) : 'wf wf-light-bulb-o';

        this.defaultCssClass = ko.unwrap(this.settings.defaultCssClass) ? ko.unwrap(this.settings.defaultCssClass) : 'btn-default';
        this.activeCssClass = ko.unwrap(this.settings.activeCssClass) ? ko.unwrap(this.settings.activeCssClass) : 'btn-primary';

        this.onCssClass = ko.observable(ko.unwrap(this.settings.onCssClass) ? ko.unwrap(this.settings.onCssClass) : '');
        this.offCssClass = ko.observable(ko.unwrap(this.settings.offCssClass) ? ko.unwrap(this.settings.offCssClass) : '');

        this.buttonStyle = ko.unwrap(this.settings.buttonStyle) || '';
        this.iconStyle = ko.unwrap(this.settings.iconStyle) || '';
        this.textStyle = ko.unwrap(this.settings.textStyle) || '';

        this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
        this.signalValue = '';

        this.isBufferedClass = ko.unwrap(this.settings.isBufferedClass) || "btn-info";
        this.writeToBuffer = ko.unwrap(this.settings.writeToBuffer) !== undefined ? ko.unwrap(this.settings.writeToBuffer) : false;
    }

    private initializeComputeds() {

        this.isBuffered = ko.computed(() => {
            if (!this.writeToBuffer)
                return false;
            return this.connector.existSignalInBuffer(this.signalName) && !this.connector.signalBufferIsEmpty();
        }, this);

        this.currentState = ko.computed(() => {

            var currentValue = ko.unwrap(this.signalValue) + "";
            if (this.isBuffered()) {
                var tmp = this.connector.readSignalsFromBuffer([this.signalName]);
                currentValue = tmp.length > 0 ? tmp[0] + "" : "";
            }

            if (currentValue === ko.unwrap(this.offValue) + "") {
                this.offCssClass(this.isBuffered() ? this.isBufferedClass : this.activeCssClass);
                this.onCssClass(this.defaultCssClass);
                return 'state-off';

            }
            else if (currentValue === ko.unwrap(this.onValue) + "") {
                this.offCssClass(this.defaultCssClass);
                this.onCssClass(this.isBuffered() ? this.isBufferedClass : this.activeCssClass);
                return 'state-on';
            }
            else {
                this.offCssClass(this.defaultCssClass);
                this.onCssClass(this.defaultCssClass);
                return 'none';
            }
        });
    }

    private initializeWriteSecure() {
        this.writeSecure = ko.unwrap(this.settings.writeSecure) !== undefined ? ko.unwrap(this.settings.writeSecure) : false;
        this.writeSecureValues = ko.observable();
        this.showWriteSecure = ko.observable(false);
    }

    private initializeSignalArray() {
        this.signalArrayService = new SignalArrayService(this.settings, this.signal);
    }

    private async writeInputValue(signalName, value) {
        if (this.isDisabled()) return;
        var values : SignalValue = {};


        if (!this.signalName) {
            return null;
        }

        values[signalName] = ko.unwrap(value);

        if (this.signalArrayService.isArray) {
            values[this.signalName] = this.signalArrayService.getWriteValues(values[this.signalName]);
        }

        if (this.writeToBuffer)
            this.connector.writeSignalsToBuffer(values);
        else if (this.writeSecure)
            this.writeInputValueSecure(values[this.signalName]);
        else {
            const result = await this.connector.writeSignals(values);
            if (!result.successful) {
                this.connector.error("Signal write", result.errorMessage);
            }
        }

    }

    private async writeOnValue() {
        await this.writeInputValue(this.signalName, this.onValue);
    }

    private async writeOffValue() {
        await this.writeInputValue(this.signalName, this.offValue);
    }

    private writeInputValueSecure(value: any) {
        this.writeSecureValues([value]);
        this.showWriteSecure(true);
    }

    protected async dispose() {
        await super.dispose();
        if (!this.signal)
            return;
        await this.connector.unregisterSignals(this.signal);
    }
}

export = WfSwitchComponent;
