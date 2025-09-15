import Connector = require("../../services/connector");
import Signal = require("../../services/models/signal");
import ComponentBaseModel = require("../component-base.model");

interface IWfSignalInformationParams extends IComponentBaseParams {
    signalName: string;
    propertyName: string;
    logTagName: string;
}

class WfSignalInformationComponent extends ComponentBaseModel<IWfSignalInformationParams> {

    private logTagName: string;
    private selectedLanguageId: KnockoutComputed<number>;
    private signalName: string;
    private propertyName: string;
    private signalDefinitions: KnockoutObservable<SignalDefinitionDTO>;
    private output: KnockoutObservable<string> = ko.observable<string>("");

    constructor(params: IWfSignalInformationParams) {
        super(params);
        // Stop processing here if no signalname is defined
        if (!this.signalName) {
            return;
        }
        this.getOutput();
        // Get signal information
        this.getSignalDefinition();
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.signalDefinitions = ko.observable({} as SignalDefinitionDTO);
        this.signalDefinitions.subscribe(definition => {
            this.output(this.getOutput());
        }, this);

        this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
        this.propertyName = ko.unwrap(this.settings.propertyName) || 'Unit';
        this.logTagName = (ko.unwrap(this.settings.logTagName) || '').stringPlaceholderResolver(this.objectID);

        this.selectedLanguageId = this.connector.currentLanguageId;
        this.selectedLanguageId.subscribe(() => {
            // Reload the signal information on language change
            this.getSignalDefinition();
        });
    }

    private getOutput(): string {

        if (!this.propertyName)
            return "";

        //Simple property of SignalDefinitionDTO
        if (_.indexOf(this.propertyName, '.') === -1)
            return !isNullOrUndefined(this.signalDefinitions()[this.propertyName]) ? this.signalDefinitions()[this.propertyName] : "";

        var options = this.propertyName.split(".");
        var logs = this.signalDefinitions()[options[0]];
        if (!logs) return "";


        if (_.isArray(logs)) {//Logs, Array property of SignalDefinitionDTO
            if (options[0] !== "Logs") return "";

            if (!this.logTagName)
                return "";

            var length = logs.length;
            for (var j = 0; j < length; j++)
                if (logs[j]["LogTag"] === this.logTagName)
                    return logs[j][options[1]] || "";
        }

        return logs[options[1]] || ""; //DTO property of SignalDefinitionDTO
    }

    private async getSignalDefinition() {
        try {
            const definition = await this.connector.getSignalDefinition(this.signalName) as SignalDefinitionDTO;
            if (definition) {
                this.signalDefinitions(definition);
            }

        } catch (error) {
            this.connector.handleError(WfSignalInformationComponent);
        }
    }

    protected async dispose() {
        await super.dispose();
    }
}

export = WfSignalInformationComponent;
