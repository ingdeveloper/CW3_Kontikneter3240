import ViewModelBase = require("../viewModelBase");
import Connector = require("../../services/connector");
import Signal = require("../../services/models/signal");

class OnlineValuesTutorial extends ViewModelBase {
    private onlineValue: KnockoutObservable<any>;
    private setpoint1Signal: Signal;
    private connector: Connector;
    constructor() {
        super();
    }

    public activate() {
        this.connector = new Connector();
        this.setpoint1Signal = this.connector.getSignal("Setpoint 1");
        this.onlineValue = this.setpoint1Signal.value;
        return this.connector.getOnlineUpdates();

        //return this.connector.readSignals(["Setpoint 1"])
        //    .then(function (result) {
        //        this.onlineValue = result[0].Value;
        //    }).then(function () {
        //        return this.connector.getOnlineUpdates();
        //    })

    }

    public async detached() {
        await this.connector.unregisterSignals(this.setpoint1Signal);
    }

    public writeSignalValueON() {
        this.connector.writeSignals({ "Setpoint 1": 1 } as any);
    }
    public writeSignalValueOFF() {
        this.connector.writeSignals({ "Setpoint 1": 0 } as any);
    }
}

export = OnlineValuesTutorial;