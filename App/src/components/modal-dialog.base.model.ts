import Logger = require("../services/logger");
import ComponentBaseModel = require("./component-base.model");
import Connector = require("../services/connector");

class ModalDialogBaseModel<T extends IModalDialogBaseParams> extends ComponentBaseModel<T> {
    public isNested: boolean;
    public componentName: string;
    public viewName: string;
    public viewPath: string;
    public viewModelName: string;
    public viewModelPath: string;
    public draggable: boolean;
    public title: string;
    public showApplyButton: boolean;
    public modalBodyClass: string;
    public applyCallback: any;
    public closeCallback: any;
    public beforeShowCallback: any;
    public show: KnockoutObservable<boolean>;
    public headerClasses: KnockoutObservable<string>;
    public viewModel: KnockoutObservable<object>;

    constructor(params: T) {
        super(params);
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.isNested = this.settings.isNested || false;
        this.componentName = 'dialog-content' + ko.unwrap(this.id);
        this.show = ko.observable(false);

        this.viewName = this.settings.viewName !== undefined ? ko.unwrap(this.settings.viewName) : "";
        this.viewPath = this.settings.viewPath !== undefined ? ko.unwrap(this.settings.viewPath) : "./src/views/dialogs/";

        this.viewModelName = this.settings.viewModelName !== undefined ? ko.unwrap(this.settings.viewModelName) : "";
        this.viewModelPath = this.settings.viewModelPath !== undefined ? ko.unwrap(this.settings.viewModelPath) : "./src/viewModels/dialogs/";

        this.draggable = ko.unwrap(this.settings.draggable) !== undefined ? ko.unwrap(this.settings.draggable) : true;
        this.title = (ko.unwrap(this.settings.title) || "").stringPlaceholderResolver(this.objectID);
        this.showApplyButton = this.settings.showApplyButton !== undefined ? ko.unwrap(this.settings.showApplyButton) : false;
        this.modalBodyClass = this.settings.modalBodyClass !== undefined ? ko.unwrap(this.settings.modalBodyClass) : "";

        this.applyCallback = this.settings.applyCallback || "";
        this.closeCallback = this.settings.closeCallback || "";
        this.beforeShowCallback = this.settings.beforeShowCallback || "";

        var isViewModelObservable = this.settings.viewModel !== undefined && typeof this.settings.viewModel === "function";
        this.viewModel = isViewModelObservable ? this.settings.viewModel : ko.observable<object>();

        ko.components.register(this.componentName, {
            viewModel: () => { },
            template: "<div/>"
        });

        this.headerClasses = ko.observable<string>(ko.unwrap(this.settings.headerClasses) || "modal-primary");

        if (!isViewModelObservable)
            this.viewModel(this.stringPlaceholderResolver(this.settings.viewModel) || {});
    }

    public applyViewModel() {
        if (!this.viewName) {
            if (!this.isNested)
                return Logger.warn(this, "Property 'viewName' is empty!");
            else return;
        }

        if (_.last(this.viewPath) !== "/")
            this.viewPath = this.viewPath + "/";

        var viewPath = this.viewPath + this.viewName + ".html";

        ko.components.unregister(this.componentName);
        if (this.viewModelName)
            ko.components.register(this.componentName, {
                viewModel: { require: this.viewModelPath + this.viewModelName },
                template: { require: 'text!' + viewPath }
            });
        else
            ko.components.register(this.componentName, {
                viewModel: WfModalComponentViewModel as any,
                template: { require: 'text!' + viewPath }
            });
    };

    public close() {
        this.show(false);

        ko.components.unregister(this.componentName);

        if (this.closeCallback && typeof this.closeCallback === "function")
            this.closeCallback();
    };

    public apply() {
        this.show(false);

        ko.components.unregister(this.componentName);

        if (this.applyCallback && typeof this.applyCallback === "function")
            this.applyCallback();
    };

    public handleShowDialog() {
        if (this.beforeShowCallback && typeof this.beforeShowCallback === "function")
            this.beforeShowCallback();

        this.applyViewModel();

        this.show(true);
    };

    protected async dispose() {
        await super.dispose();
        ko.components.unregister(this.componentName);

        //clear dialogs
        var modalDialog = $(document).find('#modal-dialog-' + ko.unwrap(this.id));
        var modalDialogContainer = $(document).find('#modal-dialog-container-' + ko.unwrap(this.id));

        modalDialog.remove();
        modalDialogContainer.remove();
    }
}

class WfModalComponentViewModel {
    private connector: Connector;

    constructor(params: any) {
        var viewModel = params.viewModel();

        for (var key in viewModel) {
            if (viewModel.hasOwnProperty(key)) {
                this[key] = viewModel[key];
            }
        }

        this.connector = params.connector;
    }
}

export = ModalDialogBaseModel;