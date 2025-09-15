import Connector = require("../../services/connector");
import Signal = require("../../services/models/signal");
import VisualStatesService = require("../services/visual-states.service");
import ComponentBaseModel = require("../component-base.model");

interface IWfBufferButtonParams extends IComponentBaseParams, ICssClassStateParams, IState, IWriteSecureParams {
    buttonText: string;
    cssClass: string;
    iconClass: string;
    buttonStyle: string;
    iconStyle: string;
    signalName: string;
    textStyle: string;
    clearBuffer: boolean;
}

class WfBufferButtonComponent extends ComponentBaseModel<IWfBufferButtonParams> {
    private showWriteSecure: KnockoutObservable<boolean>;
    private writeSecureValues: KnockoutObservable<any[]>;
    private writeSecure: boolean;

    private clearBuffer: boolean;
    private textStyle: string;
    private iconStyle: string;
    private buttonStyle: string;
    private iconClass: string;
    private cssClass: string;
    private buttonText: string;

    private statusCssClass: KnockoutComputed<string>;
    private states: VisualStatesService;

    constructor(params: IWfBufferButtonParams) {
        super(params)
        this.initializeWriteSecure();
        this.initializeStates();
        this.connector.getOnlineUpdates(); 
    }

    private initializeStates() {
        this.states = new VisualStatesService(this.settings);
        this.statusCssClass = this.states.statusCssClass;
    }

    protected initializeSettings() {
        super.initializeSettings();
        this.buttonText = (ko.unwrap(this.settings.buttonText) || '').stringPlaceholderResolver(this.objectID);
        this.cssClass = ko.unwrap(this.settings.cssClass) || '';
        this.iconClass = ko.unwrap(this.settings.iconClass) || '';
        this.buttonStyle = ko.unwrap(this.settings.buttonStyle) || '';
        this.iconStyle = ko.unwrap(this.settings.iconStyle) || '';
        this.textStyle = ko.unwrap(this.settings.textStyle) || '';
        this.clearBuffer = ko.unwrap(this.settings.clearBuffer) !== undefined ? ko.unwrap(this.settings.clearBuffer) : false;
    }

    private initializeWriteSecure() {
        this.writeSecure = ko.unwrap(this.settings.writeSecure) !== undefined ? ko.unwrap(this.settings.writeSecure) : false;
        this.writeSecureValues = ko.observable();
        this.showWriteSecure = ko.observable(false);
    }

    private writeFromBuffer() {
        if (this.isDisabled()) return;

        if (this.writeSecure)
            this.showWriteSecure(true);
        else if (this.clearBuffer)
            this.connector.clearSignalBuffer()
        else
            this.connector.writeSignalsFromBuffer();
    }

    protected async dispose() {
        await super.dispose();
        this.states.unregisterSignals();
    }
}

export = WfBufferButtonComponent;
