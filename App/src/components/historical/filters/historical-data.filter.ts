export interface IHistoricalDataFilter {
    filter(data: number[]): number[];
}

export class HistoricalDataDigitalFilter implements IHistoricalDataFilter {
    constructor(private readonly digitalBit?: number) {
        this.digitalBit = digitalBit === null ? 0 : digitalBit;
    }

    public filter(data: number[]): number[] {
        return data.map(update => {
            if (update === null) {
                return null;
            }
            if ((update & this.digitalBit) === this.digitalBit) {
                return 1;
            }
            return 0;
        });
    }
}

export class HistoricalDataInvertFilter implements IHistoricalDataFilter {
    public filter(data: number[]): number[] {
        return data.map(update => {
            if (update === null) {
                return null;
            }
            if (update === 0) {
                return 1;
            }
             return 0;
        });
    }
}