
import Connector = require("../services/connector");
import SecuredService = require("../components/services/secured.service");
import Signal = require("../services/models/signal");

interface ICustomValueComponentParams {
    objectID: KnockoutValueOrObservable<string>;
    projectAuthorization: KnockoutValueOrObservable<string>;
    format: KnockoutValueOrObservable<string>;
    isAlphanumeric: KnockoutValueOrObservable<boolean>;
    unitLabel: KnockoutValueOrObservable<boolean>;
    signalName: KnockoutValueOrObservable<string>;
}

class CustomValueComponent {
    private signal: Signal;
    private signalValue: KnockoutValueOrObservable<any>;
    private signalName: string;
    private unitLabel: boolean;
    private isAlphanumeric: boolean;
    private format: string;
    private hasAuthorization: KnockoutComputed<boolean>;
    private securedService: SecuredService;
    private projectAuthorization: string;
    private objectID: string;
    private settings: ICustomValueComponentParams;
    private connector: Connector = new Connector();

    constructor(params: ICustomValueComponentParams) {

        this.settings = params;
        this.objectID = ko.unwrap(this.settings.objectID);

        this.projectAuthorization = (ko.unwrap(params.projectAuthorization) || "").stringPlaceholderResolver(this.objectID);
        this.securedService = new SecuredService(this.projectAuthorization);
        this.hasAuthorization = this.securedService.hasAuthorization;


        this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[00]";
        this.isAlphanumeric = ko.unwrap(this.settings.isAlphanumeric) !== undefined ? ko.unwrap(this.settings.isAlphanumeric) : false;
        this.unitLabel = ko.unwrap(this.settings.unitLabel) !== undefined ? ko.unwrap(this.settings.unitLabel) : false;

        this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);

        this.signalValue = '';

        // Stop here and return if no signalName was configured
        if (!this.signalName) {
            return null;
        }

        this.signal = this.connector.getSignal(this.signalName);

        if (this.isAlphanumeric) {
            this.signalValue = this.signal.value;
        } else {
            this.signalValue = this.signal.value.extend({ numeralNumber: this.format });
        }

        this.connector.getOnlineUpdates();
    }

    public dispose() {
        if (!this.signal)
            return;
        return this.connector.unregisterSignals(this.signal);
    };

}

export = CustomValueComponent;