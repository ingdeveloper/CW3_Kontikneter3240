import ViewModelBase = require("../viewModelBase");
import VisualSecurityService = require("../../components/services/visual-security.service");
import Connector = require("../../services/connector");
import Signal = require("../../services/models/signal");

class VisualSecurityServiceTutorial extends ViewModelBase {
    private isDisabled: KnockoutComputed<boolean>;
    private isVisible: KnockoutComputed<boolean>;
    private visualSecurityService: VisualSecurityService;
    private connector: Connector;
    private settings: IVisualSecurityParams;

    constructor() {
        super();
    }

    public activate() {

        this.connector = new Connector();

        //enableOperator und visibilityOperator
        // value == signalValue
        // value != signalValue
        // value <  signalValue
        // value >  signalValue
        // value <= signalValue
        // value >= signalValue

        this.settings = {
            visibilitySignalName: "Setpoint 1",
            visibilitySignalValue: 1,
            visibilityOperator: "!=",
            enableSignalName: "Setpoint 2",
            enableSignalValue: 1,
            enableOperator: "!=",
        } as IVisualSecurityParams;

        this.visualSecurityService = new VisualSecurityService(this.settings);
        this.isVisible = this.visualSecurityService.isVisible;
        this.isDisabled = this.visualSecurityService.isDisabled;

    }

    public detached() {
        if (this.visualSecurityService)
            this.visualSecurityService.dispose();
    }
}

export = VisualSecurityServiceTutorial;