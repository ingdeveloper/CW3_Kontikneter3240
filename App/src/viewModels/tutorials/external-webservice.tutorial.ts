import ViewModelBase = require("../viewModelBase");
import ExampleService = require("../../services/exampleService");

class ExternalWebserviceTutorial extends ViewModelBase {

    private version: KnockoutObservable<any>;
    private exampleService: ExampleService;

    constructor() {
        super();
        this.exampleService = new ExampleService();
    }

    public activate() {
        this.version = ko.observable<string>();

        this.getScadaVersion();
        //  this.getWeather();
    }

    public async getScadaVersion() {

        try {
            const data = await this.exampleService.getScadaVersion()
            this.version(data);
        } catch (error) {
            console.error(error);
        }

    }

    public async getWeather() {
        try {
            const data = await this.exampleService.getWeather("Buchen (Odenwald)", "KEY")
            console.log(data);
        } catch (error) {
            console.error(error);
        }

    }
}

export = ExternalWebserviceTutorial;