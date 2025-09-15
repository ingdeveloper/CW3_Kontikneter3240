import { TimeSeriesMode } from "../models/series.model";
import { IChartConfiguration, ICommonConfiguration } from "../models/series-configuration.model";

export class SeriesConfigurationFactory {
    public create(configuration: ICommonConfiguration) {
        configuration = _.defaults(configuration, {
            timeSeriesMode: TimeSeriesMode.Offline,
            timeRanges: null,
            timeRange: null,
            start: null,
            end: null,
            startOffset: null,
            startOffsetInterval: null,
            endOffset: null,
            endOffsetInterval: null
        });
        return configuration;
    }
}

export class SeriesChartConfigurationFactory {
    public create(configuration: IChartConfiguration) {
        configuration = _.defaults(configuration, {
            description: null,
            series: [],
            regions: [],
            axes: [],
            legend: { show: true },
            export: {},
            scrollbar: { showX: false, showY: false },
            minPolylineStep: 0.5,
            layoutVertical: false
        });
        return configuration;
    }
}