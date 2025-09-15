import SessionService = require("./sessionService");
import ConnectorService = require("./connectorService");
import SymbolicTextsService = require("./symbolicTextsService");
import Api = require("./api");
import Logger = require("./logger");
import SignalsService = require("./signalsService");
import Signal = require("./models/signal");
import ErrorCodeService = require("./errorCodeService");

class SecurityService {
    public static timeOut = 10000;
    private static sessionSignal: Signal;

    public static async login(userName: string, password: string, isDomainUser: boolean) {
        await ConnectorService.connect();

        SessionService.clearSecureSession();
        Logger.info(SecurityService, `Logging in client ID: ${SessionService.getClientId()}`);
        return await SecurityService.performLogin(userName, password, isDomainUser);

    }

    public static async logout() {
        try {
            const status = await Api.securityService.logout(SessionService.getSecurityToken(), SessionService.timeOut);

            if (status) {
                const loggedOutSuccessText = SymbolicTextsService.translate("I4SCADA_User_name_successfully_logged_out")().format(SessionService.currentLoggedInUser());
                Logger.info(SecurityService, loggedOutSuccessText);
                Logger.successToast(loggedOutSuccessText);
                SessionService.clearSecureSession();

                return true;
            }

            const loggedOutFailedText = SymbolicTextsService.translate("I4SCADA_Failed_to_logout_user_name")().format(SessionService.currentLoggedInUser());
            Logger.warn(SecurityService, loggedOutFailedText);
            Logger.warnToast(loggedOutFailedText);
            return false;
        } catch (error) {
            Logger.handleError(SecurityService)(error);
            SessionService.clearSecureSession();//not sure about this one
            return false;
        }
    }

    public static async checkProjectAuthorizations(authorizations: string[]) {

        if (!SessionService.getSecurityToken() || !SessionService.currentLoggedInUser()) {
            //Logger.info(SecurityService, "There is no user currently logged in");
            return null;
        }
        try {
            return await Api.securityService.checkProjectAuthorizations(SessionService.getSecurityToken(), authorizations, SessionService.timeOut);
        } catch (error) {
            Logger.handleError(SecurityService)(error);
            return null;
        }
    }

    public static async checkSystemAuthorizations(authorizations: string[]) {

        if (!SessionService.getSecurityToken() || !SessionService.currentLoggedInUser()) {
            Logger.info(SecurityService, "There is no user currently logged in");
            return null;
        }

        try {
            const authorizationFlags = await Api.securityService.checkSystemAuthorizations(SessionService.getSecurityToken(), authorizations, SessionService.timeOut);

            if (!authorizationFlags) {
                Logger.info(SecurityService, "There is no user currently logged in");
                return null;
            }
            return authorizationFlags;
        } catch (error) {
            Logger.handleError(SecurityService)(error);

        }
    }

    private static async performLogin(userName: string, password: string, isDomainUser: boolean) {
        try {
            const token = await Api.securityService.login(SessionService.sessionId, SessionService.getClientId(), userName, password, isDomainUser, SessionService.timeOut);
            return SecurityService.executeAfterLogin(token);
        } catch (error) {
            Logger.handleError(SecurityService)(error);
        }
    }

    public static async loginWindowsUser() {
        try {
            await ConnectorService.connect();
            SessionService.clearSecureSession();
            const token = await Api.securityService.loginWindowsUser(SessionService.sessionId, SessionService.getClientId(), SessionService.timeOut);
            return await SecurityService.executeAfterLogin(token);
        } catch (error) {
            Logger.handleError(SecurityService)(error);
        }
    }

    public static async getCallerAccountDetails() {
        return await Api.securityService.getCallerAccountDetails();
    }

    public static async getAllAuthorizationGroupDetails() {
        try {
            await ConnectorService.connect();
            return await Api.securityService.getAllAuthorizationGroupDetails(SessionService.getSecurityToken(), SessionService.timeOut);
        } catch (error) {
            Logger.handleError(SecurityService)(error);
            return null;
        }
    }

    public static async getAllAuthorizationGroup() {
        try {
            await ConnectorService.connect();
            return await Api.securityService.getAllAuthorizationGroupDetails(SessionService.getSecurityToken(), SessionService.timeOut);
        } catch (error) {
            Logger.handleError(SecurityService)(error);
            return null;
        }
    }

    public static async insertAuthorizationGroup(model: AuthorizationGroupDTO) {
        try {
            await ConnectorService.connect();
            return await Api.securityService.insertAuthorizationGroup(SessionService.getSecurityToken(), model, SessionService.timeOut);
        } catch (error) {
            Logger.handleError(SecurityService)(error);
            return null;
        }
    }

    public static async updateAuthorizationGroup(model: AuthorizationGroupDTO) {
        try {
            await ConnectorService.connect();
            return await Api.securityService.updateAuthorizationGroup(SessionService.getSecurityToken(), model, SessionService.timeOut);
        } catch (error) {
            Logger.handleError(SecurityService)(error);
            return null;
        }
    }

    public static async deleteAuthorizationGroup(id: string) {
        try {
            await ConnectorService.connect();
            return await Api.securityService.deleteAuthorizationGroup(SessionService.getSecurityToken(), id, SessionService.timeOut);
        } catch (error) {
            Logger.handleError(SecurityService)(error);
            return null;
        }
    }

    public static async getAllProjectAuthorization() {
        try {
            await ConnectorService.connect();
            return await Api.securityService.getAllProjectAuthorization(SessionService.getSecurityToken(), SessionService.timeOut);
        } catch (error) {
            Logger.handleError(SecurityService)(error);
            return null;
        }
    }

