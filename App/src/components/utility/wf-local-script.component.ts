import UtilityComponentBaseModel = require("../utility-component-base.model");
import Signal = require("../../services/models/signal");
import { IWfLocalScriptParams } from "../models/wf-local-script.params";

class WfLocalScriptComponent extends UtilityComponentBaseModel<IWfLocalScriptParams> {
    public setScript: (value) => any;
    private inputSignalNames: string[];
    private outputSignalName: string;
    private isAsync: boolean;
    private inputSignals: Signal[];
    private scriptFunction: Function;
    private process: KnockoutComputed<any>;

    constructor(params: IWfLocalScriptParams) {
        super(params);
    }

    protected initializeSettings() {
        super.initializeSettings();

        const inputSignalNames = ko.unwrap(this.settings.inputSignalNames) || [];

        this.inputSignalNames = inputSignalNames.map(x => x.stringPlaceholderResolver(this.objectID));
        this.outputSignalName = UtilityComponentBaseModel.stringParam(this.settings.outputSignalName, "").stringPlaceholderResolver(this.objectID);
        this.isAsync = ko.unwrap(this.settings.isAsync) === true;
        this.inputSignals = this.inputSignalNames.map(x => this.connector.getSignal(x));
        this.setScript = (value) => this.startProcess(value);
    }

    protected async dispose() {
        await super.dispose();
        this.process.dispose();
        await this.connector.unregisterSignals(...this.inputSignals);
    }

    private processInput() {
        const valuesArray: any [] = [];
        const values: SignalValue = {};

        for (const signal of this.inputSignals) {
            const value = signal.hasValue() ? signal.value() : undefined;
            valuesArray.push(value);
            values[signal.signalName()] = value;
        }

        if (!this.isAsync) {
            try {
                const output = this.scriptFunction(values, valuesArray, this.connector);
                this.writeOutputSignal(output);
            } catch (error) {
                this.connector.handleError(this)(error);
            }
        } else {
            const output = this.scriptFunction(values, valuesArray, this.connector) as Promise<any>;
            output.then(value => this.writeOutputSignal(value))
                .catch(error => this.connector.handleError(this)(error));
        }
    }

    private writeOutputSignal(output) {
        if (this.outputSignalName) {
            const outputValue: SignalValue = {};
            outputValue[this.outputSignalName] = output;
            this.connector.writeSignals(outputValue);
        }
    }

    private startProcess(script: string | KnockoutObservable<string>) {
        const functionBody = UtilityComponentBaseModel.stringParam(script, "return null;").stringPlaceholderResolver(this.objectID).trim();
        this.scriptFunction = new Function("values", "valuesArray", "connector", functionBody);
        this.process = ko.computed(() => this.processInput());
    }
}

export = WfLocalScriptComponent;