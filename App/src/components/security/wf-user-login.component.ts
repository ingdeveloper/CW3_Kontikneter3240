import UsersService = require("../../services/usersService");
import ComponentBaseModel = require("../component-base.model");
import Logger = require("../../services/logger");

interface IWfUserLoginParams extends IComponentBaseParams {
    defaultText: string;
    loggedInRoute: string;
    loggedOutRoute: string;
    cssClass: string;
    iconClass: string;
    loggedInIconClass: string;
    iconStyle: string;
    textStyle: string;
    labelOrientation: string;
    userProperties: string[];
    autoLogin: true;
    popoverHeaderCssClass: string;
    isDomainUser: boolean;
    position: string;
    changePasswordVisibility: boolean;
}

class WfUserLoginComponent extends ComponentBaseModel<IWfUserLoginParams> {
    private currentLoggedInUserSubscription: KnockoutSubscription;
    private iconCssclass: KnockoutComputed<string>;
    private loggedInIconClass: string;
    private errorText: KnockoutComputed<string>;
    private passwordsIsIdentish: KnockoutComputed<boolean>;
    private changePasswordEnabled: KnockoutComputed<boolean>;
    private serverErrorText: KnockoutObservable<string>;
    private confirmPassword: KnockoutObservable<string>;
    private newPassword: KnockoutObservable<string>;
    private actuallyPassword: KnockoutObservable<string>;
    private autoLogin: boolean;
    private labels: KnockoutComputed<string[]>;
    private loginEnabled: KnockoutComputed<boolean>;
    private userIsLoggedIn: KnockoutComputed<boolean>;
    private logoutEnabled: KnockoutComputed<boolean>;
    private userDetails: KnockoutObservable<UserDetailsDTO>;
    private userProperties: string[];
    private isDomainUser: KnockoutObservable<boolean>;
    private labelOrientation: string;
    private textStyle: string;
    private iconStyle: string;
    private iconClass: string;
    private cssClass: string;
    private loggedOutRoute: string;
    private loggedInRoute: string;
    private defaultText: string;
    private showChangePassword: KnockoutObservable<boolean>;
    private password: KnockoutObservable<string>;
    private userName: KnockoutObservable<string>;
    private popoverHeaderCssClass: string;
    private position: string;
    private changePasswordVisibility: boolean;

    private router = {
        navigate: (url) => {
            window.location.href = url;
        }
    }

    constructor(params: IWfUserLoginParams) {
        super(params);
        this.initializeComputeds();
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.userName = ko.observable("");
        this.password = ko.observable("");
        this.showChangePassword = ko.observable(false);

        this.actuallyPassword = ko.observable<string>();
        this.newPassword = ko.observable<string>();
        this.confirmPassword = ko.observable<string>();
        this.serverErrorText = ko.observable<string>("");

        this.isDomainUser = ko.observable(this.settings.isDomainUser !== undefined ? this.settings.isDomainUser : false);
        this.userDetails = ko.observable({} as UserDetailsDTO);

        this.defaultText = this.connector.translate((ko.unwrap(this.settings.defaultText) || "").stringPlaceholderResolver(this.objectID))();

        // Naviigation route where the navigation should be done to on successfull login
        this.loggedInRoute = ko.unwrap(this.settings.loggedInRoute) || "";
        // Naviigation route where the navigation should be done to on logout
        this.loggedOutRoute = ko.unwrap(this.settings.loggedOutRoute) || "";

        this.cssClass = ko.unwrap(this.settings.cssClass) || "btn btn-default";
        this.iconClass = ko.unwrap(this.settings.iconClass) || "wf-lg wf-login";
        this.loggedInIconClass = ko.unwrap(this.settings.loggedInIconClass) || "wf-lg wf-logout";
        this.iconStyle = ko.unwrap(this.settings.iconStyle) || '';
        this.textStyle = ko.unwrap(this.settings.textStyle) || '';
        this.labelOrientation = ko.unwrap(this.settings.labelOrientation) || "horizontal";
        this.popoverHeaderCssClass = ko.unwrap(this.settings.popoverHeaderCssClass) || "";
        this.position = ko.unwrap(this.settings.position) || "bottom";

        this.userProperties = ko.unwrap(this.settings.userProperties) || ["Name"];

        this.autoLogin = ko.unwrap(this.settings.autoLogin) !== undefined ? ko.unwrap(this.settings.autoLogin) : false;

        this.changePasswordVisibility = ko.unwrap(this.settings.changePasswordVisibility) !== undefined ? ko.unwrap(this.settings.changePasswordVisibility) : true;

        this.initializeRouting();
        this.subscribeToUserChangeEvent();
        this.getCurrentUserDetails();
    }

    private subscribeToUserChangeEvent() {
        this.currentLoggedInUserSubscription = this.connector.currentLoggedInUser.subscribe(user => {
            if (user === null) {
                Logger.info(this, "User has been logged out");
                if (this.loggedOutRoute) {
                    this.router.navigate(this.loggedOutRoute);
                }
            }
        })
    }

