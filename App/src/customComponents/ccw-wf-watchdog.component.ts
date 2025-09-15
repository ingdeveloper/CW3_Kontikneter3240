import Signal = require("src/services/models/signal");
import ComponentBaseModel = require("src/components/component-base.model");
import SignalArrayService = require("src/components/services/signal-array.service");

interface IWfWatchdogParams extends IComponentBaseParams, ISignalArrayParams {
    period: number;
    signalName: string;
    onlineClass: string;
    onlineClass2: string;
    offlineClass: string;
}

class WfWatchdogComponent extends ComponentBaseModel<IWfWatchdogParams> {
    private signalArrayService: SignalArrayService;
    private timeout: number;
    private offlineClass: string;
    private onlineClass: string;
    private onlineClass2: string;
    private toggleClass: boolean;
    private period: number;
    private signalName: string;
    private statusCssClass: KnockoutObservable<string>;
    private watchDog: KnockoutObservable<boolean>;
    private signalValue: KnockoutObservable<any> | string;
    private signal: Signal;

    constructor(params: IWfWatchdogParams) {
        super(params);

        // Stop here if no signalName was configured
        if (!this.signalName) {
            return;
        }

        this.signal = this.connector.getSignal(this.signalName);
        this.initializeSignalArray();


        if (this.signalArrayService.isArray) {
            this.signalValue = this.signalArrayService.signalValue;
        } else {
            this.signalValue = this.signal.value;
        }

        this.handleTimer();
        this.initializeComputeds();



        this.connector.getOnlineUpdates(); //.fail(this.connector.handleError(this));

    }

    protected initializeSettings() {
        super.initializeSettings();

        this.timeout = null;
        this.watchDog = ko.observable(false);

        this.period = ko.unwrap(this.settings.period) || 2000;
        this.signalName = (ko.unwrap(this.settings.signalName) || "WFSInternal_AliveTimeStamp").stringPlaceholderResolver(this.objectID);
        this.tooltipText = (ko.unwrap(this.connector.translate(this.settings.tooltipText)()) || "").stringPlaceholderResolver(this.objectID);

        this.onlineClass = ko.unwrap(this.settings.onlineClass) || 'wf-watchdog-online wf wf-server';
        this.onlineClass2 = ko.unwrap(this.settings.onlineClass2) || this.onlineClass.replace("wf-watchdog-online","ccw-color-dark-green");  //wf-watchdog-onlie ist grüne Farbe, diesen String ersetzen durch die neu Farbe
        this.offlineClass = ko.unwrap(this.settings.offlineClass) || 'wf-watchdog-offline wf wf-server';
        this.statusCssClass = ko.observable('wf-watchdog-default wf wf-server');

        this.signalValue = '';

    }

    private initializeComputeds() {
        if (ko.isObservable(this.signalValue)) {
            ((this.signalValue) as KnockoutObservable<any>).subscribe(() => {
                this.handleTimer();
                // Zwei Klassen bei Signaländerung togglen
                // console.log("ccw-wf-watchdog");
                this.toggleClass = !this.toggleClass;
                if (this.toggleClass) {
                    this.statusCssClass(this.onlineClass2);
                } else {
                    this.statusCssClass(this.onlineClass);
                }
            });
        }
    }

    private initializeSignalArray() {
        this.signalArrayService = new SignalArrayService(this.settings, this.signal);
    }

    private handleTimer() {
        clearTimeout(this.timeout);

        this.watchDog(false);
        this.statusCssClass(this.onlineClass);

        this.timeout = window.setTimeout(() => {
            this.watchDog(true);
            this.statusCssClass(this.offlineClass);
        }, this.period);
    }

    protected async dispose() {
        await super.dispose();
        if (!this.signal)
            return;
        await this.connector.unregisterSignals(this.signal);
    }
}

export = WfWatchdogComponent;
