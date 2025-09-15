/**
 * This interface contains the HTML parameters for the abstract ComponentBase Model.
 * 
 * @interface IComponentBaseParams
 */
interface IComponentBaseParams extends IVisualSecurityParams, IUtilityComponentBaseParams {
    objectID?: string;
    projectAuthorization?: string;
    systemAuthorization?: string;
    securityDenyAccessBehavior?: string;
    tooltipText?: string;
    isModalDialogsDraggable: boolean;
}