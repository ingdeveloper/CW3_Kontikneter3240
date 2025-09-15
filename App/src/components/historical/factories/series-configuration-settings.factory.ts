import { ISeriesConfigurationSettings } from "../models/series-configuration.model";

export class SeriesConfigurationSettingsFactory {
    public create(configuration: ISeriesConfigurationSettings) {
        return _.defaults(configuration, {
            initialConfiguration: null,
            configurationName: null,
            configurationNamespace: "",
            clientsideConfiguration: false
        }) as ISeriesConfigurationSettings;
    }
}