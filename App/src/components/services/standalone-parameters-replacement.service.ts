import Logger = require("../../services/logger");

class StandaloneParametersReplacementService implements IStandaloneParameters {
    public readonly parameters: Object;

    constructor(settings?: IStandaloneParameters) {
        this.parameters = ko.unwrap(settings.parameters) !== undefined ? ko.unwrap(settings.parameters) : null;
    }

    public replaceConfigurationParameters(configuration: string) {
        if (this.parameters != null) {
            const keys = Object.keys(this.parameters);
            if (_.any(keys)) {
                for (let i = 0; i < keys.length; i++) {
                    if (this.parameters[keys[i]] != null) {
                        configuration = configuration.split(`[PC:${keys[i]}]`).join(this.parameters[keys[i]]);
                    }
                }
            }
            return configuration;
        }
        return configuration;
    }
}

export = StandaloneParametersReplacementService;