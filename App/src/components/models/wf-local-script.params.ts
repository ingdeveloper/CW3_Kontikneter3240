export interface IWfLocalScriptParams extends IUtilityComponentBaseParams {
    inputSignalNames: string[];
    outputSignalName?: string;
    isAsync?: boolean;
}