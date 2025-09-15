import Logger = require("../../services/logger");
import Connector = require("../../services/connector");
import ComponentBaseModel = require("../component-base.model");
import VisualStatesService = require("../services/visual-states.service");

interface IWfModalDialogButtonComponentParams extends IComponentBaseParams, IState {
    cssClass?: string;
    flat?: boolean;
    headerClass?: string;
    showModal?: boolean;
    dialogClassName?: string;
    modalSource?: string;
    modalParameters?: any;
    bodyHeight?: number;
    bodyWidth?: number;
    modalTitle?: string;
    modalDialogPlacement?: string;
    iconCustomCss?: string;
    iconClass?: string;
    showIcon?: boolean;
    fontSize?: number;
    fontFamily?: string;
    fontBold?: boolean;
    buttonText?: string;
}

class WfModalDialogButtonComponent extends ComponentBaseModel<IWfModalDialogButtonComponentParams> {
    private statusClass: KnockoutComputed<string>;
    private headerClass: KnockoutObservable<string>;
    private dataToggle: KnockoutComputed<string>;
    private dataSource: KnockoutObservable<string>;
    private dialogClassName: KnockoutObservable<string>;
    private bodyHeight: KnockoutObservable<number>;
    private bodyWidth: KnockoutObservable<number>;
    private dataTitle: KnockoutObservable<string>;
    private dataPlacement: KnockoutObservable<string>;
    private iconStyle: KnockoutObservable<string>;
    private iconClass: KnockoutObservable<string>;
    private showIcon: KnockoutObservable<boolean>;
    private fontSize: KnockoutComputed<string>;
    private fontFamily: KnockoutObservable<string>;
    private fontWeight: KnockoutComputed<string>;
    private buttonText: KnockoutObservable<string>;
    private states: VisualStatesService;

    constructor(params: IWfModalDialogButtonComponentParams) {
        super(params);

        this.initializeStates();
    }

    protected initializeSettings() {
        super.initializeSettings();

        const cssClass = ko.unwrap(this.settings.cssClass) || "btn-default";
        const flat = ko.unwrap(this.settings.flat) ? ko.unwrap(this.settings.flat) : false;
        const showModal = ko.unwrap(this.settings.showModal) ? ko.unwrap(this.settings.showModal) : true;
        const modalUrl = ko.unwrap(this.settings.modalSource) || "";
        //const modalParameters = this.mapParametersToQueryStringParameters(ko.unwrap(this.settings.modalParameters));
        const modalParameters = (ko.unwrap(this.settings.modalParameters) || "").stringPlaceholderResolver(this.objectID);
        const fontSize = ko.unwrap(this.settings.fontSize) || 14;
        const fontBold = ko.unwrap(this.settings.fontBold) ? ko.unwrap(this.settings.fontBold) : false;

        this.dialogClassName = ko.observable(ko.unwrap(this.settings.dialogClassName) || "");
        this.headerClass = ko.observable(ko.unwrap(this.settings.headerClass) || "");
        this.dataTitle = ko.observable((ko.unwrap(this.settings.modalTitle) || "").stringPlaceholderResolver(this.objectID));
        this.dataPlacement = ko.observable(ko.unwrap(this.settings.modalDialogPlacement) || "center");
        this.bodyHeight = ko.observable(ko.unwrap(this.settings.bodyHeight) || 250);
        this.bodyWidth = ko.observable(ko.unwrap(this.settings.bodyWidth) || 300);
        this.iconStyle = ko.observable(ko.unwrap(this.settings.iconCustomCss) || "");
        this.iconClass = ko.observable(ko.unwrap(this.settings.iconClass) || "wf-callout");
        this.showIcon = ko.observable(ko.unwrap(this.settings.showModal) ? ko.unwrap(this.settings.showModal) : true);
        this.fontFamily = ko.observable(ko.unwrap(this.settings.fontFamily) || "Arial");
        this.buttonText = ko.observable(ko.unwrap(this.settings.buttonText) || "");
        
        this.statusClass = ko.pureComputed(() => {
            const disableStatusClass = this.isDisabled() ? "wf-disabled-container" : "wf-enabled-container";
            const flatClass = flat ? "wf-flat" : "";

            return cssClass + " " + flatClass + " " + disableStatusClass + " " + this.states.statusCssClass();
        });
        this.dataSource = ko.pureComputed(() => {
            const result = modalUrl + (modalParameters !== "" && !modalParameters.startsWith("?") ? "?" : "") + modalParameters;

            return encodeURI(result);
        });
        this.dataToggle = ko.pureComputed(() => {
            return showModal ? "modal" : "none";
        });
        this.fontSize = ko.pureComputed(() => {
            return fontSize + "px";
        });

        this.fontWeight = ko.pureComputed(() => {
            return fontBold ? "bold" : "normal";
        });

        //this.isNested = this.settings.isNested || false;
        //this.componentName = 'dialog-content' + ko.unwrap(this.id);
        //this.show = ko.observable(false);

        //this.viewName = this.settings.viewName !== undefined ? ko.unwrap(this.settings.viewName) : "";
        //this.viewPath = this.settings.viewPath !== undefined ? ko.unwrap(this.settings.viewPath) : "./src/views/dialogs/";

        //this.viewModelName = this.settings.viewModelName !== undefined ? ko.unwrap(this.settings.viewModelName) : "";
        //this.viewModelPath = this.settings.viewModelPath !== undefined ? ko.unwrap(this.settings.viewModelPath) : "./src/viewModels/dialogs/";
    }


    private initializeStates() {
        this.states = new VisualStatesService(this.settings);
    }

    private mapParametersToQueryStringParameters(parameters: any): string {
        if (!parameters) return "";

        var nameValuePairs = [];

        _.each(parameters,
            (parameter: { name: string, value: any }) => {
                nameValuePairs.push(parameter.name + "=" + parameter.value);
            });

        return nameValuePairs.join("'&");
    }

    protected async dispose() {
        await super.dispose();
        this.states.unregisterSignals();
    }
}

export = WfModalDialogButtonComponent;