import SessionService = require("./sessionService");
import Logger = require("./logger");
import Api = require("./api");
import ConnectorService = require("./connectorService");

class UsersService {
    public static timeOut = 10000;

    public static async getCurrentUserDetails() {
        Logger.info(UsersService, `getCurrentUserDetails`);
        await ConnectorService.connect();
        return await Api.usersService.getCurrentUserDetails(SessionService.sessionId, SessionService.getClientId());
    }

    public static async changeUserPassword(affectedUserId: string, newPassword: string) {
        Logger.info(UsersService, `changeUserPassword`);
        await ConnectorService.connect();
        return await Api.usersService.changeUserPasswordByToken(SessionService.getSecurityToken(), affectedUserId, newPassword, UsersService.timeOut);
    }

    public static async changeCurrentUserPassword(currentPassword: string, newPassword: string) {
        Logger.info(UsersService, `changeCurrentUserPassword`);
        await ConnectorService.connect();
        return await Api.usersService.changeCurrentUserPasswordByToken(SessionService.getSecurityToken(), currentPassword, newPassword, UsersService.timeOut);
    }

    public static async getAllUsers(keepAnonymousUser: boolean = false) {
        Logger.info(UsersService, `getAllUsers`);
        await ConnectorService.connect();
        const response = await Api.usersService.getAllUsersByToken(SessionService.getSecurityToken(), UsersService.timeOut);
        return response && !keepAnonymousUser ? response.filter(x => x.ID && x.ID !== "00000000-0000-0000-0000-000000000000"): response;
    }

    public static async getAllUserDetails() {
        Logger.info(UsersService, `getAllUserDetails`);
        await ConnectorService.connect();
        return await Api.usersService.getAllUserDetailsByToken(SessionService.getSecurityToken(), UsersService.timeOut);
    }

    public static async deleteUser(id: string) {
        Logger.info(UsersService, `deleteUser`);
        await ConnectorService.connect();
        return await Api.usersService.deleteUserByToken(SessionService.getSecurityToken(), id, UsersService.timeOut);
    }

    public static async updateUser(model: UserDTO) {
        Logger.info(UsersService, `updateUser`);
        await ConnectorService.connect();
        return await Api.usersService.updateUserByToken(SessionService.getSecurityToken(), model, UsersService.timeOut);
    }

    public static async insertUser(model: UserDTO) {
        Logger.info(UsersService, `insertUser`);
        await ConnectorService.connect();
        return await Api.usersService.insertUserByToken(SessionService.getSecurityToken(), model, UsersService.timeOut);
    }

}

export = UsersService;