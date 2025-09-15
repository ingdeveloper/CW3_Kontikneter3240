import ViewModelBase = require("../viewModelBase");
import SignalsConnector = require("../../services/connector");

class ExamplesSecurity extends ViewModelBase {
    public items: string[];

    public connector: SignalsConnector;
    public currentUserSystemAuthorizations: KnockoutComputed<SystemAuthorizationDTO[]>;
    public currentUserProjectAuthorizations: KnockoutComputed<ProjectAuthorizationDTO[]>;

    public password: string;
    public userName: string;
    public userNameLoggedIn = ko.observable<string>();

    constructor() {
        super();

        this.items = [
            "Secured Item 1",
            "Secured Item 2",
            "Secured Item 3"
        ];
    }

    public activate(settings) {
        this.connector = new SignalsConnector();
        this.currentUserProjectAuthorizations = this.connector.currentUserProjectAuthorizations;
        this.currentUserSystemAuthorizations = this.connector.currentUserSystemAuthorizations;
    }

    public async clickLogin() {
        await this.login();

    }

    public async clickLogout() {
        await this.logout();

    }

    public async login() {
        return await this.connector.login(this.userName, this.password, false);
    }

    public async logout() {
        return await this.connector.logout();
    }

    public async getCurrentLoggedInUser() {
        const userName = await this.connector.getCurrentLoggedInUser()
        this.userNameLoggedIn(userName);
    }

}

export = ExamplesSecurity;