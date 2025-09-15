/**
 * This interface contains the parameters for the ConvertToCsvService.
 * 
 * @interface IConvertToCsvParams
 * @extends {IComponentBaseParams}
 */
interface IConvertToCsvParams extends IComponentBaseParams {
    exportFileName: string;
    exportColumnDelimiter: any;
    exportLineDelimiter: string;
    exportDateTimeFormat: string;
    format: string;
    isAlphanumeric: boolean;
    columnTitleTemplate: string;
}