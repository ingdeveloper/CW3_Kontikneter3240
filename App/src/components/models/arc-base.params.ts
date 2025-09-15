interface IWfArcBaseParams extends IComponentBaseParams, ISignalArrayParams {
    format: string;
    r2d: number;
    height: number;
    width: number;
    marginBottom: number;
    innerRadius: number;
    signalName: string;
    majorTicks: number;
    minRange: number;
    maxRange: number;
    startAngle: number;
    endAngle: number;
    showValueLabel: boolean;
    iconClass: string;
    iconColor: string;
    iconStyle: string;
    maxRangeSignalName: string;
    minRangeSignalName: string;
    hideFirstTickLabel: boolean;
    hideLastTickLabel: boolean;
}