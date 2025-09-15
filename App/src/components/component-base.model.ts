import VisualSecurityService = require("./services/visual-security.service");
import UtilityComponentBaseModel = require("./utility-component-base.model");

declare var uuid;

abstract class ComponentBaseModel<TComponentParams extends IComponentBaseParams> extends UtilityComponentBaseModel<TComponentParams> {
    protected visualSecurityService: VisualSecurityService;
    protected isVisible: KnockoutComputed<boolean>;
    protected isDisabled: KnockoutComputed<boolean>;


    protected securityDenyAccessBehavior: string;

    protected tooltipText: string | KnockoutComputed<string>;

    protected isModalDialogsDraggable: boolean;

    constructor(params: TComponentParams) {
        super(params);
        this.initializeVisualSecurity();
    }

    protected initializeSettings() {
        super.initializeSettings();
        this.securityDenyAccessBehavior = isNullOrUndefined(this.settings.securityDenyAccessBehavior) ? "hide" : this.settings.securityDenyAccessBehavior.toLowerCase();
        this.tooltipText = (ko.unwrap(this.connector.translate(this.settings.tooltipText)()) || "").stringPlaceholderResolver(this.objectID);
        this.isModalDialogsDraggable = this.settings.isModalDialogsDraggable !== undefined ? this.settings.isModalDialogsDraggable : true;
    }

    /**
     * Place here signal cleanup functionality.
     *
     * @protected
     */
    protected async dispose() {
        await super.dispose();
        await this.visualSecurityService.dispose();
    };

    private initializeVisualSecurity() {
        this.visualSecurityService = new VisualSecurityService(this.settings);
        this.isVisible = ko.computed(() => {
            return !(!this.hasAuthorization() && this.securityDenyAccessBehavior === "hide") && this.visualSecurityService.isVisible();
        }, this);

        this.isDisabled = ko.computed(() => {
            return (!this.hasAuthorization() && this.securityDenyAccessBehavior === "disable") || this.visualSecurityService.isDisabled();
        }, this);
    }
}

export = ComponentBaseModel;