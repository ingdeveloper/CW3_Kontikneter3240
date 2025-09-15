import ComponentBaseModel = require("../component-base.model");
import SignalsService = require("../../services/signalsService");

interface IWfChart1PopupParams extends IComponentBaseParams {
    objectSettings: string;
    objectNameID: string;
    signalPrefix: string;
    timeRange: "1h" | "2h" | "8h" | "12h" | "24h";
}

interface IChart1PopupLogTags {
    signalName: string;
    logTagName: string;
}

class WfChart1PopupComponent extends ComponentBaseModel<IWfChart1PopupParams> {

    public readonly logs = ko.observableArray<IChart1PopupLogTags>();
    public objectSettings: string;
    public objectNameID: string;
    public signalPrefix: string;
    public timeRange: "1h" | "2h" | "8h" | "12h" | "24h";
    public timeSettings: { startOffset: string; startOffsetIntervall: number; };

    constructor(params: IWfChart1PopupParams) {
        super(params);
        this.setTimeRange();
        this.getDataAsync();
    }

    protected initializeSettings() {
        super.initializeSettings();
        this.objectSettings = (ko.unwrap(this.settings.objectSettings) || "").stringPlaceholderResolver(this.objectID);
        this.signalPrefix = (ko.unwrap(this.settings.signalPrefix) || "").stringPlaceholderResolver(this.objectID);
        this.objectNameID = (ko.unwrap(this.settings.objectNameID) || "").stringPlaceholderResolver(this.objectNameID);
        this.timeRange = ko.unwrap(this.settings.timeRange) || "1h";
    }

    private setTimeRange() {
        let startOffsetIntervall = 1;
        switch (this.timeRange) {
            case "2h":
                startOffsetIntervall = 2;
                break;
            case "8h":
                startOffsetIntervall = 8;
                break;
            case "12h":
                startOffsetIntervall = 12;
                break;
            case "24h":
                startOffsetIntervall = 24;
                break;
        }

        this.timeSettings = {
            startOffset: "hours",
            startOffsetIntervall: startOffsetIntervall
        };
    }

    private async getDataAsync() {
        let signalNames = [];
        let signalDefinitions = [] as CommonSignalDefinition[];
        if (this.objectSettings.length > 0) {
            signalNames = this.getSignalNamesFromPartameter();
        }

        if (signalNames.length === 0) {
            signalDefinitions = await this.getLogTagDefinitionsAsync();
        }
        else {
            signalDefinitions = await this.resolveLogTagDefinitionsAsync(signalNames);
        }

        const logs = this.buildSignalLogTag(signalDefinitions);
        this.logs(logs);
    }

    private async resolveLogTagDefinitionsAsync(signalNames: string[]) {
        return await this.connector.getSignalDefinitions(signalNames);
    }

    private async getLogTagDefinitionsAsync() {
        const filter = {
            ServerNames: [],
            AliasNames: [`${this.signalPrefix}*`],
            LogTags: [],
            ResultsFilter: SignalDefinitionResultsFilter.Logs
        } as GetSignalDefinitionsFilterDTO;
        return await SignalsService.getSignalDefinitions(filter, 0, 250);
    }

    private buildSignalLogTag(signalDefinitions: CommonSignalDefinition[]) {
        let logs = [];
        for (const signalDefinition of signalDefinitions as SignalDefinitionDTO[]) {
            if (signalDefinition.Logs != null) {
                for (const log of signalDefinition.Logs) {
                    logs.push({
                        signalName: signalDefinition.AliasName,
                        logTagName: log.LogTag
                    } as IChart1PopupLogTags);
                }
            }
        }
        return logs;
    }

    private getSignalNamesFromPartameter() {
        return this.objectSettings
            .replace(/;\s*$/, "")
            .split(";")
            .map(objectName => `${this.signalPrefix}${objectName}`);
    }

    protected async dispose() {
        await super.dispose();
    }
}

export = WfChart1PopupComponent;