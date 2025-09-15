import Connector = require("../../services/connector");
import Logger = require("../../services/logger");
import ComponentBaseModel = require("../component-base.model");
import VisualStatesService = require("../services/visual-states.service");
import Signal = require("../../services/models/signal");

declare const wf;

class WfPopoverComponent extends ComponentBaseModel<IWfPopoverComponentParams> {
    private isNested: boolean;
    private height: number;
    private width: number;
    private contentCssClass: string;
    private headerCssClass: string;
    private closeButtonCssClass: string;
    private closeButton: boolean;
    private singleMode: boolean;
    private trigger: string;
    private title: KnockoutObservable<string>;
    private position: string;
    private html: boolean;
    private delay: number;
    private content: string;
    private container: string | boolean;
    private template: string;
    private cssClass: string;
    private viewPath: string;
    private viewName: string;
    private disableOverlayColor: string;
    private viewModel: KnockoutObservable<object>;
    private componentName: string;
    private resolvePlaceholders: boolean;

    private states: VisualStatesService;
    private statusCssClass: KnockoutComputed<string>;
    private displayClassNames: KnockoutComputed<string>;

    protected signal: Signal;

    constructor(params: IWfPopoverComponentParams) {
        super(params);
        this.initializeStates();
    }

    private initializeStates() {
        this.states = new VisualStatesService(this.settings);
        this.statusCssClass = this.states.statusCssClass;
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.resolvePlaceholders = this.settings.resolvePlaceholders || false;
        this.isNested = this.settings.isNested || false;
        this.viewName = this.settings.viewName !== undefined ? ko.unwrap(this.settings.viewName) : "";
        this.viewName = this.viewName.stringPlaceholderResolver(this.objectID);
        this.viewPath = this.settings.viewPath !== undefined ? ko.unwrap(this.settings.viewPath) : "src/views/popovers/";
        this.cssClass = ko.unwrap(this.settings.cssClass);
        this.template = this.viewName ? 'wf-signal-information-popover-' + ko.unwrap(this.id) : "";
        this.template = this.template.stringPlaceholderResolver(this.objectID);
        this.componentName = 'wf-popover-content' + ko.unwrap(this.id);

        this.container = this.settings.container !== undefined ? ko.unwrap(this.settings.container) : false;
        this.content = this.settings.content !== undefined ? ko.unwrap(this.settings.content) : "";
        this.delay = this.settings.delay !== undefined ? ko.unwrap(this.settings.delay) : 0;
        this.html = this.settings.html !== undefined ? ko.unwrap(this.settings.html) : false;
        this.position = this.settings.position !== undefined ? ko.unwrap(this.settings.position) : "right";

        this.title = ko.observable(this.settings.title !== undefined ? ko.unwrap(this.settings.title) : "");
        this.trigger = this.settings.trigger !== undefined ? ko.unwrap(this.settings.trigger) : "click";
        this.singleMode = this.settings.singleMode !== undefined ? ko.unwrap(this.settings.singleMode) : false;
        this.closeButton = this.settings.closeButton !== undefined ? ko.unwrap(this.settings.closeButton) : true;

        this.closeButtonCssClass = ko.unwrap(this.settings.closeButtonCssClass) || "";
        this.headerCssClass = ko.unwrap(this.settings.headerCssClass) || "";
        this.contentCssClass = ko.unwrap(this.settings.contentCssClass) || "";

        this.width = ko.unwrap(this.settings.width);
        this.height = ko.unwrap(this.settings.height);

        this.disableOverlayColor = ko.unwrap(this.settings.disableOverlayColor) || "rgba(255,255,255,.5)";

        ko.components.register(this.componentName, {
            viewModel: () => { },
            template: "<div/>"
        });

        var isViewModelObservable = this.settings.viewModel !== undefined && typeof this.settings.viewModel === "function";
        this.viewModel = isViewModelObservable ? this.settings.viewModel : ko.observable<object>();
        this.viewModel.subscribe((newValue) => {
            if (!newValue)
                return;

            this.applyViewModel(newValue);
        }, this);

        if (!isViewModelObservable)
            this.viewModel(this.stringPlaceholderResolver(this.settings.viewModel) || {});

    }

    private applyViewModel(viewModel: any) {
        if (!this.viewName) {
            if (!this.isNested)
                return Logger.warn(this, "Property 'viewName' is empty!");
            else return;
        }

        let viewPath = this.viewPath;

        if (_.last(viewPath) !== "/")
            viewPath = `${viewPath}/`;

        this.viewName = this.escapeQueryStringParameters(this.viewName);

        let path = `${viewPath}${this.viewName}`;
        path = path.stringPlaceholderResolver(this.objectID);

        try {
            ko.components.unregister(this.componentName);
        } catch (error) {

        }

        if (this.resolvePlaceholders) {
            require([`text!${path}`],
                (responseText) => {
                    responseText = wf.utilities.ResolveStringPlaceholders(path, responseText).stringPlaceholderResolver(this.objectID);
                    let title = wf.utilities.ResolveStringPlaceholders(path, this.title());
                    title = title.stringPlaceholderResolver(this.objectID);
                    title = ko.unwrap(this.connector.translate(title));
                    this.title(title);
                    ko.components.register(this.componentName, {
                        viewModel: WfPopoverComponentViewModel as any,
                        template: responseText
                    });
                }
            );
        } else {

            const title = ko.unwrap(this.connector.translate(this.title())).stringPlaceholderResolver(this.objectID);
            this.title(title);

            if (!this.isValidWebsiteAddress(this.viewName)) {
                path = `${path}.html`;
            } else {
                path = this.viewName.stringPlaceholderResolver(this.objectID);
            }
            
            ko.components.register(this.componentName, {
                viewModel: WfPopoverComponentViewModel as any,
                template: { require: `text!${path}` }
            });
        }
    };

    private escapeQueryStringParameters(url: string): string {
        const queryStringSeparatorIndex = url.indexOf("?");

        if (queryStringSeparatorIndex === -1) return url;

        const queryString = url.substring(queryStringSeparatorIndex+1);
        const baseUrl = url.substring(0, queryStringSeparatorIndex);

        return baseUrl + "?" + this.escapeCommonURLReservedCharacters(queryString);
    }

    private escapeCommonURLReservedCharacters(text: string): string {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,
            (value = "$&") => {
                return "%" + value.charCodeAt(0).toString(16).toUpperCase();
            });
    }

    //private isValidWebsiteAddress(url: string): boolean {
    //    var regex = new RegExp("^((http|https|ftp|smtp):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$", "gm");
    //    return regex.test(url);
    //}

    private isValidWebsiteAddress(str: string): boolean {
        var regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (regexp.test(str)) {
            return true;
        }
        else {
            return false;
        }
    }
    protected async dispose() {
        await super.dispose();
        this.states.unregisterSignals();
        if (!this.signal)
            return;
        await this.connector.unregisterSignals(this.signal);
    }
}

class WfPopoverComponentViewModel {
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

export = WfPopoverComponent;
