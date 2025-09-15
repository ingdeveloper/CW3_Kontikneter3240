import ViewModelBase = require("../viewModelBase");
import Connector = require("../../services/connector");

class BufferWriteTutorial extends ViewModelBase {
   private connector: Connector;
   
    constructor() {
        super();
        this.connector = new Connector();
    }
}

export = BufferWriteTutorial;