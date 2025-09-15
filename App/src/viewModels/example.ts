// Example for the viewModel in TypeScript
import ViewModelBase = require("./viewModelBase");

// Class name has to be unique
class Example extends ViewModelBase {
    constructor() {
        super();
    }
    
    public activate(id) {
        //this.idParameter = id;
    }

}
export = Example;