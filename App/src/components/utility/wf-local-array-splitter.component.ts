import { IWfLocalArraySplitterParams } from "../models/wf-local-array-splitter.params";
import { ArraySignalType } from "../models/array-signal-type";
import { ArrayValueType } from "../models/array-value-type";
import { UndefinedValueHandling } from "../models/undefined-value-handling";
import { OutputWriteBufferingMode } from "../models/output-write-buffering-mode";
import UtilityComponentBaseModel = require("../utility-component-base.model");
import Signal = require("../../services/models/signal");

enum ReadWriteState {
    StartingRead,
    ReadComplete,
    WriteEnabled
}

class WfLocalArraySplitterComponent extends UtilityComponentBaseModel<IWfLocalArraySplitterParams> {
    private inputSignalName: string;
    private inputArrayType: ArraySignalType;
    private inputArrayLeftDelimiter: string;
    private inputArrayRightDelimiter: string;
    private inputArrayElementSeparator: string;
    private inputArrayElementQuote: string;
    private inputArrayStripWhitespace: boolean;
    private arrayValueType: ArrayValueType;
    private arrayMaxSize: number;
    private arrayMinSize: number;
    private arrayNameTemplate: string;
    private outputSignalName: string;
    private outputArrayType: ArraySignalType;
    private outputArrayLeftDelimiter: string;
    private outputArrayRightDelimiter: string;
    private outputArrayElementSeparator: string;
    private outputArrayElementQuote: string;
    private outputKeepNulls: boolean;
    private undefinedValueHandling: UndefinedValueHandling;
    private undefinedDefaultValue: any;
    private outputWriteBufferingMode: OutputWriteBufferingMode;
    private outputWriteBufferingInterval: number;
    private outputWriteTriggerSignalName: string;
    private inputSignal: Signal;
    private signalProcess: KnockoutComputed<any>;
    private writeOutputProcess: KnockoutComputed<any>;
    private localSignals: KnockoutObservableArray<Signal>;
    private readWriteState: KnockoutObservable<ReadWriteState>;
    private writeCallback: (values: any[]) => void;
    private timer: number | undefined;
    private values: any[] = undefined;
    private writeOnRead: boolean;
    private triggerSignal: Signal;
    private trigger: KnockoutComputed<any>;

    private static extractBetween(inputString, leftDelimiter, rightDelimiter) {
        const startIndex = leftDelimiter === "" ? -1 : inputString.indexOf(leftDelimiter);
        const endIndex = rightDelimiter === "" ? inputString.length : inputString.lastIndexOf(rightDelimiter);
        if (leftDelimiter !== "" && startIndex === -1) return undefined;
        if (rightDelimiter !== "" && endIndex === -1 || endIndex < startIndex) return undefined;
        return inputString.substring(startIndex + 1, endIndex);
    }

    private static createLocalSignalMap(localSignals: Signal[]): { [signalName: string]: Signal } {
        return localSignals.reduce((prev, signal) => {
            prev[signal.signalName.peek()] = signal;
            return prev;
        }, {});
    }

    constructor(params: IWfLocalArraySplitterParams) {
        super(params);
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.inputSignalName = UtilityComponentBaseModel.stringParam(this.settings.inputSignalName, "").stringPlaceholderResolver(this.objectID);
        this.inputArrayType = ko.unwrap(this.settings.inputArrayType) || ArraySignalType.Native;
        this.inputArrayLeftDelimiter = UtilityComponentBaseModel.stringParam(this.settings.inputArrayLeftDelimiter, "[");
        this.inputArrayRightDelimiter = UtilityComponentBaseModel.stringParam(this.settings.inputArrayRightDelimiter, "]");
        this.inputArrayElementSeparator = UtilityComponentBaseModel.stringParam(this.settings.inputArrayElementSeparator, ",");
        this.inputArrayElementQuote = UtilityComponentBaseModel.stringParam(this.settings.inputArrayElementQuote, "\"");
        this.inputArrayStripWhitespace = ko.unwrap(this.settings.inputArrayStripWhitespace) !== false;
        this.arrayValueType = ko.unwrap(this.settings.arrayValueType) || ArrayValueType.Decimal;
        this.arrayMaxSize = Math.max(ko.unwrap(this.settings.arrayMaxSize) || 0, 0);
        this.arrayMinSize = Math.max(ko.unwrap(this.settings.arrayMinSize) || 0, 0);
        this.arrayNameTemplate = UtilityComponentBaseModel.stringParam(this.settings.arrayNameTemplate, "{InputSignalName}{Index}").stringPlaceholderResolver(this.objectID);
        this.outputSignalName = (ko.unwrap(this.settings.outputSignalName) || "").stringPlaceholderResolver(this.objectID);
        this.outputArrayType = ko.unwrap(this.settings.outputArrayType) || ArraySignalType.Native;
        this.outputArrayLeftDelimiter = UtilityComponentBaseModel.stringParam(this.settings.outputArrayLeftDelimiter, "[");
        this.outputArrayRightDelimiter = UtilityComponentBaseModel.stringParam(this.settings.outputArrayRightDelimiter, "]");
        this.outputArrayElementSeparator = UtilityComponentBaseModel.stringParam(this.settings.outputArrayElementSeparator, ",");
        this.outputArrayElementQuote = UtilityComponentBaseModel.stringParam(this.settings.outputArrayElementQuote, "\"");
        this.outputKeepNulls = ko.unwrap(this.settings.outputKeepNulls) !== false;
        this.undefinedValueHandling = ko.unwrap(this.settings.undefinedValueHandling) || UndefinedValueHandling.UseNull;
        this.undefinedDefaultValue = ko.unwrap(this.settings.undefinedDefaultValue);
        this.outputWriteBufferingMode = ko.unwrap(this.settings.outputWriteBufferingMode) || OutputWriteBufferingMode.None;
        this.outputWriteBufferingInterval = ko.unwrap(this.settings.outputWriteBufferingInterval) || 500;
        this.outputWriteTriggerSignalName = UtilityComponentBaseModel.stringParam(this.settings.outputWriteTriggerSignalName, "").stringPlaceholderResolver(this.objectID);
        this.writeOnRead = ko.unwrap(this.settings.writeOnRead) === true;
        this.inputSignal = this.connector.getSignal(this.inputSignalName);

        this.localSignals = ko.observableArray<Signal>([]);
        this.readWriteState = ko.observable(ReadWriteState.StartingRead);
        this.signalProcess = ko.computed(() => this.processInput());

        if (this.outputSignalName && this.outputSignalName.length) {
            this.writeOutputProcess = ko.computed(() => this.processOutput());
        }

        this.connector.getOnlineUpdates();
    }

