interface IModalDialogBaseParams extends IComponentBaseParams {
    viewName: string;
    viewPath: string;
    viewModelName: string;
    viewModelPath: string;
    draggable: boolean;
    title: string;
    showApplyButton: boolean;
    modalBodyClass: string;
    applyCallback: any;
    closeCallback: any;
    beforeShowCallback: any;
    viewModel: KnockoutObservable<object>;
    isNested: boolean;
    headerClasses?: string;
}