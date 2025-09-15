import Signal = require("../../services/models/signal");
import ComponentBaseModel = require("../component-base.model");
import ChangedFieldAnimationService = require("../services/changed-field-animation.service");

interface IWfDateTimePickerParams extends IComponentBaseParams, IChangedFieldAnimationParams, IWriteSecureParams {

    format: string;
    isUTC: boolean;
    isUnix: boolean;
    writeUnix: boolean;
    minDate: string;
    maxDate: string;
    showClear: boolean;
    iconClass: string;
    displayClass: string;
    isBufferedClass: string;
    inputSize: string;
    label: string;
    signalNameLabel: boolean;
    unitLabel: boolean;
    staticUnitText: string;
    iconStyle: string;
    textStyle: string;
    signalName: string;
    autoCommit: boolean;
    writeToBuffer: boolean;
}

class WfDateTimePickerComponent extends ComponentBaseModel<IWfDateTimePickerParams> {

    private format: string;
    private isUTC: boolean;
    private writeUnix: boolean;
    private minDate: string;
    private maxDate: string;
    private showClear: boolean;
    private iconClass: string;
    private displayClass: string;
    private isBufferedClass: string;
    private inputSize: string;
    private label: string;
    private signalNameLabel: boolean;
    private unitLabel: boolean;
    private staticUnitText: string;
    private iconStyle: string;
    private textStyle: string;
    private signalName: string;
    private autoCommit: boolean;
    private writeToBuffer: boolean;
    private isBuffered: KnockoutComputed<boolean>;

    private inputSignalValue: KnockoutComputed<any>;
    private inputSignal: Signal;

    private uncommittedValue: KnockoutObservable<any>;
    private isSelected: KnockoutObservable<boolean>;
    private isEditing: KnockoutObservable<boolean>;

    private showWriteSecure: KnockoutObservable<boolean>;
    private writeSecureValues: KnockoutObservable<any[]>;
    private writeSecure: boolean;

    private datepickerOptions: KnockoutComputed<any>;
    private displayClassNames: KnockoutComputed<string>;

    private signalValue: any;

    protected changedFieldAnimationService: ChangedFieldAnimationService;
    protected cssClass: KnockoutComputed<string> | string;

    constructor(params: IWfDateTimePickerParams) {
        super(params);

        this.connector.getOnlineUpdates(); 

        this.initializeWriteSecure();
        this.initializeComputeds();
        this.initializeChangedFieldAnimation();
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "";
        this.isUTC = ko.unwrap(this.settings.isUTC) !== undefined ? ko.unwrap(this.settings.isUTC) : false;
        this.writeUnix = ko.unwrap(this.settings.isUnix) !== undefined ? ko.unwrap(this.settings.writeUnix) : false;

        this.minDate = ko.unwrap(this.settings.minDate);
        this.maxDate = ko.unwrap(this.settings.maxDate);
        this.showClear = ko.unwrap(this.settings.showClear) !== undefined ? ko.unwrap(this.settings.showClear) : true;

        this.iconClass = ko.unwrap(this.settings.iconClass) || null;
        this.displayClass = ko.unwrap(this.settings.displayClass) || null;
        this.isBufferedClass = ko.unwrap(this.settings.isBufferedClass) || "label-info";
        this.inputSize = ko.unwrap(this.settings.inputSize) ? "input-group-" + ko.unwrap(this.settings.inputSize) : "";

        this.label = (ko.unwrap(this.settings.label) || '').stringPlaceholderResolver(this.objectID);
        this.signalNameLabel = ko.unwrap(this.settings.signalNameLabel) !== undefined ? ko.unwrap(this.settings.signalNameLabel) : false;
        this.unitLabel = ko.unwrap(this.settings.unitLabel) !== undefined ? ko.unwrap(this.settings.unitLabel) : false;
        this.staticUnitText = (ko.unwrap(this.settings.staticUnitText) || '').stringPlaceholderResolver(this.objectID);

        this.iconStyle = ko.unwrap(this.settings.iconStyle) || '';
        this.textStyle = ko.unwrap(this.settings.textStyle) || '';

        this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
        this.uncommittedValue = ko.observable(null);

        this.autoCommit = ko.unwrap(this.settings.autoCommit) !== undefined ? ko.unwrap(this.settings.autoCommit) : false;
        this.isEditing = ko.observable(false);
        this.isSelected = ko.observable(false);

        this.inputSignal = this.connector.getSignal(ko.unwrap(this.signalName));
        this.writeToBuffer = ko.unwrap(this.settings.writeToBuffer) !== undefined ? ko.unwrap(this.settings.writeToBuffer) : false;
    }

