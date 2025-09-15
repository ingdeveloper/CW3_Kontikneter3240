import SessionService = require("./sessionService");
import ConnectorService = require("./connectorService");
import Api = require("./api");
import Logger = require("./logger");

class AuthorizationGroupService {
    public static timeOut = 10000;

    public static async getAllAuthorizationGroupDetails() {
        Logger.info(AuthorizationGroupService, `getAllAuthorizationGroupDetails`);
        await ConnectorService.connect();
        return await Api.securityService.getAllAuthorizationGroupDetails(SessionService.getSecurityToken(), AuthorizationGroupService.timeOut);
    }
    public static async getAllAuthorizationGroup() {
        Logger.info(AuthorizationGroupService, `getAllAuthorizationGroup`);
        await ConnectorService.connect();
        return await Api.securityService.getAllAuthorizationGroup(SessionService.getSecurityToken(), AuthorizationGroupService.timeOut);
    }
    public static async insertAuthorizationGroup(model: AuthorizationGroupDTO) {
        Logger.info(AuthorizationGroupService, `insertAuthorizationGroup`);
        await ConnectorService.connect();
        return await Api.securityService.insertAuthorizationGroup(SessionService.getSecurityToken(), model, AuthorizationGroupService.timeOut);
    }
    public static async updateAuthorizationGroup(model: AuthorizationGroupDTO) {
        Logger.info(AuthorizationGroupService, `updateAuthorizationGroup`);
        await ConnectorService.connect();
        return await Api.securityService.updateAuthorizationGroup(SessionService.getSecurityToken(), model, AuthorizationGroupService.timeOut);
    }
    public static async deleteAuthorizationGroup(id: string) {
        Logger.info(AuthorizationGroupService, `deleteAuthorizationGroup`);
        await ConnectorService.connect();
        return await Api.securityService.deleteAuthorizationGroup(SessionService.getSecurityToken(), id, AuthorizationGroupService.timeOut);
    }

}

export = AuthorizationGroupService;