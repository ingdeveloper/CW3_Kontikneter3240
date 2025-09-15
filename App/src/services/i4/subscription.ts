import Measurement = WEBfactory.DWH.Server.RealTime.Proxies.Model.Measurement;

class Subscription {
    public state: ISignalState;
    public observers: KnockoutObservableArray<any>;

    constructor(id: Guid, observer: any) {
        this.state = { id: id, timestamp: ko.observable<moment.Moment>(), value: ko.observable<any>() } as ISignalState;
        this.observers = ko.observableArray<any>([observer]);
    }

    public updateState(measurement: Measurement): void {
        if (!measurement) return;

        this.state.timestamp(moment.utc(measurement.timestamp));
        this.state.value(measurement.value);
        this.state.name = String(measurement.signalId);

        this.observers()
            .filter(_.isFunction)
            .forEach(observer => {
                observer(this.state);
            });
    }
}

export = Subscription;