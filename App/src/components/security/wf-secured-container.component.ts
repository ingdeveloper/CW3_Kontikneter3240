import ComponentBaseModel = require("../component-base.model");

interface IWfSecuredContainerParams extends IComponentBaseParams {
    data: any;

    projectAuthorizations?: string[];
    projectAuthorizationIndex?: number;

    systemAuthorizations?: string[];
    systemAuthorizationIndex?: number;
}

class WfSecuredContainerComponent extends ComponentBaseModel<IWfSecuredContainerParams> {

    private data: any;

    constructor(params: IWfSecuredContainerParams) {
        params.projectAuthorization = WfSecuredContainerComponent.getAuthorization(params.projectAuthorization, params.projectAuthorizations, params.projectAuthorizationIndex);
        params.systemAuthorization = WfSecuredContainerComponent.getAuthorization(params.systemAuthorization, params.systemAuthorizations, params.systemAuthorizationIndex);

        super(params);
        this.data = params.data;
    }

    private static getAuthorization(authorization?: string, authorizations?: string[], authorizationIndex?: number): string | undefined {
        if (authorization)
            return authorization;

        authorizations = authorizations || [];

        if (authorizationIndex !== undefined &&
            authorizationIndex >= 0 &&
            authorizations.length >= authorizationIndex) {
            return authorizations[authorizationIndex];
        } else {
            return authorizations.join(",");
        }
    }

    protected async dispose() {
        await super.dispose();
    }
}

export = WfSecuredContainerComponent;