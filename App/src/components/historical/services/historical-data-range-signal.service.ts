
import Connector = require("../../../services/connector");
import Signal = require("../../../services/models/signal");
import { IHistoricalDataSignalUpdate } from "../models/historical-data-signal-update.model";

export class HistoricalDataRangeSignalService {

    private readonly connector = new Connector();
    private startSignals: Signal[] = [];
    private endSignals: Signal[] = [];

    private startSubscriptions: KnockoutSubscription[] = [];
    private endSubscriptions: KnockoutSubscription[] = [];

    private readonly startValueUpdates = ko.observable<IHistoricalDataSignalUpdate>();
    private readonly endValueUpdates = ko.observable<IHistoricalDataSignalUpdate>();

    public subscribeStartValues(callback: (newValue: IHistoricalDataSignalUpdate) => void, target?: any, event?: string) {
        return this.startValueUpdates.subscribe(callback, target, event);
    }

    public subscribeEndValues(callback: (newValue: IHistoricalDataSignalUpdate) => void, target?: any, event?: string) {
        return this.endValueUpdates.subscribe(callback, target, event);
    }

    public addStartSignal(name: string) {
        this.add(name, this.startSignals, this.startSubscriptions, this.startValueUpdates);
    }

    public removeAllStartSignals() {
        this.removeAll(this.startSignals, this.startSubscriptions);
        this.startSignals = [];
        this.startSubscriptions = [];
    }

    public addEndSignal(name: string) {
        this.add(name, this.endSignals, this.endSubscriptions, this.endValueUpdates);
    }

    public removeAllEndSignals() {
        this.removeAll(this.endSignals, this.endSubscriptions);
        this.endSignals = [];
        this.endSubscriptions = [];
    }

    private add(name: string, signals: Signal[], subscriptions: KnockoutSubscription[], updater: KnockoutObservable<IHistoricalDataSignalUpdate>) {
        let signal = _.find(signals, item => item.signalName() === name);
        if (!signal) {
            signal = this.connector.getSignal(name);
            signals.push(signal);
            this.connector.getOnlineUpdates();
            this.addSubscription(signal, subscriptions, updater);
        }
        updater({
            name: signal.signalName(),
            value: signal.value()
        });
    }

    private removeAll(signals: Signal[], subscriptions: KnockoutSubscription[]) {
        for (const subscription of subscriptions) {
            subscription.dispose();
        }
        this.connector.unregisterSignals(...signals);
    }

    private addSubscription(signal: Signal, subscriptions: KnockoutSubscription[], updater: KnockoutObservable<IHistoricalDataSignalUpdate>) {
        const subscription = signal.value.subscribe(() => {
            updater({
                name: signal.signalName(),
                value: signal.value()
            });
        });
        subscriptions.push(subscription);
    }

    public dispose() {
        this.removeAllStartSignals();
        this.removeAllEndSignals();
    }

}
