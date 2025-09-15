
import Connector = require("../../../services/connector");
import Signal = require("../../../services/models/signal");
import { SeriesChartDataProvider } from "../providers/series-chart-data-provider";

export class HistoricalDataCursorsService {

    private readonly connector = new Connector();
    private readonly localSignals: Signal[] = [];

  
    constructor(
        readonly provider: SeriesChartDataProvider) {
    }

    private getLocalSignalName(seriesName: string, cursorName: string, postfix: string): string {
        return `local://${this.provider.providerName}->${this.provider.name}->${seriesName}->CURSOR->${cursorName}->${postfix}`;
    }

    private addLocalSignal(localSignalName: string) {
        if (!this.localSignals.find(item => item.signalName() === localSignalName)) {
            const signal = this.connector.getSignal(localSignalName);
            this.localSignals.push(signal);
        }
    }

    private async removeLocalSignalAsync(localSignalName: string) {
        const index = this.localSignals.findIndex(item => item.signalName() === localSignalName);
        if (index >= 0) {
            const signals = this.localSignals.splice(index, 1);
            signals[0].value(NaN);
            await this.connector.unregisterSignals(localSignalName);
        }
    }

    public addLocalSignals() {
        for (let series of this.provider.series()) {
            if (series && series.cursors) {
                for (const cursor of series.cursors) {
                    this.addLocalSignal(this.getLocalSignalName(series.name, cursor.name, "Value"));
                    this.addLocalSignal(this.getLocalSignalName(series.name, cursor.name, "Timestamp"));
                }
            }
        }
    }

    public removeAllLocalSignals() {
        for (let signal of this.localSignals) {
            this.removeLocalSignalAsync(signal.signalName());
        }
    }

    public async removeLocalSignalsAsync(seriesName: string) {
        const series = this.provider.series().find(item => item.name === seriesName);
        if (series && series.cursors) {
            for (const cursor of series.cursors) {
                await this.removeLocalSignalAsync(this.getLocalSignalName(series.name, cursor.name, "Value"));
                await this.removeLocalSignalAsync(this.getLocalSignalName(series.name, cursor.name, "Timestamp"));
            }
        }
    }

    public updateData(series: string, coursor: string, data: LogValueDTO, date: Date) {
        this.updateLocalSignals(series, coursor, data.EditedValue2 || data.EditedValue || data.Value2 || data.Value, date);
    }

    private updateLocalSignals(series: string, cursor: string, value: number | string, timestamp: Date) {
        const valueSignal = this.localSignals.find(item => item.signalName() === this.getLocalSignalName(series, cursor, "Value"));
        const timestampsignal = this.localSignals.find(item => item.signalName() === this.getLocalSignalName(series, cursor, "Timestamp"));

        if (valueSignal) {
            valueSignal.value(value);
        }

        if (timestampsignal) {
            timestampsignal.value(timestamp);
        }
    }


    public dispose() {
        this.removeAllLocalSignals();
    }

}
