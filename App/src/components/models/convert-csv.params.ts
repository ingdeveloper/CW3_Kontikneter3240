/**
 * This interface contains the parameters for the ConvertToCsvService.
 * 
 * @interface IConvertToCsvParams
 */
interface IConvertCsvParams {
    objectID?: string;
    exportFileName: string;
    exportColumnDelimiter: any;
    exportLineDelimiter: string;
    exportDateTimeFormat: string;
    format: string;
    isAlphanumeric: boolean;
    columnTitleTemplate: string;
    dateTimeFileName: boolean;
    dateTimeFileNameFormat: string;
}