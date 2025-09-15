import Signal = require("../../services/models/signal");
import ComponentBaseModel = require("../component-base.model");
import ChangedFieldAnimationService = require("../services/changed-field-animation.service");
import SignalArrayService = require("../services/signal-array.service");
import PendingChangedAnimationService = require("../services/pending-changed-animation.service");
import { IPendingChangedAnimationParams } from "../models/pending-changed-animation.params";

declare var numeral;

/**
 * This interface contains the HTML parameters for the WfInputComponent.
 * 
 * @interface IWfInputParams
 * @extends {IComponentBaseParams}
 * @extends {IChangedFieldAnimationParams}
 * @extends {IWriteSecureParams}
 */
interface IWfInputParams extends IComponentBaseParams, IChangedFieldAnimationParams, IWriteSecureParams, ISignalArrayParams, IPendingChangedAnimationParams {
    format: string;
    isAlphanumeric: boolean;
    unitLabel: boolean;
    staticUnitText: string;
    signalName: string;

    iconClass: string;
    displayClass: string;
    displaySize: string;
    label: string;
    signalNameLabel: boolean;
    iconStyle: string;
    textStyle: string;

    isBufferedClass: string;
    inputSize: string;
    writeToBuffer: boolean;
    popoverPosition: string;

    autoDetectType: boolean;
}

class WfInputComponent extends ComponentBaseModel<IWfInputParams> {
    private signalArrayService: SignalArrayService;
    private showWriteSecure: KnockoutObservable<boolean>;
    private writeSecureValues: KnockoutObservable<any[]>;
    private writeSecure: boolean;

    private displayClassNames: KnockoutComputed<string>;
    private isBuffered: KnockoutComputed<boolean>;
    private writeToBuffer: boolean;
    private inputSize: string;
    private isBufferedClass: string;
    private inputSignalValue: KnockoutComputed<any>;
    private inputSignal: Signal;
    private isSelected: KnockoutObservable<boolean>;
    private isEditing: KnockoutObservable<boolean>;
    private signalValue: any;
    private uncommittedValue: KnockoutObservable<any>;
    private signalName: string;
    private staticUnitText: string;
    private unitLabel: boolean;
    private isAlphanumeric: boolean;
    private virtualKeyboardType: KnockoutObservable<string>;
    private format: string;

    private iconClass: string;
    private displayClass: string;
    private label: string;
    private signalNameLabel: boolean;
    private iconStyle: string;
    private textStyle: string;
    private popoverPosition: string;

    private autoDetectType: boolean;

    protected changedFieldAnimationService: ChangedFieldAnimationService;
    protected pendingChangedAnimationService: PendingChangedAnimationService;
    protected cssClass: KnockoutComputed<string> | string;


    constructor(params: IWfInputParams) {
        super(params);

        this.inputSignal = this.connector.getSignal(ko.unwrap(this.signalName));
        this.initializeSignalArray();
        this.initializeWriteSecure();
        this.initializeComputeds();
        this.initializeAnimationServices();
        this.connector.getOnlineUpdates();
    }

    private formatNumber(current: any, format: string) {
        var numeralFormat = format || "0,0.00";

        var newValueAsNum = isNaN(current) || current === null || typeof (current) === "undefined" ? "NaN" : parseFloat(current);

        if (newValueAsNum !== "NaN") {
            return numeral(newValueAsNum).format(numeralFormat);
        }

        return newValueAsNum;
    }

    private initializeAnimationServices() {
        this.changedFieldAnimationService = new ChangedFieldAnimationService(this.settings, this.signalValue as KnockoutObservable<any>, this.displayClassNames);
        this.pendingChangedAnimationService = new PendingChangedAnimationService(this.settings, this.inputSignal, this.displayClassNames);

        this.cssClass = ko.computed(() => {
            const changedFieldAnimation = this.changedFieldAnimationService ? this.changedFieldAnimationService.cssClass() || "" : "";
            const pendingChangedAnimation = this.pendingChangedAnimationService ? this.pendingChangedAnimationService.cssClass() || "" : "";
            return `${changedFieldAnimation} ${pendingChangedAnimation}`
        });
    }

    private initializeWriteSecure() {
        this.writeSecure = ko.unwrap(this.settings.writeSecure) !== undefined ? ko.unwrap(this.settings.writeSecure) : false;
        this.writeSecureValues = ko.observable();
        this.showWriteSecure = ko.observable(false);
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[000]";
        this.isAlphanumeric = ko.unwrap(this.settings.isAlphanumeric) !== undefined ? ko.unwrap(this.settings.isAlphanumeric) : false;

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
        this.popoverPosition = ko.unwrap(this.settings.popoverPosition) || 'top';

        this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);

