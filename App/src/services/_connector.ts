import Signal = require("./models/signal");
import ActionResult = WEBfactory.DWH.Data.Exchange.ActionResult;

export interface IConnector {
    getSignal(name: string, shouldAddSubscriber?): Signal;

    getOnlineUpdates(): Promise<void>;

    writeSignals(signalValues: SignalValue): Promise<ActionResult>;

    getSignalDefinition(signalName: string): Promise<CommonSignalDefinition>;

    getSignalDefinitions(signalNames: string[]): Promise<CommonSignalDefinition[]>;

    getAllSignalDefinitions(): Promise<CommonSignalDefinition[]>;

    getSignalDefinitionsByPatterns(patterns: string[]): Promise<CommonSignalDefinition[]>;

    unregisterSignals(...signals: (Signal | string)[]): Promise<void>;

    readSignals(signalNames: string[]): Promise<SignalValueDTO[]>;

    //getAllSignals(): Promise<NameDTO[]>;
    //getLogs(signalId: string): Promise<LogDTO[]>;
}