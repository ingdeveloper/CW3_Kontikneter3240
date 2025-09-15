import Signal = require("../../services/models/signal");
import ComponentBaseModel = require("../component-base.model");
import SignalArrayService = require("../services/signal-array.service");

interface IWfWatchdogParams extends IComponentBaseParams, ISignalArrayParams {
    period: number;
    signalName: string;
    onlineClass: string;
    offlineClass: string;

    onSignalTimeout: () => void;
    onSignalChanged: () => void;
}

class WfWatchdogComponent extends ComponentBaseModel<IWfWatchdogParams> {
    private signalArrayService: SignalArrayService;
    private timeout: number;
    private offlineClass: string;
    private onlineClass: string;
    private period: number;
    private signalName: string;
    private statusCssClass: KnockoutObservable<string>;
    private watchDog: KnockoutObservable<boolean>;
    private signalValue: KnockoutObservable<any> | string;
    private signal: Signal;

    private onSignalTimeout: () => void;
    private onSignalChanged: () => void;

    constructor(params: IWfWatchdogParams) {
        super(params);

        this.signal = this.connector.getSignal(this.signalName);
        this.initializeSignalArray();

        if (this.signalArrayService.isArray) {
            this.signalValue = this.signalArrayService.signalValue;
        } else {
            this.signalValue = this.signal.value;
        }

        this.handleTimer();
        this.initializeComputeds();
        this.connector.getOnlineUpdates();
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.timeout = null;
        this.watchDog = ko.observable(false);

        this.period = ko.unwrap(this.settings.period) || 2000;
        this.signalName = (ko.unwrap(this.settings.signalName) || "WFSInternal_AliveTimeStamp").stringPlaceholderResolver(this.objectID);
        this.tooltipText = (ko.unwrap(this.connector.translate(this.settings.tooltipText)()) || "").stringPlaceholderResolver(this.objectID);

        this.onlineClass = ko.unwrap(this.settings.onlineClass) || 'wf-watchdog-online wf wf-server';
        this.offlineClass = ko.unwrap(this.settings.offlineClass) || 'wf-watchdog-offline wf wf-server';
        this.statusCssClass = ko.observable('wf-watchdog-default wf wf-server');

        this.signalValue = '';

        this.onSignalTimeout = this.settings.onSignalTimeout || null;
        this.onSignalChanged = this.settings.onSignalChanged || null;
    }

    private initializeComputeds() {
        if (ko.isObservable(this.signalValue)) {
            ((this.signalValue) as KnockoutObservable<any>).subscribe(() => {
                this.handleTimer();
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

        if (this.onSignalChanged)
            this.onSignalChanged();

        this.timeout = window.setTimeout(() => {
            this.watchDog(true);
            this.statusCssClass(this.offlineClass);
            if (this.onSignalTimeout)
                this.onSignalTimeout();
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
