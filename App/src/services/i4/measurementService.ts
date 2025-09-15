import ProxyClient = require("./proxyClient");
import Logger = require("../logger");
import Subscription = require("./subscription");

import MeasurementHub = WEBfactory.DWH.Server.RealTime.Proxies.Hubs.MeasurementHub;
import Measurement = WEBfactory.DWH.Server.RealTime.Proxies.Model.Measurement;
import Guid = System.Guid;

class MeasurementService extends ProxyClient {

    public subscriptions: KnockoutObservableArray<Subscription>;
    private hub: MeasurementHub;

    constructor() {
        super(($ as any).connection.measurementHub);
        if (!window.usei4Connector) return;

        this.hub = ($ as any).connection.hub.proxies.measurementhub;
        this.subscriptions = ko.observableArray<Subscription>();
        if (this.hub) {
            this.hub.client.onMeasurement = (measurement) => this.onMeasurement(measurement);
        }
    }

    public onConnected() {
        // Resubscribe all signals
        for (let subscription of this.subscriptions()) {
            Logger.info(MeasurementService, "onConnected subscribe with id: " + subscription.state.id);

            this.hub.server.subscribe(subscription.state.id)
                .then(state => {
                    this.onMeasurement(state);
                });
        }
    }

    public onMeasurement(measurement) {
        if (!measurement) return;
        let subscription = _.find(this.subscriptions(), x => x.state.id === measurement.signalId);

        if (subscription) {
            subscription.updateState(measurement);
        }
    }

    // public subscribe(observer: any, id: Guid): Q.Promise<ISignalState> {
    //     let subscription = _.find(this.subscriptions(), x => x.state.id === id);
    //     if (!subscription) {
    //         subscription = new Subscription(id, observer);

    //         this.subscriptions.push(subscription);

    //         if ((this.hub as any).connection.state === 1)//SignalRConnectionState.connected)
    //         {
    //             Logger.info(MeasurementService, "subscribe subscribe with id: " + subscription.state.id);

    //             this.hub.server.subscribe(id)
    //                 .then(measurement => {
    //                     subscription.updateState(measurement);
    //                 });
    //         }
    //     }
    //     return Q(subscription.state);
    // }

    public async subscribeAll(observer: any, ids: Guid[]): Promise<void> {
        const subscriptionMap = this.subscriptions().reduce<{ [index: string]: Subscription }>((prev, current) => {
            prev[current.state.id as string] = current;
            return prev;
        },
            {});

        const newSubscriptions: Guid[] = [];

        for (const id of ids) {
            if (id && !subscriptionMap[id as string]) {
                const subscription = new Subscription(id, observer);
                this.subscriptions.push(subscription);
                subscriptionMap[id as string] = subscription;
                newSubscriptions.push(id);
            }
        }

        if (newSubscriptions.length && (this.hub as any).connection.state === 1 /*connected*/) {
            Logger.info(MeasurementService, `Subscribing to ${newSubscriptions.length} signals`);
            const measurements = await this.hub.server.subscribeAll(newSubscriptions);
            for (const measurement of measurements) {
                if (measurement) {
                    subscriptionMap[measurement.signalId as string].updateState(measurement);
                }
            }
        }
    }

    public async unsubscribe(observer: any, id: Guid) {
        const subscription = _.find(this.subscriptions(), x => x.state.id === id);

        if (!subscription) return;

        subscription.observers.remove(observer);

        if (!subscription.observers().length) {
            await this.hub.server.unsubscribe(id)
            this.subscriptions.remove(subscription);
        }
    }

    public async unsubscribeAll(observer: any, ids: Guid[]) {
        const hubIds: Guid[] = [];
        for (const id of ids) {
            const subscription = _.find(this.subscriptions(), x => x.state.id === id);

            if (!subscription) continue;

            subscription.observers.remove(observer);

            if (!subscription.observers().length) {
                hubIds.push(id);
                this.subscriptions.remove(subscription);
            }
        }

        if (hubIds.length) {
            this.hub.server.unsubscribeAll(hubIds);
        }
    }

    public async read(id: Guid) {
        return await this.hub.server.read(id);
    }
}
export = MeasurementService;

