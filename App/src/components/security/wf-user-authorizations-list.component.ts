import ComponentBaseModel = require("../component-base.model");

interface IWfUserAuthorizationsListParams extends IComponentBaseParams {
    listClass: string;
    listItemClass: string;
    showSystemAuthorizations: boolean;
    showProjectAuthorizations: boolean;
}

class WfUserAuthorizationsListComponent extends ComponentBaseModel<IWfUserAuthorizationsListParams>{

    private loggedInUserName: KnockoutComputed<string>;
    private currentUserSystemAuthorizations: KnockoutComputed<SystemAuthorizationDTO[]>;
    private currentUserProjectAuthorizations: KnockoutComputed<ProjectAuthorizationDTO[]>;
    private showProjectAuthorizations: boolean;
    private showSystemAuthorizations: boolean;
    private listItemClass: string;
    private listClass: string;

    constructor(params: IWfUserAuthorizationsListParams) {
        super(params);
    }

    protected async dispose() {
        await super.dispose();
    }

    protected async initializeSettings() {
        super.initializeSettings();

        this.listClass = ko.unwrap(this.settings.listClass) || "list-group";
        this.listItemClass = ko.unwrap(this.settings.listItemClass) || "list-group-item";

        this.showSystemAuthorizations = ko.unwrap(this.settings.showSystemAuthorizations) !== undefined ? ko.unwrap(this.settings.showSystemAuthorizations) : false;
        this.showProjectAuthorizations = ko.unwrap(this.settings.showProjectAuthorizations) !== undefined ? ko.unwrap(this.settings.showProjectAuthorizations) : true;

        this.currentUserProjectAuthorizations = this.connector.currentUserProjectAuthorizations;
        this.currentUserSystemAuthorizations = this.connector.currentUserSystemAuthorizations;

        this.loggedInUserName = this.connector.currentLoggedInUser;

        try {
            await this.connector.getCurrentLoggedInUser();
            await this.connector.getCurrentUserAuthorizations();
        }
        catch (error) {
            this.connector.handleError(WfUserAuthorizationsListComponent)(error);
        }
    }

}
export = WfUserAuthorizationsListComponent;