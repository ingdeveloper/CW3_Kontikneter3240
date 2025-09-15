interface IWfSvgPathParams extends IComponentBaseParams, IVisualSecurityParams, IState, ICssClassStateParams, ISignalArrayParams {
    viewBox: KnockoutValueOrObservable<string>;
    height?: KnockoutValueOrObservable<number>;
    width?: KnockoutValueOrObservable<number>;
    pathData: KnockoutValueOrObservable<string>;
    navigationUrl: KnockoutValueOrObservable<string>;
    pathCssClass: KnockoutValueOrObservable<string>;
    labelText: KnockoutValueOrObservable<string>;
    subLabelText: KnockoutValueOrObservable<string>;
    tooltipEnabled: KnockoutValueOrObservable<boolean>;
    // style: KnockoutComputed<any>;

    signalName: KnockoutValueOrObservable<string>;
    unitLabel: KnockoutValueOrObservable<boolean>;
    isAlphanumeric: KnockoutValueOrObservable<boolean>;
    isDateTime: boolean
    dateTimeFormat: string;
    tooltipTitle:string;
}
