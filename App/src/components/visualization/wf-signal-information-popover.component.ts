import Connector = require("../../services/connector");
import ComponentBaseModel = require("../component-base.model");
import Signal = require("../../services/models/signal");

interface ISignalInformationPopoverProperties {
    name: string;
    label: string;
}

interface IWfSignalInformationPopoverParams extends IComponentBaseParams {

    iconClass: string;
    signalName: string;
    properties: ISignalInformationPopoverProperties[];
    label: string;
    position: string;
    popoverTitle: string;
    headerCssClass: string;
    format: string;
    isAlphanumeric: boolean;
}

class WfSignalInformationPopoverComponent extends ComponentBaseModel<IWfSignalInformationPopoverParams> {
    private popoverContent: KnockoutComputed<string> | string;
    private signalDefinitions: KnockoutObservable<SignalDefinitionDTO>;
    private signal: Signal;
    private signalValue: string;
    private isAlphanumeric: boolean;
    private format: string;
    private title: string;
    private headerCssClass: string;
    private position: string;
    private label: string;
    private properties: ISignalInformationPopoverProperties[];
    private signalName: string;
    private iconClass: string;
    private selectedLanguageId: KnockoutComputed<number>;

    constructor(params: IWfSignalInformationPopoverParams) {
        super(params)
        this.getSignalDefinition();
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.selectedLanguageId = null;

        this.iconClass = ko.unwrap(this.settings.iconClass) || "wf wf-info";
        this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
        this.properties = ko.unwrap(this.settings.properties) || [{ name: 'AliasName', label: 'Signal' } as ISignalInformationPopoverProperties];
        this.label = ko.unwrap(this.settings.label) || "";
        this.position = ko.unwrap(this.settings.position) || "right";
        this.title = ko.unwrap(this.settings.popoverTitle) || "&nbsp;";
        this.headerCssClass = ko.unwrap(this.settings.headerCssClass) || "popover-primary";
        

        this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[00]";
        this.isAlphanumeric = ko.unwrap(this.settings.isAlphanumeric) !== undefined ? ko.unwrap(this.settings.isAlphanumeric) : false;

        //   this.popoverContent = "";
        this.signalValue = "";

        this.signal = this.connector.getSignal(this.signalName);
        this.signalDefinitions = ko.observable<SignalDefinitionDTO>({} as SignalDefinitionDTO);

        this.selectedLanguageId = this.connector.currentLanguageId;
        this.selectedLanguageId.subscribe(() => {
            // Reload the signal information on language change
            this.getSignalDefinition();
        });


        this.popoverContent = ko.computed(() => {
            var resultHtml = '<table class="table table-condensed m-b-0" >';
            for (var i = 0; i < this.properties.length; i++) {
                var property = this.properties[i];
                var row = "<tr>";

                if (!property.label && !property.name) continue;

                if (property.label)
                    row = row + "<th>" + property.label + "</th>";

                if (property.name === "CurrentValue") {
                    row = row + "<td>" +
                        (this.isAlphanumeric
                            ? ko.unwrap(this.signal.value) :
                            ko.unwrap(this.signal.value.extend({
                                numeralNumber: this.format
                            }))) + "</td>";
                }
                else {
                    row = row + "<td>" + this.getSignalDefinitionProperty(property.name) + "</td>";
                }

                resultHtml = resultHtml + row + (i !== this.properties.length - 1 ? " </tr>" : "");
            }
            resultHtml = resultHtml + "</table>";

            return resultHtml;
        });
    }

    private getSignalDefinitionProperty(propertyName: string) {
        if (!propertyName || !this.signalDefinitions())
            return "";

        //Simple property of SignalDefinitionDTO
        if (_.indexOf(propertyName, '.') === -1)
            return !isNullOrUndefined(this.signalDefinitions()[propertyName]) ? this.signalDefinitions()[propertyName] : "";

        var options = propertyName.split(".");
        var logs = this.signalDefinitions()[options[0]];
        if (!logs) return "";
        return logs[options[1]] || ""; //DTO property of SignalDefinitionDTO
    }


    private async getSignalDefinition() {
        try {
            const definition = await this.connector.getSignalDefinition(this.signalName) as SignalDefinitionDTO;
            this.signalDefinitions(definition);
        } catch (error) {
            this.connector.handleError(WfSignalInformationPopoverComponent)(error);
        }
    }

    protected async dispose() {
        super.dispose();
    }
}

export = WfSignalInformationPopoverComponent;
