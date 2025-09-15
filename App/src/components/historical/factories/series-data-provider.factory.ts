import { SeriesChartDataProvider } from "../providers/series-chart-data-provider";
import { SeriesConnector } from "../services/series-connector";
import { ISeriesConfigurationSettings, ICommonConfiguration, IChartConfiguration } from "../models/series-configuration.model";
import { SeriesDataProvider } from "../providers/series-data-provider";

export class SeriesDataProviderFactory {
    public create(name: string,
        configuration: ICommonConfiguration,
        configurationSettings: ISeriesConfigurationSettings) {
        const provider = new SeriesDataProvider(name);
        this.update(provider, configuration);
        provider.configurationSettings(configurationSettings);
        provider.reloadHistoricalDataConfigurationService();
        return provider;
    }

    public update(provider: SeriesDataProvider, configuration: ICommonConfiguration) {
        provider.configuration(configuration);
        provider.timeSeriesMode(configuration.timeSeriesMode);
        provider.timeConfiguration(configuration);
    }
}

export class SeriesChartDataProviderFactory {
    public async createAsync(name: string,
        globalSeriesConnector: SeriesConnector,
        provider: SeriesDataProvider,
        configuration: IChartConfiguration) {
        const chartProvider = new SeriesChartDataProvider(name, provider, globalSeriesConnector);
        this.update(chartProvider, configuration);
        await chartProvider.createSeriesAsync();
        return chartProvider;
    }

    public update(provider: SeriesChartDataProvider, configuration: IChartConfiguration) {
        provider.configuration(configuration);
        provider.axes(configuration.axes.slice());
        provider.series(configuration.series.slice());
        provider.regions(configuration.regions.slice());
        provider.legend(configuration.legend);
        provider.export(configuration.export);
        provider.scrollbar(configuration.scrollbar);
    }
}