    private initializeChangedFieldAnimation() {
        this.changedFieldAnimationService = new ChangedFieldAnimationService(this.settings, this.signalValue as KnockoutObservable<any>, this.displayClassNames);
        this.cssClass = ko.computed(() => {
            return this.changedFieldAnimationService ? this.changedFieldAnimationService.cssClass() || "" : "";
        });
    }

    private initializeWriteSecure() {
        this.writeSecure = ko.unwrap(this.settings.writeSecure) !== undefined ? ko.unwrap(this.settings.writeSecure) : false;
        this.writeSecureValues = ko.observable();
        this.showWriteSecure = ko.observable(false);
    }

    private initializeComputeds() {
        this.isBuffered = ko.computed(() => {
            if (!this.writeToBuffer)
                return false;

            return this.connector.existSignalInBuffer(this.signalName) && !this.connector.signalBufferIsEmpty();
        }, this);

        this.displayClassNames = ko.computed(() => {
            return this.isBuffered() ? this.isBufferedClass : this.displayClass;
        }, this);


        this.inputSignalValue = ko.computed(() => {
            const inputSignalValue = ko.unwrap(this.inputSignal.value);

            if (inputSignalValue != null && this.inputSignal.value != null) {
                if (this.isUTC) {
                    var utcDate = this.format != null && this.format != "" ? moment.utc(inputSignalValue, this.format) : moment.utc(inputSignalValue);
                    return utcDate;
                } else {
                    var date = this.format != null && this.format != "" ? moment(inputSignalValue, this.format) : moment(inputSignalValue);
                    return date;
                }
            }
            return null;
        });

        this.signalValue = ko.computed({
            read: () => {
                if (this.autoCommit) return ko.unwrap(this.inputSignalValue);

                if (!this.isEditing() && !this.isBuffered() && !this.showWriteSecure()) {
                    return ko.unwrap(this.inputSignalValue);
                } else if (!this.isEditing() && this.isBuffered()) {
                    var value = this.connector.readSignalsFromBuffer([this.signalName]);
                    return value.length > 0 ? this.format != null && this.format != "" ? moment(value[0], this.format) : moment(value[0]) : null;
                } else {
                    return this.format != null && this.format != "" ? moment(ko.unwrap(this.uncommittedValue), this.format) : moment(ko.unwrap(this.uncommittedValue));
                }
            },
            write: (value) => {
                this.uncommittedValue(value);

                if (this.autoCommit) {
                    this.writeInputValue();
                    return;
                }

                if (this.uncommittedValue() !== this.inputSignalValue())
                    this.isEditing(true);
            }
        });

        this.datepickerOptions = ko.computed(() => {
            return {
                locale: this.connector.getGenericCulture(ko.unwrap(this.connector.currentLanguageId)),
                format: this.format,
                minDate: this.minDate,
                maxDate: this.maxDate,
                showClear: this.showClear
            }
        });
    }

    private async writeInputValue() {
        if (this.isDisabled()) return;
        let values: SignalValue = {};


        if (!this.signalName)
            return;

        let value: any = null;

        const uncommittedValue = ko.unwrap(this.uncommittedValue)

        if (uncommittedValue) {
            const date = moment(uncommittedValue);
            const formatedDate = date.format(this.format);
            value = this.writeUnix ? date.valueOf() : formatedDate;
        }

        values[this.signalName] = value;

        if (this.writeToBuffer) {
            this.connector.writeSignalsToBuffer(values);
            this.isEditing(false);
        }
        if (this.writeSecure)
            this.writeInputValueSecure(value);
        else {
            // Write signal values, warning if an error will be returned
            const result = await this.connector.writeSignals(values);
            this.isEditing(false);
            if (!result.successful) {
                this.connector.error("Signal write", result.errorMessage);
            }

        }
    }

    private resetInputValue() {
        this.isEditing(false);
    }

    private writeInputValueSecure(value: any) {
        this.isEditing(false);
        this.writeSecureValues([value]);
        this.showWriteSecure(true);
    }

    private cancelWriteSecure() {
        this.isEditing(true);
    }

    protected async dispose() {
        await super.dispose();
        if (this.visualSecurityService)
            this.visualSecurityService.dispose();
        this.changedFieldAnimationService.dispose();
        if (!this.inputSignal) return;
        await this.connector.unregisterSignals(this.inputSignal);
    }
}

export = WfDateTimePickerComponent;