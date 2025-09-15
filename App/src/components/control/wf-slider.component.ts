import Connector = require("../../services/connector");
import Signal = require("../../services/models/signal");
import ComponentBaseModel = require("../component-base.model");
import SignalArrayService = require("../services/signal-array.service");

declare var numeral;

interface IWfSliderParams extends IComponentBaseParams, IWriteSecureParams, ISignalArrayParams {
    signalName: string;
    minRange: number;
    maxRange: number;
    event: "change" | "slideStop";
    writeDelay: number;
    step: number;
    majorTicks: number;
    tooltip: 'show' | 'hide' | 'always';
    orientation: 'vertical' | 'horizontal';
    handle: 'round' | 'square' | 'triangle' | 'custom';
    scale: 'linear' | 'logarithmic';
    reversed: boolean;
    showTickLabels: boolean;
    unitLabel: boolean;
    cssClass: string;
    height: number;
    format: string;
    writeToBuffer: boolean;
    isBufferedClass: string;
}

class WfSliderComponent extends ComponentBaseModel<IWfSliderParams> {
    private signalArrayService: SignalArrayService;
    private showWriteSecure: KnockoutObservable<boolean>;
    private writeSecureValues: KnockoutObservable<any[]>;
    private writeSecure: boolean;

    private ticks_labels: number[];
    private ticks: number[];
    private selectedLanguageId: KnockoutComputed<number>;
    private displayClassNames: KnockoutComputed<string>;
    private isBuffered: KnockoutComputed<boolean>;
    private signalDefinitions: KnockoutObservable<SignalDefinitionDTO>;
    private unit: KnockoutObservable<string>;
    private isBufferedClass: string;
    private writeToBuffer: boolean;
    private committedValue: KnockoutObservable<any>;
    private unCommittedValue: KnockoutObservable<any>;
    private format: string;
    private height: number;
    private cssClass: string;
    private unitLabel: boolean;
    private showTickLabels: boolean;
    private reversed: boolean;
    private tooltip: "show" | "hide" | "always";
    private orientation: "vertical" | "horizontal";
    private handle: "round" | "square" | "triangle" | "custom";
    private scale: "linear" | "logarithmic";
    private majorTicks: number;
    private step: number;
    private writeDelay: number;
    private event: "change" | "slideStop";
    private maxRange: number;
    private minRange: number;
    private refresh: KnockoutObservable<boolean>;
    private signalName: string;
    private inputSignalValue: KnockoutObservable<any>;
    private inputSignal: Signal;
    private count: number;

    constructor(params: IWfSliderParams) {
        super(params)
        this.count = 0;

        this.checkSettings();
        this.setScale();
        this.getSignalDefinition();

        this.inputSignal = this.connector.getSignal(ko.unwrap(this.signalName));
        this.initializeSignalArray();

        if (this.signalArrayService.isArray) {
            this.inputSignalValue = this.signalArrayService.signalValue;
        } else {
            this.inputSignalValue = this.inputSignal.value;
        }

        this.initializeWriteSecure();
        this.initializeComputeds();

        this.updateValues(this.inputSignal.value());

        this.connector.getOnlineUpdates(); 

    }

    private updateValues(newValue: any) {
        if (this.isBuffered()) return;
        if (isNaN(newValue)) return;

        this.unCommittedValue(newValue);
        this.committedValue(numeral(newValue).format(this.format));
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.selectedLanguageId = this.connector.currentLanguageId;

        this.minRange = ko.unwrap(this.settings.minRange) ? ko.unwrap(this.settings.minRange) : 0;
        this.maxRange = ko.unwrap(this.settings.maxRange) ? ko.unwrap(this.settings.maxRange) : 100;
        this.refresh = ko.observable(false);
        this.event = ko.unwrap(this.settings.event) || "slideStop";
        this.writeDelay = ko.unwrap(this.settings.writeDelay) || 100;
        this.signalDefinitions = ko.observable({} as SignalDefinitionDTO);
        this.step = ko.unwrap(this.settings.step) || 1;
        this.majorTicks = ko.unwrap(this.settings.majorTicks) || 5;
        this.tooltip = ko.unwrap(this.settings.tooltip) || "show"; //  Accepts: 'show', 'hide', or 'always'
        this.orientation = ko.unwrap(this.settings.orientation) || "horizontal"; // Accepts 'vertical' or 'horizontal'
        this.handle = ko.unwrap(this.settings.handle) || "round"; // Accepts: 'round', 'square', 'triangle' or 'custom'
        this.scale = ko.unwrap(this.settings.scale) || "linear";  // Accepts: 'linear' and 'logarithmic'  
        this.reversed = ko.unwrap(this.settings.reversed) !== undefined ? ko.unwrap(this.settings.reversed) : false;
        this.showTickLabels = ko.unwrap(this.settings.showTickLabels) !== undefined ? ko.unwrap(this.settings.showTickLabels) : false;
        this.unitLabel = ko.unwrap(this.settings.unitLabel) !== undefined ? ko.unwrap(this.settings.unitLabel) : false;
        this.cssClass = ko.unwrap(this.settings.cssClass) || "";
        this.height = ko.unwrap(this.settings.height) || null;

        this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[00]";
        this.signalName = (ko.unwrap(this.settings.signalName) || "").stringPlaceholderResolver(this.objectID);
        this.unCommittedValue = ko.observable<any>();
        this.committedValue = ko.observable<any>();
        this.unit = ko.observable<string>();
        this.tooltipText = (ko.unwrap(this.connector.translate(this.settings.tooltipText)()) || "").stringPlaceholderResolver(this.objectID);

        this.writeToBuffer = ko.unwrap(this.settings.writeToBuffer) !== undefined ? ko.unwrap(this.settings.writeToBuffer) : false;
        this.isBufferedClass = ko.unwrap(this.settings.isBufferedClass) || "slider-info";
    }