    private async initializeRouting() {
        try {
            const login = await this.connector.getCurrentLoggedInUser();
            if (!login && this.autoLogin) {
                const result = await this.connector.loginWindowsUser();
                if (result) {
                    this.isDomainUser(true);
                    this.executeAfterLogin();
                }
            }
            else if (!login && this.loggedOutRoute) {
                const currentPage = this.getTrimmedDownNavigationRoute(window.location.href);
                const targetPage = this.getTrimmedDownNavigationRoute(this.loggedOutRoute);

                if (currentPage !== targetPage)
                    this.router.navigate(this.loggedOutRoute);
            } else if (login) {
                this.executeAfterLogin();
            }
        } catch (error) {
            this.connector.handleError(WfUserLoginComponent)(error);
        }

    }

    private getTrimmedDownNavigationRoute(route: string) {
        const index = route.lastIndexOf("/");
        const currentPage = index > -1 ? route.substr(index + 1, route.length - index) : route;
        return currentPage.replace("#", "");
    }

    private initializeComputeds() {

        this.connector.currentLoggedInUser.subscribe((value) => {
            this.getCurrentUserDetails();
        });

        this.logoutEnabled = ko.computed(() => {
            return Object.keys(this.userDetails()).length > 0;
        });
        this.userIsLoggedIn = ko.computed(() => {
            return Object.keys(this.userDetails()).length > 0;
        });

        this.iconCssclass = ko.computed(() => {
            return this.userIsLoggedIn() ? this.loggedInIconClass : this.iconClass;
        }, this);

        this.loginEnabled = ko.computed(() => {
            return this.userName() && this.password() && !this.userIsLoggedIn();
        });

        this.labels = ko.computed(() => {
            if (Object.keys(this.userDetails()).length) {
                var userPropertiesValues = [];
                _.each(this.userProperties, (userProperty) => {
                    userPropertiesValues.push(this.userDetails()[userProperty]);
                });
                return userPropertiesValues;
            }
            return [this.defaultText];
        });

        this.changePasswordEnabled = ko.computed(() => {
            return this.confirmPassword() && this.newPassword() && this.passwordsIsIdentish();
        });

        this.passwordsIsIdentish = ko.computed(() => {
            if (!this.newPassword() || !this.confirmPassword())
                return true;

            return this.newPassword() === this.confirmPassword();
        }, this);

        this.errorText = ko.computed(() => {
            if (!this.passwordsIsIdentish())
                return this.connector.translate("I4SCADA_Passwords_are_not_the_same")();

            return this.serverErrorText();
        });
    }



    private async clickLogin() {
        const result = await this.login();
        if (result) {
            this.executeAfterLogin();
        } else {
            this.clearCredentials();
            this.connector.error(this, "Login failed");
        }
    }

    private async login() {
        return await this.connector.login(this.userName(), this.password(), this.isDomainUser());
    }

    private async clickLogout() {
        await this.logout();
        this.clearCredentials();
        this.closeLoginDialog();
    }

    private logout() {
        var promise = this.connector.logout();
        return promise;
    }

    private clearCredentials() {
        this.userName("");
        this.clearPassword();
        this.clearChangePasswordCredentionals();
    }

    private closeLoginDialog() {
        $('body').trigger('click'); // close popover
    }

    private clearPassword(): void {
        this.password("");
    }

    private clearChangePasswordCredentionals() {
        this.actuallyPassword("");
        this.newPassword("");
        this.confirmPassword("");
        this.serverErrorText("");
    }

    private async getCurrentUserDetails() {
        try {
            const userDetails = await UsersService.getCurrentUserDetails();
            if (!isNullOrUndefined(userDetails)) {
                this.userDetails(userDetails);
            } else {
                this.userDetails({} as UserDetailsDTO);
            }
        } catch (error) {
            this.connector.handleError(WfUserLoginComponent)(error);
        }
    }

    private executeAfterLogin() {

        //this.connector.info(this, "User has been logged in");
        console.log("User has been logged in");
        this.clearCredentials();
        this.closeLoginDialog();

        if (this.loggedInRoute) {
            this.router.navigate(this.loggedInRoute);
        }
    }

    private async clickChangePassword() {
        try {
            const result: string = await this.connector.changeCurrentUserPassword(this.actuallyPassword(), ko.unwrap(this.newPassword));
            if (result) {
                this.clearChangePasswordCredentionals();
                this.showChangePassword(false);
                this.connector.setSecurityToken(result);
            }
            else {
                this.serverErrorText(this.connector.translate("I4SCADA_Change_password_failed")());
            }
        } catch (error) {
            if (error.responseJSON && error.responseJSON.Message)
                this.serverErrorText(error.responseJSON.Message);
        }
    }

    protected async dispose() {
        await super.dispose();
        this.currentLoggedInUserSubscription.dispose();
    }
}

export = WfUserLoginComponent;