        this.uncommittedValue = ko.observable<any>();
        this.signalValue = null;

        this.isEditing = ko.observable(false);
        this.isSelected = ko.observable(false);

        this.writeToBuffer = ko.unwrap(this.settings.writeToBuffer) !== undefined ? ko.unwrap(this.settings.writeToBuffer) : false;

        this.virtualKeyboardType = ko.observable<string>(this.isAlphanumeric ? 'num' : 'alpha');

        this.autoDetectType = this.settings.autoDetectType || false;
    }

    protected initializeComputeds() {
        if (this.inputSignal) {
            this.inputSignalValue = ko.computed(() => {
                this.detectType(this.inputSignal.value());
                if (this.signalArrayService.isArray) {
                    return this.signalArrayService.signalValue();
                } else if (this.isAlphanumeric) {
                    return this.inputSignal.value();
                } else {
                    return this.formatNumber(this.inputSignal.value(), this.format)
                }
            });
        }

        this.isBuffered = ko.computed(() => {
            if (!this.writeToBuffer)
                return false;
            return this.connector.existSignalInBuffer(this.signalName) && !this.connector.signalBufferIsEmpty();
        });

        this.displayClassNames = ko.computed(() => {
            return this.isBuffered() == true ? this.isBufferedClass : this.displayClass;

        });

        this.signalValue = ko.computed({
            read: () => {
                if (!this.isEditing() && !this.isBuffered() && !this.showWriteSecure()) {
                    return ko.unwrap(this.inputSignalValue);
                } else if (!this.isEditing() && this.isBuffered()) {
                    var value = this.connector.readSignalsFromBuffer([this.signalName]);
                    return value.length > 0 ? value[0] : null;
                }
                else if (!this.isEditing() && this.isBuffered()) {
                    var value = this.connector.readSignalsFromBuffer([this.signalName]);
                    return value.length > 0 ? value[0] : null;
                } else {
                    return ko.unwrap(this.uncommittedValue);
                }
            },
            write: (value) => {
                this.uncommittedValue(value);
                this.isEditing(true);
                this.pendingChangedAnimationService.onValueChangeRequested();
            }
        });
    }

    private initializeSignalArray() {
        this.signalArrayService = new SignalArrayService(this.settings, this.inputSignal);
    }

    private writeInputValueSecure(value: any) {
        this.isEditing(false);
        this.writeSecureValues([value]);
        this.showWriteSecure(true);
    }

    public cancelWriteSecure() {
        this.isEditing(true);
    }

    public successWriteSecure() {
        this.pendingChangedAnimationService.onValueChangeRequested();
    }

    private async writeInputValue() {
        if (this.isDisabled()) return;
        const values: SignalValue = {};


        if (!this.signalName) return;

        var unwrapedValue = ko.unwrap(this.uncommittedValue);

        this.detectType(unwrapedValue);

        const value = this.isAlphanumeric ? unwrapedValue : numeral(unwrapedValue).value();
        values[this.signalName] = value;

        if (this.signalArrayService.isArray) {
            values[this.signalName] = this.signalArrayService.getWriteValues(values[this.signalName]);
        }

        if (this.writeToBuffer) {
            this.connector.writeSignalsToBuffer(values);
            this.isEditing(false);
        }
        else if (this.writeSecure) {
            this.writeInputValueSecure(values[this.signalName]);
        }
        else {
            const result = await this.connector.writeSignals(values)
            // Write signal values, warning if an error will be returned
            this.isEditing(false);
            if (!result.successful) {
                this.connector.error("Signal write", result.errorMessage);
            } else {
                this.pendingChangedAnimationService.onValueChangeRequested();
            }
        }
    }

    public resetInputValue() {
        this.isEditing(false);
        this.pendingChangedAnimationService.onValueChangeCanceled();
    }

    public keyupEventHandler(data, event) {
        if (event.which === 13) {
            this.writeInputValue();
        }
    }

    private detectType(value: any) {
        if (!this.autoDetectType)
            return;

        if (!this.signalArrayService.isArray) {
            this.isAlphanumeric = !$.isNumeric(value);
            this.virtualKeyboardType(this.isAlphanumeric ? 'num' : 'alpha');
        }
    }


    /**
     *  Place here signal cleanup functionality.
     * 
     * @protected
     * @returns 
     * 
     * @memberOf WfInputComponent
     */
    protected async dispose() {
        await super.dispose();
        this.changedFieldAnimationService.dispose();
        this.pendingChangedAnimationService.dispose();
        if (!this.inputSignal) return;
        await this.connector.unregisterSignals(this.inputSignal);
    }
}

export = WfInputComponent;
