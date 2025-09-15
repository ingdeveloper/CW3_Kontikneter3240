import Connector = require("../services/connector");
import SecuredService = require("./services/secured.service");

declare var uuid;

abstract class UtilityComponentBaseModel<TComponentParams extends IUtilityComponentBaseParams> {
    public readonly $$SCOPE$$ = "I4SCADA";

    protected id: KnockoutObservable<string> | string;
    protected connector: Connector;
    protected objectID: string;
    protected projectAuthorization: string;
    protected systemAuthorization: string;
    protected settings: TComponentParams;
    protected securedService: SecuredService;

    protected hasAuthorization: KnockoutObservable<boolean>;
    protected hasNoAuthorization: KnockoutObservable<boolean>;

    protected static stringParam(value: string | KnockoutObservable<string>, defaultValue: string) {
        const unwrapped = ko.unwrap(value);
        if (unwrapped === null || unwrapped === undefined) return defaultValue;
        else return unwrapped;
    }

    constructor(params: TComponentParams) {
        this.connector = new Connector();
        this.id = ko.observable(uuid.v4());
        this.settings = params;

        this.initializeSettings();
    }

    protected initializeSettings() {
        this.objectID = ko.unwrap(this.settings.objectID);
        this.projectAuthorization = (ko.unwrap(this.settings.projectAuthorization) || "").stringPlaceholderResolver(this.objectID);
        this.systemAuthorization = (ko.unwrap(this.settings.systemAuthorization) || "").stringPlaceholderResolver(this.objectID);

        this.securedService = new SecuredService(this.projectAuthorization, this.systemAuthorization);
        this.hasAuthorization = this.securedService.hasAuthorization;
        this.hasNoAuthorization = this.securedService.hasNoAuthorization;
    }

    protected stringPlaceholderResolver(object: object) {
        if (!object) return object;
        for (let key of Object.keys(object)) {
            const type = typeof object[key];
            if (type === "string") {
                object[key] = object[key].stringPlaceholderResolver(this.objectID);
            }
            if (type === "object") {
                object[key] = this.stringPlaceholderResolver(object[key]);
            }
        }

        return object;
    }

    /**
     * Place here signal cleanup functionality.
     *
     * @protected
     */
    protected async dispose() {
    }
}

export = UtilityComponentBaseModel;