    private initializeComputeds() {
        this.inputSignalValue.subscribe((newValue) => {
            this.updateValues(newValue);
        });

        this.isBuffered = ko.computed(() => {
            if (!this.writeToBuffer)
                return false;
            return this.connector.existSignalInBuffer(this.signalName) && !this.connector.signalBufferIsEmpty();
        });

        this.displayClassNames = ko.computed(() => {
            return this.isBuffered() == true ? this.isBufferedClass : this.cssClass;
        });
    }

    private initializeWriteSecure() {
        this.writeSecure = ko.unwrap(this.settings.writeSecure) !== undefined ? ko.unwrap(this.settings.writeSecure) : false;
        this.writeSecureValues = ko.observable();
        this.showWriteSecure = ko.observable(false);
    }


    private initializeSignalArray() {
        this.signalArrayService = new SignalArrayService(this.settings, this.inputSignal);
    }

    private checkSettings() {
        if (!this.signalName) {
            console.error("signalName not defined");
            throw "signalName not defined";
        }
        if (this.minRange >= this.maxRange) {
            this.minRange = 0;
            this.maxRange = 100;
            console.warn("maxRange can't be smaller than minRange, used default values");
        }
        if (this.event !== "slideStop" && this.event !== "change") {
            this.event = "slideStop";
            console.warn("event not correctly set, use default value");
        }

        if (this.writeDelay < 0) {
            this.writeDelay = 100;
            console.warn("writeDelay not correctly set, use default value");
        }

        if (this.scale === "logarithmic") {
            if (this.maxRange > 800) {
                console.warn("maxRange can't be greather than 800, if logarithmic scale is true, used 800 as value");
                this.maxRange = 800;
            }
            if (this.minRange < 0) {
                this.minRange = 1;
                console.warn("negative minRange not supported if logarithmic scale is true, used default values");
            }
        }
    }


    private toValue(percentage: number) {
        var min = (this.minRange === 0) ? 0 : Math.log(this.minRange);
        var max = Math.log(this.maxRange);
        var value = Math.exp(min + (max - min) * percentage / 100);
        value = this.minRange + Math.round((value - this.minRange))
        return value;

    }

    private setScale() {
        if (this.showTickLabels) {
            this.ticks = _.map(_.range(this.minRange, this.maxRange + 1, (this.maxRange - this.minRange) / (this.majorTicks - 1)), (num) => {
                return parseFloat(num as any);
            });
            this.ticks_labels = _.map(_.range(this.minRange, this.maxRange + 1, (this.maxRange - this.minRange) / (this.majorTicks - 1)), (num) => {
                return (numeral(num).format(this.format));
            });
            if (this.scale === "logarithmic") {
                this.ticks = _.map(_.range(this.minRange, this.maxRange + 1, (this.maxRange - this.minRange) / (this.majorTicks - 1)), (num) => {
                    return parseFloat(this.toValue((num) / ((this.maxRange - this.minRange) / 100)) as any);
                });
                this.ticks_labels = _.map(_.range(this.minRange, this.maxRange + 1, (this.maxRange - this.minRange) / (this.majorTicks - 1)), (num) => {
                    return parseFloat(this.toValue((num) / ((this.maxRange - this.minRange) / 100)) as any);
                });
            }
        }
        else {
            this.ticks = [];
            this.ticks_labels = [];
        }
    }

    private async getSignalDefinition() {
        try {
            const definitions = await this.connector.getSignalDefinitions([this.signalName]);
            this.signalDefinitions((definitions[0] || {}) as SignalDefinitionDTO);
            this.unit(this.signalDefinitions().Unit);
        } catch (error) {
            this.connector.handleError(WfSliderComponent)(error)
        }
    }

    private slideStop(e, data) {
        if (this.event === "slideStop") {
            this.writeInputValue(data.value);
        }

    }

    private change(e, data) {
        if (this.event === "change") {
            this.count += 1;
            setTimeout(() => {
                this.count -= 1;
                if (this.count <= 0) {
                    this.writeInputValue(data.value.newValue);
                    this.count = 0;
                }
            }, this.writeDelay);
        }
    }

    private writeInputValueSecure(value: any) {
        this.writeSecureValues([value]);
        this.showWriteSecure(true);
    }

    private cancelWriteSecure() {
        this.unCommittedValue(this.committedValue());
    }

    private async writeInputValue(value: number) {
        if (this.isDisabled()) return;
        var values : SignalValue = {};

        if (!this.signalName) return;

        if (this.signalDefinitions().Maximum >= value && this.signalDefinitions().Minimum <= value) {
            values[this.signalName] = value;
        } else {
            //console.warn(this, "out of Range");
            if (this.signalDefinitions().Maximum < value)
                values[this.signalName] = this.signalDefinitions().Maximum;
            if (this.signalDefinitions().Minimum > value)
                values[this.signalName] = this.signalDefinitions().Minimum;
            this.unCommittedValue(values[this.signalName]);
        }

        if (this.signalArrayService.isArray) {
            values[this.signalName] = this.signalArrayService.getWriteValues(values[this.signalName]);
        }

        if (this.writeToBuffer)
            this.connector.writeSignalsToBuffer(values);
        else if (this.writeSecure) {
            this.writeInputValueSecure(values[this.signalName]);
        }
        else {
            const result = await this.connector.writeSignals(values)
            if (!result.successful) {
                this.connector.error("Signal write", result.errorMessage);
                this.unCommittedValue(ko.unwrap(this.inputSignalValue()));
            }
        }
    }

    protected async dispose() {
        await super.dispose();
        await this.connector.unregisterSignals(this.inputSignal);
    }
}

export = WfSliderComponent;