    protected async dispose() {
        await super.dispose();

        this.signalProcess.dispose();
        this.writeOutputProcess.dispose();
        this.clearSamplingTimer();

        await this.connector.unregisterSignals(this.inputSignalName);
        await this.connector.unregisterSignals(...this.localSignals());

        if (this.trigger) this.trigger.dispose();
        if (this.triggerSignal) await this.connector.unregisterSignals(this.triggerSignal);

    }

    private processInput() {
        if (!this.inputSignal.hasValue()) return;
        const inputValue = this.inputSignal.value();
        this.readWriteState(ReadWriteState.StartingRead);
        const localSignals = this.localSignals.peek();
        const localSignalMap = WfLocalArraySplitterComponent.createLocalSignalMap(localSignals);
        this.localSignals([]);

        const nativeInputArray = this.makeNativeArray(inputValue);
        const localSignalNames: string[] = [];
        const localSignalValues: SignalValue = {};
        const minArrayLength = Math.max(this.arrayMinSize, nativeInputArray.length);
        const maxArrayLength = this.arrayMaxSize || nativeInputArray.length;
        const desiredArrayLength = Math.min(minArrayLength, maxArrayLength);

        for (let i = 0; i < desiredArrayLength; ++i) {
            const signalName = this.makeLocalSignalName(i);
            localSignalValues[signalName] = i < nativeInputArray.length ? nativeInputArray[i] : null;
            localSignalNames.push(signalName);
        }

        this.connector.writeSignals(localSignalValues)
            .then(() => {
                this.fillLocalSignals(localSignalNames, localSignalMap);
                this.finalizeRead();
            });
    }

    private finalizeRead() {
        if (this.writeOnRead) {
            this.readWriteState(ReadWriteState.WriteEnabled);
        } else {
            this.readWriteState(ReadWriteState.ReadComplete);
        }
    }

    private fillLocalSignals(localSignalNames: string[], localSignalMap: { [signalName: string]: Signal }) {
        for (const name of localSignalNames) {
            const prevSignal = localSignalMap[name];
            if (prevSignal) {
                this.localSignals.push(prevSignal);
                delete localSignalMap[name];
            }
            else {
                this.localSignals.push(this.connector.getSignal(name));
            }
        }

        this.unsubscribeFromUnusedLocalSignals(localSignalMap);
    }

    private unsubscribeFromUnusedLocalSignals(localSignalMap: { [signalName: string]: Signal }) {
        const leftoverSignals = Object.keys(localSignalMap);
        this.connector.unregisterSignals(...leftoverSignals);
    }

    private processOutput() {
        // get the local signal values to enable change notifications
        const localSignals = this.localSignals();
        const localSignalValues = localSignals.map(x => x.value());

        const writeCycle = this.readWriteState();
        switch (writeCycle) {
            case ReadWriteState.StartingRead:
                return;

            case ReadWriteState.ReadComplete:
                // in the next cycle we can start writing
                this.readWriteState(ReadWriteState.WriteEnabled);
                return;
            default:
                // this only happens when the status is WriteEnabled
                this.performWrite(localSignalValues);
                return;
        }
    }


    private clearSamplingTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    private performWrite(signalValues: any[]) {
        if (!this.writeCallback) {
            this.initializeWriteCallback(signalValues);
        }

        this.writeCallback(signalValues);

    }

