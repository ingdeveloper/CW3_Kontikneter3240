import ViewModelBase = require("../viewModelBase");
import SignalsConnector = require("../../services/connector");
import SignalDefinitionsFilter = require("../../services/models/signalDefinitionsFilter");
import Signal = require("../../services/models/signal");


class SignalsTutorial extends ViewModelBase {
    public definitionMap: CommonSignalDefinition[] = [];;

    public signalDefinitions: KnockoutObservableArray<
    {
        signalName: KnockoutObservable<string>;
        value: KnockoutObservable<any>;
        description: KnockoutObservable<string>;
        unit: KnockoutObservable<string>;
        vChannel: KnockoutObservable<any>;
    }>;

    public signals: Signal[];
    public signalNames: KnockoutObservableArray<string>;
    public connector: SignalsConnector;

    public async activate() {
        var servers = ["."];
        var logTags = null;

        this.connector = new SignalsConnector();

        this.signalNames = ko.observableArray([
            "Setpoint 1",
            "Setpoint 2",
            "Setpoint 3",
            "Level 1",
            "Level 2",
            "Local Hour",
            "Local Minute",
            "Local Second",
            "Vibration 1",
            "System Second",
            "AlarmCount",
            "Vibration 4",
            "Servo 1",
            "Servo 2",
            "Frequency 1",
            "Frequency 2",
            "Sensor 1",
            "Sensor 2",
            "MachineOP",
            "OperationMode1",
            "OperationMode2",
            "OperationMode3",
            "Temperature 1",
            "Temperature 2"
        ]);

        this.signalNames(_.uniq(this.signalNames()));

        this.signals = _.map(_.uniq(this.signalNames()), (signalName) => {
            return this.connector.getSignal(signalName);
        });

        var signalDefinitions = _.map(this.signals, (signal) => {
            return {
                signalName: signal.signalName,
                value: signal.value.extend({ numeralNumber: "0,0.[00]" }),
                description: ko.observable(""),
                unit: ko.observable(""),
                vChannel: ko.observable(null)
            };
        });

        this.signalDefinitions = ko.observableArray(signalDefinitions);

        const definitions = await this.connector.getSignalDefinitions(this.signalNames())


        definitions.forEach((definition) => {
            this.definitionMap[definition.Alias] = definition;
        });

        this.signalDefinitions().forEach((signal) => {
            var signalName = signal.signalName();

            if (this.definitionMap[signalName]) {
                console.warn(this.definitionMap[signalName].Description);
                signal.description(this.definitionMap[signalName].Description || "");
                signal.unit(this.definitionMap[signalName].Unit || "");
                signal.vChannel(this.definitionMap[signalName].VChannel);
            }
        });

        await this.connector.getOnlineUpdates();
    }

    public async detached() {
        // Unregister Signals
        if (this.signals) {
            for (const signal of this.signals) {
                await this.connector.unregisterSignals(signal);
            }
        }
    }

}

export = SignalsTutorial;