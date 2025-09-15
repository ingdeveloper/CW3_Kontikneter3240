import Connector = require("../../services/connector");

import UsersService = require("../../services/usersService");
import Signal = require("../../services/models/signal");

import ComponentBaseModel = require("../component-base.model");

interface IWfUserInformationParams extends IComponentBaseParams {
    propertyName: string;
}

class WfUserInformationComponent extends ComponentBaseModel<IWfUserInformationParams> {
    private output: KnockoutComputed<any>;
    private property: string;
    private userDetails: KnockoutObservable<UserDetailsDTO>;

    constructor(params: IWfUserInformationParams) {
        super(params)
        this.initializeComputeds();
        this.getCurrentUserDetails();
    }

    protected initializeSettings() {
        super.initializeSettings();
        this.property = ko.unwrap(this.settings.propertyName) || "Name";
        this.userDetails = ko.observable({} as UserDetailsDTO);
    }

    private initializeComputeds() {
        this.connector.currentLoggedInUser.subscribe(() => {
            this.getCurrentUserDetails();
        });

        this.output = ko.computed(() => {
            if (this.userDetails() && !isNullOrUndefined(this.userDetails()[this.property])) {
                return this.userDetails()[this.property];
            }
            return "";
        });
    }

    private async getCurrentUserDetails() {
        try {
            const userDetails = await UsersService.getCurrentUserDetails();
            this.userDetails(userDetails);
        } catch (error) {
            this.connector.handleError(WfUserInformationComponent)(error);
        }
    }

    protected async dispose() {
        await super.dispose();
    }
}

export = WfUserInformationComponent;