    private initializeWriteCallback(currentValues: any) {
        switch (this.outputWriteBufferingMode) {
            case OutputWriteBufferingMode.None:
                this.initializeDirectWriteCallback();
                break;
            case OutputWriteBufferingMode.Debounced:
                this.initializeDebouncedWriteCallback();
                break;
            case OutputWriteBufferingMode.Throttle:
                this.initializeThrottleWriteCallback();
                break;
            case OutputWriteBufferingMode.Sampled:
                this.initializeSampledWriteCallback();
                break;
            case OutputWriteBufferingMode.WaitAll:
                this.initializeWaitAllWriteCallback(currentValues);
                break;
            case OutputWriteBufferingMode.Triggered:
                this.initializeTriggeredWriteCallback();
                break;
        }
    }

    private initializeTriggeredWriteCallback() {
        this.writeCallback = (values) => this.values = values;
        this.triggerSignal = this.connector.getSignal(this.outputWriteTriggerSignalName);
        let initial = true;
        this.trigger = ko.computed(() => {
            this.triggerSignal.value();
            if (initial) {
                initial = false;
                return;
            }
            this.writeOutput(this.values);
        });
    }

    private initializeWaitAllWriteCallback(initialValues: any) {
        this.values = initialValues;
        this.writeCallback = (values) => {
            const allChanged = _.every(values, (value, index) => this.values[index] !== value);
            if (allChanged) {
                this.writeOutput(values);
                this.values = values;
            }
        };
    }

    private initializeSampledWriteCallback() {
        this.writeCallback = (values) => {
            this.values = values;
            if (!this.timer) {
                this.timer = window.setInterval(() => this.writeOutput(this.values), this.outputWriteBufferingInterval);
            }
        };
    }

    private initializeThrottleWriteCallback() {
        this.writeCallback = _.throttle((values) => this.writeOutput(values), this.outputWriteBufferingInterval, {leading: false});
    }

    private initializeDebouncedWriteCallback() {
        this.writeCallback = _.debounce((values) => this.writeOutput(values), this.outputWriteBufferingInterval);
    }

    private initializeDirectWriteCallback() {
        this.writeCallback = (values) => this.writeOutput(values);
    }

    private writeOutput(values: any[]) {
        let value: string | any[] = values || [];
        if (this.outputArrayType === ArraySignalType.String) {
            value = this.makeStringArray(values);
        }

        const signals: SignalValue = {};
        signals[this.outputSignalName] = value;
        // noinspection JSIgnoredPromiseFromCall
        this.connector.writeSignals(signals);
    }

    private makeStringArray(values: any[]) {
        return this.outputArrayLeftDelimiter
            + values
                .filter(value => this.outputKeepNulls ? value : (value !== null && value !== undefined))
                .map(value => this.formatOutputValue(value)).join(this.outputArrayElementSeparator)
            + this.outputArrayRightDelimiter;
    }

    private formatOutputValue(value: any) {
        if (value === null || value === undefined) {
            if (this.undefinedValueHandling === UndefinedValueHandling.UseNull) return "null";
            value = this.undefinedDefaultValue;
        }

        let stringValue = "";

        switch (this.arrayValueType) {
            case ArrayValueType.Decimal:
                stringValue = Number(value).toString(10);
                break;
            case ArrayValueType.Integer:
                stringValue = Math.floor(Number(value)).toString(10);
                break;
            case ArrayValueType.Boolean:
                stringValue = Boolean(value).toString();
                break;
            default:
                stringValue = String(value);
                break;
        }

        return this.outputArrayElementQuote + stringValue + this.outputArrayElementQuote;
    }

    private makeLocalSignalName(index: number) {
        return "local://" +
            this.arrayNameTemplate
                .replace(/{InputSignalName}/ig, this.inputSignalName)
                .replace(/{Index}/ig, (index + 1).toString(10));
    }

    private makeNativeArray(input: string | any[]) {
        if (this.inputArrayType === ArraySignalType.Native) {
            return input as any[];
        }

        const inputString = WfLocalArraySplitterComponent.extractBetween(input as string, this.inputArrayLeftDelimiter, this.inputArrayRightDelimiter);
        if (inputString === undefined) return [];

        return inputString
            .split(this.inputArrayElementSeparator)
            .map(x => this.extractArrayElement(x));

    }

    private extractArrayElement(rawElement: string) {
        rawElement = this.inputArrayStripWhitespace ? rawElement.trim() : rawElement;

        const extracted = WfLocalArraySplitterComponent.extractBetween(rawElement, this.inputArrayElementQuote, this.inputArrayElementQuote);
        if (extracted === null || extracted === undefined || (rawElement === "null" && this.inputArrayElementQuote.length)) {
            return (this.undefinedValueHandling === UndefinedValueHandling.UseNull) ? null : this.undefinedDefaultValue;
        }

        switch (this.arrayValueType) {
            case ArrayValueType.Decimal:
                return Number.parseFloat(extracted).valueOf();
            case ArrayValueType.Integer:
                return Number.parseInt(extracted, 10).valueOf();
            case ArrayValueType.Boolean:
                return Boolean(extracted).valueOf();
            default:
                return extracted;
        }
    }
}

export = WfLocalArraySplitterComponent;