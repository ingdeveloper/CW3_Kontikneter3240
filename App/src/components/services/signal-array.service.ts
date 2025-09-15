import Signal = require("../../services/models/signal");
import Connector = require("../../services/connector");
import Logger = require("../../services/logger");

declare const numeral;

class SignalArrayService implements ISignalArrayParams {
    public format: string;
    public signalValueFactor: number;

    private settings: ISignalArrayParams;
    public isArray: boolean;
    public arrayIndex: number;
    public arrayDelimiter: string;
    public signal: Signal;

    get signalValue() {
        return ko.computed(() => {

            try {
                const value = ko.unwrap(this.signal.value);
                const array = value.toString().split(this.arrayDelimiter);
                if (array.length < this.arrayIndex + 1) {
                    Logger.warn(this, "The array index is invalid.");
                    return "n/a";
                }
                const result = !isNaN(parseFloat(array[this.arrayIndex]))
                    ? numeral(array[this.arrayIndex]).multiply(this.signalValueFactor).format(this.format)
                    : array[this.arrayIndex];
                return result;
            } catch (error) {
                Logger.error(this, error);
            }

        }, this);
    }

    constructor(settings: ISignalArrayParams, signal: Signal) {
        this.settings = settings;
        this.signal = signal;

        this.signalValueFactor = ko.unwrap(this.settings.signalValueFactor) || 1;
        this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[00]";

        this.isArray = ko.unwrap(this.settings.isArray) !== undefined ? ko.unwrap(this.settings.isArray) : false;
        this.arrayIndex = ko.unwrap(this.settings.arrayIndex) || 0;
        this.arrayDelimiter = ko.unwrap(this.settings.arrayDelimiter) || ",";
    }

    public getWriteValues(writeValue: any) {
        if (this.signal === undefined || this.signal === null) {
            Logger.warn(this, "The signal is not available.");
            return;
        }

        var currentSignalValue = this.signal.value() || [];

        var array = (Array.isArray(currentSignalValue) ? currentSignalValue : currentSignalValue.split(this.arrayDelimiter)) || [];
        if (array.length > 0 && this.arrayIndex > 0 && array.length < this.arrayIndex + 1) {
            Logger.warn(this, "The array index is invalid.");
            return;
        }
        array[this.arrayIndex] = writeValue;
        writeValue = Array.isArray(currentSignalValue) ? array : array.join();
        return writeValue;
    }
}

export = SignalArrayService;