    public static async insertProjectAuthorization(model: ProjectAuthorizationDTO) {
        try {
            await ConnectorService.connect();
            return await Api.securityService.insertProjectAuthorization(SessionService.getSecurityToken(), model, SessionService.timeOut);
        } catch (error) {
            Logger.handleError(SecurityService)(error);
            return null;
        }
    }

    public static async updateProjectAuthorization(model: ProjectAuthorizationDTO) {
        try {
            await ConnectorService.connect();
            return await Api.securityService.updateProjectAuthorization(SessionService.getSecurityToken(), model, SessionService.timeOut);
        } catch (error) {
            Logger.handleError(SecurityService)(error);
            return null;
        }
    }

    public static async deleteProjectAuthorization(id: string) {
        try {
            await ConnectorService.connect();
            return await Api.securityService.deleteProjectAuthorization(SessionService.getSecurityToken(), id, SessionService.timeOut);
        } catch (error) {
            Logger.handleError(SecurityService)(error);
            return null;
        }
    }


    public static async getAllSystemAuthorization() {
        try {
            await ConnectorService.connect();
            return await Api.securityService.getAllSystemAuthorization(SessionService.getSecurityToken(), SessionService.timeOut);
        } catch (error) {
            Logger.handleError(SecurityService)(error);
            return null;
        }
    }


    public static async getAllSchedulerLocation() {
        try {
            await ConnectorService.connect();
            return await Api.securityService.getAllSchedulerLocation(SessionService.getSecurityToken(), SessionService.timeOut);
        } catch (error) {
            Logger.handleError(SecurityService)(error);
            return null;
        }
    }
    
    public static async getAllAccessGroup() {
        try {
            await ConnectorService.connect();
            return await Api.securityService.getAllAccessGroup(SessionService.getSecurityToken(), SessionService.timeOut);
        } catch (error) {
            Logger.handleError(SecurityService)(error);
            return null;
        }
    }

    public static async getAllAccessGroupDetails() {
        try {
            await ConnectorService.connect();
            return await Api.securityService.getAllAccessGroupDetails(SessionService.getSecurityToken(), SessionService.timeOut);
        } catch (error) {
            Logger.handleError(SecurityService)(error);
            return null;
        }
    }

    public static async insertAccessGroup(model: AccessGroupDTO) {
        try {
            await ConnectorService.connect();
            return await Api.securityService.insertAccessGroup(SessionService.getSecurityToken(), model, SessionService.timeOut);
        } catch (error) {
            Logger.handleError(SecurityService)(error);
            return null;
        }
    }

    public static async updateAccessGroup(model: AccessGroupDTO) {
        try {
            await ConnectorService.connect();
            return await Api.securityService.updateAccessGroup(SessionService.getSecurityToken(), model, SessionService.timeOut);
        } catch (error) {
            Logger.handleError(SecurityService)(error);
            return null;
        }
    }

    public static async deleteAccessGroup(id: string) {
        try {
            await ConnectorService.connect();
            return await Api.securityService.deleteAccessGroup(SessionService.getSecurityToken(), id, SessionService.timeOut);
        } catch (error) {
            Logger.handleError(SecurityService)(error);
            return null;
        }
    }


    private static async executeAfterLogin(resultobject: string | FunctionResultDTO<string>) {
        var token: string = resultobject as string;
        var functionResult = resultobject as FunctionResultDTO<string>;

        if (resultobject && typeof (resultobject) !== "string") {
            if (!functionResult.Succeeded) {
                const errorCode = _.first(functionResult.ErrorCodes);
                SecurityService.logLoginError(errorCode ? errorCode.toString() : "-1");
                return false;
            } else {
                token = functionResult.Result;
            }
        } else if (!SecurityService.isSecurityToken(token)) {
            const errorCode = _.first(JSON.parse(token)) as string;
            SecurityService.logLoginError(errorCode);
            return false;
        }


        SessionService.setSecurityToken(token);
        const result = await SessionService.updateSessionInformation();

        if (result) {
            const user = SessionService.currentLoggedInUser();
            const loggedInSuccessText = SymbolicTextsService.translate("I4SCADA_User_name_successfully_logged_in")().format(user);
            Logger.info(SecurityService, loggedInSuccessText);
            if (user !== "*") {
                Logger.successToast(loggedInSuccessText);
            }
            SecurityService.startSignalUpdate();
        }

        return result;
    }

    private static logLoginError(errorCode: string) {
        const symbolicErrorText = ErrorCodeService.loginErrorCodes[errorCode];
        const errorTranslation = ko.unwrap(SymbolicTextsService.translate(symbolicErrorText));
        Logger.warn(SecurityService, errorTranslation);
        Logger.warnToast(errorTranslation);
    }

    private static startSignalUpdate() {
        var projectName = "\\DefaultProject";
        SecurityService.sessionSignal = SignalsService.getSignal(`WFSInternal_Session_${SessionService.getClientId()}${projectName}`);
        SignalsService.getOnlineUpdates();

        if (!window.shouldCheckClientSession) return;

        var subscription = this.sessionSignal.value.subscribe((newValue: any) => {
            if (!newValue) {
                SessionService.clearSecureSession();
                subscription.dispose();
                SignalsService.unregisterSignals([SecurityService.sessionSignal]);
            }
        });
    }

    private static isSecurityToken(token: string) {
        if (!token) return false;
        if (token.includes("[") && token.includes("]")) return false;
        return _.isString(token);
    }
}

export = SecurityService;