/**
 * This interface contains the parameters for the TimneRangesService.
 * 
 * @interface ITimeRangesRapams
 * @extends {IComponentBaseParams}
 */
interface ITimeRangesRapams extends IComponentBaseParams {
    startOffsetIntervall: number;
    startOffset: string;
    endOffsetIntervall: number;
    endOffset: string;
}