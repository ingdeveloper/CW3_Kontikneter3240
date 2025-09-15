interface IWfPopoverComponentParams extends IComponentBaseParams, IState {
    viewName: string;
    viewPath: string;
    cssClass: string;
    container: string;
    content: string;
    delay: number;
    html: boolean;
    position: string;
    title: string;
    trigger: string;
    singleMode: boolean;
    closeButton: boolean;
    closeButtonCssClass: string;
    headerCssClass: string;
    contentCssClass: string;
    width: number;
    height: number;
    disableOverlayColor: string;
    viewModel: KnockoutObservable<object>;
    componentName: string;
    isNested: boolean;
    resolvePlaceholders: boolean;
}
