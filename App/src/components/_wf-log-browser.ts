export interface IWfSignalBrowser extends IComponentBaseParams {
    showColor: boolean;
    showAxis: boolean;
    showType: boolean;
    showAlphanumeric: boolean;
    isMultipleMode: boolean;
    columnCssClass: string;
    labelCssClass: string;
    signalText: string;
    items: KnockoutObservableArray<any>;
    beginLoadSignalsFunc: any;
    endLoadSignalsFunc: any;
    showIsStaticColumn: boolean;
    showIsAlphanumeric: boolean;
    signalCount: number;
}