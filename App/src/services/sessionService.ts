import Logger = require("./logger");
import Api = require("./api");
import CookieService = require("./cookieService");

declare var uuid: any;

class SessionService {

    private static clientIdCookieName = "wf_clientID";
    private static securityTokenCookieName = "wf_stk";
    public static sessionId: string;
    public static timeOut = 10000;

    public static currentLoggedInUser = ko.observable<string>(null);
    public static currentLoggedInUserIsDomainUser = ko.observable<boolean>(false);
    public static currentUserProjectAuthorizations = ko.observableArray<ProjectAuthorizationDTO>([]);
    public static currentUserSystemAuthorizations = ko.observableArray<SystemAuthorizationDTO>([]);

    /**
         * Creates a simple V4 UUID. This should not be used as a PK in your database. It can be used to generate internal, unique ids. For a more robust solution see [node-uuid](https://github.com/broofa/node-uuid).
         * @method guid
         * @return {string} The guid.
         */
    private static guid() {
        return uuid.v4();
    }

    public static getClientId() {
        let clientId = CookieService.get(SessionService.clientIdCookieName);
        if (!clientId) {
            clientId = SessionService.guid();
            Logger.info(SessionService, `Generated client ID: ${clientId}`);
            CookieService.set(SessionService.clientIdCookieName, clientId, { expires: 7 });
        }

        return clientId;
    }

    public static setClientId(clientId?: string) {
        if (clientId) {
            CookieService.set(SessionService.clientIdCookieName, clientId, { expires: 7 });
        }
    }

    public static getSecurityToken() {
        return CookieService.get(SessionService.securityTokenCookieName); //, (value) => { return value.replace(/\s/g, "+")}) as string;
        //return Cookies.get(SessionService.securityTokenCookieName) || null;
    }

    public static setSecurityToken(token: string) {
        CookieService.set(SessionService.securityTokenCookieName, token, {
            expires: 7
        });
    }

    public static clearSecureSession() {
        CookieService.remove(SessionService.securityTokenCookieName);

        SessionService.currentLoggedInUser(null);
        SessionService.currentLoggedInUserIsDomainUser(false);
        SessionService.currentUserProjectAuthorizations([]);
        SessionService.currentUserSystemAuthorizations([]);
    }

    public static async updateSessionInformation() {
        const login = await SessionService.getCurrentLoggedInUser();
        if (!login) return false;

        const authorizations = await SessionService.getCurrentUserAuthorizations();
        return !!authorizations;
    }

    public static async getCurrentLoggedInUser() {
        const securityToken = SessionService.getSecurityToken();
        if (!securityToken) {
            //Logger.warn(SecurityService, "User not logged in in the current session");
            return null;
        }

        const isLoggedIn = await Api.securityService.isUserLoggedIn(securityToken, SessionService.timeOut);

        if (!isLoggedIn) {
            SessionService.clearSecureSession();
            return null;
        }

        const user = await Api.securityService.getCurrentLoggedInUser(securityToken, SessionService.timeOut);

        if (SessionService.currentLoggedInUser() !== user.Name) {
            SessionService.currentLoggedInUser(user.Name);
        } else {
            SessionService.currentLoggedInUser.valueHasMutated();
        }

        SessionService.currentLoggedInUserIsDomainUser(user.IsADUser);
        return user.Name;
    }

    public static async getCurrentUserAuthorizations() {
        const securityToken = SessionService.getSecurityToken();
        if (!securityToken || !SessionService.currentLoggedInUser()) {
            //Logger.info(SecurityService, "There is no user currently logged in");
            return null;
        }

        const authorizations = await Api.securityService.getCurrentUserAuthorizations(securityToken, SessionService.timeOut);

        if (!authorizations) {
            SessionService.clearSecureSession();
            return null;
        }

        SessionService.currentUserProjectAuthorizations(authorizations.ProjectAuthorizations);
        SessionService.currentUserSystemAuthorizations(authorizations.SystemAuthorizations);
        return authorizations;
    }

    private static async isUserLoggedIn() {
        return await Api.securityService.isUserLoggedIn(SessionService.getSecurityToken(), SessionService.timeOut);
    }

}

export = SessionService;