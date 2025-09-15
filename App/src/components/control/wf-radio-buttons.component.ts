import ComponentBaseModel = require("../component-base.model");
import Signal = require("../../services/models/signal");
import SignalArrayService = require("../services/signal-array.service");

interface IWfRadioButtonsParams extends IComponentBaseParams, IWriteSecureParams, ISignalArrayParams {
    options: any[];
    signalName: string;
    groupName: string;
    showInline: boolean;
    writeToBuffer: boolean;
    isBufferedClass: string;
}

class WfRadioButtonsComponent extends ComponentBaseModel<IWfRadioButtonsParams> {
    public inputSignalValue: KnockoutObservable<any>;
    public signalArrayService: SignalArrayService;
    public checkedValue: KnockoutObservable<string> = ko.observable();
    public isBufferedClass: string;
    public displayClassNames: KnockoutComputed<string>;
    public isBuffered: KnockoutComputed<boolean>;
    public inputSignal: Signal;
    public writeToBuffer: boolean;
    public showInline: boolean;
    public groupName: string;
    public signalValue: any;
    public signalName: string;
    public options: any[];

    public showWriteSecure: KnockoutObservable<boolean>;
    public writeSecureValues: KnockoutObservable<any[]>;
    public writeSecureSignalName: KnockoutObservable<string>;
    public writeSecure: boolean;

    constructor(params: IWfRadioButtonsParams) {
        super(params);
        this.initializeWriteSecure();

        if (!ko.unwrap(this.signalName))
            return;

        this.inputSignal = this.connector.getSignal(ko.unwrap(this.signalName));
        this.initializeSignalArray();

        if (this.inputSignal) {
            if (this.signalArrayService.isArray) {
                this.inputSignalValue = this.signalArrayService.signalValue;
            } else {
                this.inputSignalValue = this.inputSignal.value;
            }
            this.checkedValue(this.inputSignalValue().toString());
            this.inputSignalValue.subscribe(this.setCheckedValue());
        }

        this.initializeComputeds();

        this.connector.getOnlineUpdates();

        this.checkedValue.subscribe((value) => {
            if (value === this.inputSignalValue().toString()) return;
            this.writeSignalValue(value);
        });
    }

    private setCheckedValue(): (newValue: any) => void {
        return (newValue: any) => {
            if (this.isBuffered())
                return;
            const value = newValue !== null && newValue !== undefined ? newValue.toString() : newValue;
            this.checkedValue(value);
        };
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.options = this.settings.options || [];
        this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
        this.groupName = (ko.unwrap(this.settings.groupName) !== undefined ? (ko.unwrap(this.settings.groupName) || '').stringPlaceholderResolver(this.objectID) : this.signalName) + ko.unwrap(this.id);

        this.showInline = ko.unwrap(this.settings.showInline) !== undefined ? ko.unwrap(this.settings.showInline) : false;
        this.writeToBuffer = ko.unwrap(this.settings.writeToBuffer) !== undefined ? ko.unwrap(this.settings.writeToBuffer) : false;

        this.isBufferedClass = ko.unwrap(this.settings.isBufferedClass) || "text-info";

        this.extendOptions();
    }

    private initializeComputeds() {

        this.isBuffered = ko.computed(() => {
            if (!this.writeToBuffer)
                return false;

            return this.connector.existSignalInBuffer(this.signalName) && !this.connector.signalBufferIsEmpty();
        });

        this.displayClassNames = ko.computed(() => {
            return this.isBuffered() == true ? this.isBufferedClass : "";;
        });
    }

    private initializeWriteSecure() {
        this.writeSecure = ko.unwrap(this.settings.writeSecure) !== undefined ? ko.unwrap(this.settings.writeSecure) : false;
        this.writeSecureValues = ko.observable();
        this.writeSecureSignalName = ko.observable<string>();
        this.showWriteSecure = ko.observable(false);
    }

    private initializeSignalArray() {
        this.signalArrayService = new SignalArrayService(this.settings, this.inputSignal);
    }

    private async writeSignalValue(value: any) {
        if (this.isDisabled()) return;
        const values: SignalValue = {};

        const item = this.options.find(option => option.signalValue === value);

        if (!ko.unwrap(this.signalName) || !item || item.writeValue === undefined) return;

        values[this.signalName] = ko.unwrap(item.writeValue);

        if (this.signalArrayService.isArray) {
            values[this.signalName] = this.signalArrayService.getWriteValues(values[this.signalName]);
        }

        if (this.writeToBuffer) {
            this.connector.writeSignalsToBuffer(values);
        } else if (this.writeSecure) {
            this.writeInputValueSecure(this.signalName, values[this.signalName]);
        }
        else {
            // Write signal values, warning if an error will be returned
            await this.connector.writeSignals(values);
        }
    }

    private writeInputValueSecure(signalName: string, value: any) {
        this.writeSecureValues([value]);
        this.writeSecureSignalName(signalName);
        this.showWriteSecure(true);
    }

    public setCurrentSignalValue() {
        this.checkedValue(this.inputSignalValue());
    }

    protected async dispose() {
        await super.dispose();
        if (!this.inputSignal) return;
        await this.connector.unregisterSignals(this.inputSignal);

    }

    private extendOptions(): void {
        for (let option of this.options) {
            option.writeValue = option.signalValue;
            option.signalValue = option.signalValue !== null && option.signalValue !== undefined ? option.signalValue.toString() : option.signalValue;
        }
    }
}

export = WfRadioButtonsComponent;
