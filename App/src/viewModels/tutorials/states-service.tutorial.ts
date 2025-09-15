import ViewModelBase = require("../viewModelBase");
import StatesService = require("../../components/services/states.service");

class StatesServiceTutorial extends ViewModelBase {
    public states: StatesService;
    public settings: IState;

    constructor() {
        super();
    }

    public activate() {

        this.settings = {
            states: [
                { conditionRule: "%Setpoint 1% == 1" },
                { conditionRule: "%Setpoint 1% == 2" }
            ]
        } as IState;

        this.states = new StatesService(this.settings);
    }

    public detached() {
        this.states.unregisterSignals();
    }
}

export = StatesServiceTutorial;