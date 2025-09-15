
import Connector = require("../../../services/connector");
import Logger = require("../../../services/logger");
import Signal = require("../../../services/models/signal");
import { SeriesDataProvider } from "../providers/series-data-provider";

export class HistoricalDataStatisticsService {

    private readonly connector = new Connector();
    private readonly localSignals: Signal[] = [];

    constructor(readonly provider: SeriesDataProvider) {

    }

    private getLocalSignalName(key: string, postfix: string): string {
        return `local://${this.provider.name}->${key}->${postfix}`;
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

    public addLocalSignals(key: string) {
        this.addLocalSignal(this.getLocalSignalName(key, "max"));
        this.addLocalSignal(this.getLocalSignalName(key, "min"));
        this.addLocalSignal(this.getLocalSignalName(key, "avg"));
        this.addLocalSignal(this.getLocalSignalName(key, "last-value"));
        this.addLocalSignal(this.getLocalSignalName(key, "last-timestamp"));
    }

    public async removeAllLocalSignalsAsync() {
        for (let key of this.provider.seriesDataKeys) {
            await Promise.all([
                this.removeLocalSignalAsync(this.getLocalSignalName(key, "max")),
                this.removeLocalSignalAsync(this.getLocalSignalName(key, "min")),
                this.removeLocalSignalAsync(this.getLocalSignalName(key, "avg")),
                this.removeLocalSignalAsync(this.getLocalSignalName(key, "last-value")),
                this.removeLocalSignalAsync(this.getLocalSignalName(key, "last-timestamp"))
            ]);
        }
    }

    public async removeLocalSignalsAsync(key: string) {
        await Promise.all([
            this.removeLocalSignalAsync(this.getLocalSignalName(key, "max")),
            this.removeLocalSignalAsync(this.getLocalSignalName(key, "min")),
            this.removeLocalSignalAsync(this.getLocalSignalName(key, "avg")),
            this.removeLocalSignalAsync(this.getLocalSignalName(key, "last-value")),
            this.removeLocalSignalAsync(this.getLocalSignalName(key, "last-timestamp"))
        ]);
    }

    public updateLastValue(key: string, lastValue: any, lastTimestamp: Date) {
        const lastValueSignal = this.localSignals.find(item => item.signalName() === `local://${this.provider.name}->${key}->last-value`);
        const lastTimestampSignal = this.localSignals.find(item => item.signalName() === `local://${this.provider.name}->${key}->last-timestamp`);

        if (lastValueSignal) {
            lastValueSignal.value(lastValue);
        }

        if (lastTimestampSignal) {
            lastTimestampSignal.value(lastTimestamp);
        }
    }

    public updateData(data: LogStatisticsDTO[], seriesKeys: string[]) {
        for (let i = 0; i < data.length; i++) {
            let min = null;
            let max = null;
            let avg = null;
            if (data[i].Minimum
                && data[i].Minimum.Value) {
                min = (data[i].Minimum.Value.EditedValue2 || data[i].Minimum.Value.EditedValue) || (data[i].Minimum.Value.Value2 || data[i].Minimum.Value.Value);
            }

            if (data[i].Maximum
                && data[i].Maximum.Value) {
                max = (data[i].Maximum.Value.EditedValue2 || data[i].Maximum.Value.EditedValue) || (data[i].Maximum.Value.Value2 || data[i].Maximum.Value.Value);
            }

            if (data[i].Average
                && data[i].Average.Value) {
                avg = (data[i].Average.Value.EditedValue2 || data[i].Average.Value.EditedValue) || (data[i].Average.Value.Value2 || data[i].Average.Value.Value);
            }
            this.updateLocalSignals(seriesKeys[i], min, max, avg);
        }
    }

    private updateLocalSignals(key: string, min: number | string, max: number | string, avg: number | string) {

        const minSignal = this.localSignals.find(item => item.signalName() === `local://${this.provider.name}->${key}->min`);
        const maxSignal = this.localSignals.find(item => item.signalName() === `local://${this.provider.name}->${key}->max`);
        const avgSignal = this.localSignals.find(item => item.signalName() === `local://${this.provider.name}->${key}->avg`);

        if (minSignal) {
            Logger.info(this, `Update statistics signal ${key} min: ${min}`);
            minSignal.value(min);
        }
        if (maxSignal) {
            Logger.info(this, `Update statistics signal ${key} max: ${max}`);
            maxSignal.value(max);
        }
        if (avgSignal) {
            Logger.info(this, `Update statistics signal ${key} avg: ${avg}`);
            avgSignal.value(avg);
        }
    }
    
    public async dispose() {
        await this.removeAllLocalSignalsAsync();
    }

}
