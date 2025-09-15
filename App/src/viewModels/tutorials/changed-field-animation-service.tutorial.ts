import ViewModelBase = require("../viewModelBase");
import Connector = require("../../services/connector");
import ChangedFieldAnimationService = require("../../components/services/changed-field-animation.service");
import Signal = require("../../services/models/signal");

class ChangedFieldAnimationServiceTutorial extends ViewModelBase {
    private cssClass: KnockoutComputed<string>;
    private changedFieldAnimationService: ChangedFieldAnimationService;
    private settings: IChangedFieldAnimationParams;
    private displayClassNames: string;
    private signalValue: KnockoutObservable<any>;
    private signal: Signal;
    private connector: Connector;

    constructor() {
        super();
    }

    public activate() {

        this.connector = new Connector();
        this.signal = this.connector.getSignal("Setpoint 1");
        this.signalValue = this.signal.value;

        this.displayClassNames = "label-default";

        this.settings = {
            changedCssDuration: 1000,
            signalChangedClass: "label-warning",
            additionalCssForAnimation: ""
        }

        this.changedFieldAnimationService = new ChangedFieldAnimationService(this.settings, this.signalValue, this.displayClassNames);
        this.cssClass = this.changedFieldAnimationService.cssClass;
    }

    public detached() {
        if (!this.signal)
            return;

        this.changedFieldAnimationService.dispose();
        return this.connector.unregisterSignals(this.signal);
    }
}

export = ChangedFieldAnimationServiceTutorial;