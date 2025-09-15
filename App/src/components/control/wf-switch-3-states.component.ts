import Connector = require("../../services/connector");
import VisualStatesService = require("../services/visual-states.service");
import Signal = require("../../services/models/signal");
import ComponentBaseModel = require("../component-base.model");

interface IWfSwitch3StatesParams extends IComponentBaseParams, IState, ICssClassStateParams, IWriteSecureParams {
    onText: string;
    offText: string;
    neutralText: string;
    onValue: number;
    offValue: number;
    neutralValue: number;
    cssClass: string;
    onIconClass: string;
    offIconClass: string;
    neutralIconClass: string;
    textStyle: string;
    signalName: string;
}

class WfSwitch3StatesComponent extends ComponentBaseModel<IWfSwitch3StatesParams> {
    private showWriteSecure: KnockoutObservable<boolean>;
    private writeSecureValues: KnockoutObservable<any[]>;
    private writeSecure: boolean;

    private writeToBuffer: boolean;
    private signalName: string;
    private textStyle: string;
    private neutralIconClass: string;
    private offIconClass: string;
    private onIconClass: string;
    private cssClass: string;
    private neutralValue: number;
    private offValue: number;
    private onValue: number;
    private neutralText: string;
    private offText: string;
    private onText: string;

    private statusCssClass: KnockoutComputed<string>;
    private states: VisualStatesService;

    constructor(params: IWfSwitch3StatesParams) {
        super(params)
        this.initializeWriteSecure();
        this.initializeStates();
        this.connector.getOnlineUpdates(); 
    }

    private initializeStates() {
        this.settings.stateSignalName1 = this.signalName;
        this.settings.maskSignal1 = this.onValue;
        this.settings.stateSignalName2 = this.signalName;
        this.settings.maskSignal2 = this.offValue;
        this.settings.stateSignalName3 = this.signalName;
        this.settings.maskSignal3 = this.neutralValue;

        this.states = new VisualStatesService(this.settings);
        this.statusCssClass = this.states.statusCssClass;
    }

    protected initializeSettings() {
        super.initializeSettings();
        this.onText = (ko.unwrap(this.settings.onText) || 'I4SCADA_ON').stringPlaceholderResolver(this.objectID);
        this.offText = (ko.unwrap(this.settings.offText) || 'I4SCADA_OFF').stringPlaceholderResolver(this.objectID);
        this.neutralText = (ko.unwrap(this.settings.neutralText) || 'I4SCADA_NEUTRAL').stringPlaceholderResolver(this.objectID);

        this.onValue = ko.unwrap(this.settings.onValue) !== undefined ? ko.unwrap(this.settings.onValue) : 1;
        this.offValue = ko.unwrap(this.settings.offValue) !== undefined ? ko.unwrap(this.settings.offValue) : 0;
        this.neutralValue = ko.unwrap(this.settings.neutralValue) !== undefined ? ko.unwrap(this.settings.neutralValue) : 2;

        this.cssClass = ko.unwrap(this.settings.cssClass) || 'wf-5x';

        this.onIconClass = ko.unwrap(this.settings.onIconClass) || '';
        this.offIconClass = ko.unwrap(this.settings.offIconClass) || '';
        this.neutralIconClass = ko.unwrap(this.settings.neutralIconClass) || '';
        this.textStyle = ko.unwrap(this.settings.textStyle) || '';
        this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
        this.writeToBuffer = ko.unwrap(this.settings.writeToBuffer) !== undefined ? ko.unwrap(this.settings.writeToBuffer) : false;
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

    private async writeInputValue(value) {
        if (this.isDisabled()) return;
        var values : SignalValue = {};

        values[this.signalName] = ko.unwrap(value);
        if (isNullOrUndefined(this.signalName)) return;

        if (this.writeToBuffer) {
            this.connector.writeSignalsToBuffer(values);
        }
        else if (this.writeSecure) {
            this.writeInputValueSecure(values[this.signalName]);
        }
        else {
            let result: any = await this.connector.writeSignals(values);
            if (!result.successful) {
                this.connector.error("Signal write", result.errorMessage);
            }
        }

    }

    protected async dispose() {
        await super.dispose();
        await this.states.unregisterSignals();
    }
}

export = WfSwitch3StatesComponent;
