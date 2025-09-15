import { BaseApplication } from "./baseApplication";

export class StandaloneApplication extends BaseApplication {
    constructor() {
        super();
        ko.applyBindings(this, window.document.body );
    }            
}

export var application = new StandaloneApplication();