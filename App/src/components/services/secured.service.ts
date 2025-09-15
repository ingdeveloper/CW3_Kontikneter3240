import Connector = require("../../services/connector");

class SecuredService {

    private connector: Connector;
    private projectAuthorization: string;
    private systemAuthorization: string;

    public hasAuthorization = ko.pureComputed(() => {
        if (this.projectAuthorization === "" && this.systemAuthorization === "")
            return true;

        if (!this.connector.currentUserProjectAuthorizations())
            return false;

        const userProjectAuthorizationArray = _.map(this.connector.currentUserProjectAuthorizations(), item => item.Name);
        const userSystemAuthorizationArray = _.map(this.connector.currentUserSystemAuthorizations(), item => item.Name);

        const projectAuthorizationArray = _.map(this.projectAuthorization.split(","), item => item.trim());
        const systemAuthorizationArray = _.map(this.systemAuthorization.split(","), item => item.trim());

        const hasRequestedProjectAuthorizations = _.intersection(userProjectAuthorizationArray, projectAuthorizationArray).length > 0;
        const hasRequestedSystemAuthorizations = _.intersection(userSystemAuthorizationArray, systemAuthorizationArray).length > 0;

        return hasRequestedProjectAuthorizations || hasRequestedSystemAuthorizations;
    });

    public hasNoAuthorization = ko.pureComputed(() => {
        return !this.hasAuthorization();
    });

    constructor(projectAuthorization?: KnockoutValueOrObservable<string>, systemAuthorization?: KnockoutValueOrObservable<string>) {
        this.connector = new Connector();

        this.projectAuthorization = (ko.unwrap(projectAuthorization) || "").trim();
        this.systemAuthorization = (ko.unwrap(systemAuthorization) || "").trim();
    }

}

export = SecuredService;
