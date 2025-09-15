import Connector = require("../../../services/connector");
import ComponentBaseModel = require("../../component-base.model");

interface IWfComboboxDiscreteValueComponentParams extends IComponentBaseParams, IWriteSecureParams {
    symbolicTextNormalState: string;
    cssClassNormalState: string;
    cssClass: string;
    iconStyle: string;
    iconClass: string;
    textStyle: string;
    buttonStyle: string;
    dropdownAlignment: string;
    dropdownDirection: string;
    writeToBuffer: boolean;
    signalName: string;
}

interface ISignalWriteItem {
    symbolicText: string;
    signalName: string;
    value: any;
}

class WfComboboxDiscreteValueComponent extends ComponentBaseModel<IWfComboboxDiscreteValueComponentParams> {
    private signalName: string;

    private writeSecureSignalNames: KnockoutObservable<string[]>;
    private showWriteSecure: KnockoutObservable<boolean>;
    private writeSecureValues: KnockoutObservable<any[]>;
    private writeSecure: boolean;

    private signalWriteItems = ko.observableArray<ISignalWriteItem>([]);
    private writeToBuffer: boolean;
    private stateProperties: any;

    private dropdownAlignment: string;
    private dropdownDirection: string;
    private textStyle: string;
    private buttonStyle: string;
    private iconStyle: string;
    private cssClass: string;
    private cssClassNormalState: string;
    private symbolicTextNormalState: string;

    private selectedLanguageId: KnockoutComputed<number>;

    constructor(params: IWfComboboxDiscreteValueComponentParams) {
        super(params)
        this.initializeWriteSecure();
        this.getSignalDefinition();
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
        this.symbolicTextNormalState = (ko.unwrap(this.settings.symbolicTextNormalState) ? ko.unwrap(this.settings.symbolicTextNormalState) : "Select an option").stringPlaceholderResolver(this.objectID);
        this.cssClassNormalState = ko.unwrap(this.settings.cssClassNormalState) ? ko.unwrap(this.settings.cssClassNormalState) : "";
        this.cssClass = ko.unwrap(this.settings.cssClass) ? ko.unwrap(this.settings.cssClass) : "btn-default";

        this.iconStyle = ko.unwrap(this.settings.iconStyle) || '';
        this.textStyle = ko.unwrap(this.settings.textStyle) || '';
        this.buttonStyle = ko.unwrap(this.settings.buttonStyle) || '';

        this.dropdownAlignment = ko.unwrap(this.settings.dropdownAlignment) || "left";
        this.dropdownDirection = ko.unwrap(this.settings.dropdownDirection) === "up" ? "dropup" : "";

        this.stateProperties = {
            'symbolicTextNormalState': ko.unwrap(this.symbolicTextNormalState),
            states: []
        };

        this.writeToBuffer = ko.unwrap(this.settings.writeToBuffer) !== undefined ? ko.unwrap(this.settings.writeToBuffer) : false;
        this.stateProperties["writeToBuffer"] = this.writeToBuffer;

        this.selectedLanguageId = this.connector.currentLanguageId;    
        this.getSignalDefinition();
    }

    private fillDropdown(values: DiscreteValueDTO[]) {
        this.stateProperties.states = [];
        this.signalWriteItems([]);
        _.each(values, (item) => {
            this.stateProperties.states.push({
                signalName: this.signalName,
                maskSignal: item.Value,
                symbolicText: item.Description
            });

            this.signalWriteItems.push({
                symbolicText: item.Description,
                signalName: this.signalName,
                value: item.Value
            });
        });
    }

    private initializeWriteSecure() {
        this.writeSecure = ko.unwrap(this.settings.writeSecure) !== undefined ? ko.unwrap(this.settings.writeSecure) : false;
        this.writeSecureValues = ko.observable();
        this.writeSecureSignalNames = ko.observable<string[]>();
        this.showWriteSecure = ko.observable(false);
    }

    private writeInputValueSecure(data: any) {
        if (this.isDisabled()) return;

        this.writeSecureValues([data.value]);
        this.writeSecureSignalNames([data.signalName]);
        this.showWriteSecure(true);
    }

    private updateStatus = async (data) => {
        const values: SignalValue = {};
        values[data.signalName] = data.value;

        if (_.size(values) === 0) return;

        if (this.writeToBuffer)
            this.connector.writeSignalsToBuffer(values);
        else if (this.writeSecure)
            this.writeInputValueSecure(data);
        else {
            const result = await this.connector.writeSignals(values)
            if (!result.successful) {
                this.connector.error("Signal write", result.errorMessage);
            }
        }
    };

    private async getSignalDefinition() {
        try {
            const definition = await this.connector.getSignalDefinition(this.signalName) as SignalDefinitionDTO;
            if (definition) {
                this.fillDropdown(definition.DiscreteValues);
            }

        } catch (error) {
            this.connector.handleError(WfComboboxDiscreteValueComponent);
        }
    }

    protected async dispose() {
        await super.dispose();
    }
}

export = WfComboboxDiscreteValueComponent;
