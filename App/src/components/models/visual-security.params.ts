/**
 * This interface contains the parameters for the VisualSecurityService.
 * 
 * @interface IVisualSecurityParams
 * @extends {IComponentBaseParams}
 */
interface IVisualSecurityParams {
    enableSignalName: string;
    enableSignalValue: any;
    enableOperator: string;
    visibilitySignalName: string;
    visibilitySignalValue: any;
    visibilityOperator: string;
    objectID?: string;
}