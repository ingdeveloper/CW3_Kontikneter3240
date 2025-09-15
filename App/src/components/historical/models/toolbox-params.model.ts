export interface IToolboxParams extends IComponentBaseParams {
    groupName: string;
    controlName: string;
    css: string;
    showLabel: boolean;
}


export interface IToolboxButton<T> extends IToolboxParams {
    button?: T;
    name?: string;
}

export enum ToolboxButtons {
    PauseResume,
    TimeSettings,
    Export,
    LoadConfiguration,
    SaveConfiguration,
    Back,
    Forward,
    Devider
}

export enum DialogToolboxButtons {
    Axes,
    Data,
    Regions,
    Devider
}