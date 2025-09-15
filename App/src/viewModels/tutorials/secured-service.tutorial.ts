import ViewModelBase = require("../viewModelBase");
import SecuredService = require("../../components/services/secured.service");

class SecuredServiceTutorial extends ViewModelBase {
    public hasAuthorization: KnockoutComputed<boolean>;
    public securedService: SecuredService;
    public projectAuthorization: string;
    constructor() {
        super();
    }

    public activate() {

        this.projectAuthorization = "Administration";
        this.securedService = new SecuredService(this.projectAuthorization);
        this.hasAuthorization = this.securedService.hasAuthorization;
    }
}

export = SecuredServiceTutorial;