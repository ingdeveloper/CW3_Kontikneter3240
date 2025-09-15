import ViewModelBase = require("../viewModelBase");
import SignalsConnector = require("../../services/connector");

class ExamplesVisualisation extends ViewModelBase {
    public connector: SignalsConnector;

    public activate(settings) {
        this.connector = new SignalsConnector();
    }
}

export = ExamplesVisualisation;