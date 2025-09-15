import Logger = require("../logger");
import { Deferred } from "../deferred";
import Signals = require("./_signal");
import SignalValueType = Signals.SignalValueType;

class Signal {

    public static defaultValue = "n/a";
    public id = ko.observable<any>();
    public deferredId: Deferred<any>;

    public signalName = ko.observable<string>();
    public value = ko.observable<any>();
    public valueType = ko.observable<SignalValueType>(SignalValueType.Plausible)
        .extend({ notify: 'always' });
    public hasValue = ko.pureComputed(() => {
        const value = this.value();
        return value !== null && value !== undefined && value !== Signal.defaultValue;
    }, this);

    public definition = ko.observable<CommonSignalDefinition>();
    public deferredDefinition: Deferred<CommonSignalDefinition>;

    private referenceCount: number = 0;

    constructor(name: string, defaultValue: any = Signal.defaultValue) {
        this.signalName(name);
        this.setValue(defaultValue, SignalValueType.Plausible);
        this.deferredId = new Deferred<any>();
        

        this.definition.subscribe(value => {
            if (!this.deferredDefinition) {
                this.deferredDefinition = new Deferred<CommonSignalDefinition>();
            }

            if (!this.deferredDefinition.isResolved()) {
                this.deferredDefinition.resolve(value);
            } else {
                Logger.info("Signal: double resolse", this.signalName());
            }
        });

        this.id.subscribe(value => {
            this.deferredId.resolve(value);

            if (!value) {
                this.definition(null); //setting of this to null should make the deferredDefinition be resolved with NULL
            }
        });
    }

    public addSubscriber(runLogging?:boolean) {
        //wenn Parameter leer, dann Logging auf FALSE setzen (amueller 14.11.2019)
        if ((runLogging === void 0)||(runLogging === undefined)) {
            runLogging = false;
        }
        this.referenceCount++;
        if (runLogging){  //amueller 14.11.2019 hier neue Bedingung, um das Logging zu schalten
         Logger.info(this, `Subscribed to ${this.signalName()} [total subscriptions: ${this.referenceCount}]`);
        }
    }

    public releaseSubscriber() {
        this.referenceCount = Math.max(this.referenceCount - 1, 0);
        Logger.info(this, `Unsubscribed from ${this.signalName()} [total subscriptions: ${this.referenceCount}]`);
    }

    public hasSubscribers() {
        return this.referenceCount > 0;
    }

    public setValue(value: any, type: SignalValueType = SignalValueType.Plausible) {
        this.value(value);
        this.valueType(type);
    }
}

export = Signal;