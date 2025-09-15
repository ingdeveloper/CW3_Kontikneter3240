import HttpApi = require("./httpApi");

class UsersServiceApi extends HttpApi {

    public getCurrentUserDetails = (sessionId: string, clientId: string) => this.post<UserDetailsDTO>("UsersService", "GetCurrentUserDetails", {
        sessionId: sessionId,
        clientId: clientId
    });

    public changeUserPasswordByToken = (securityToken: string, affectedUserId: string, newPassword: string, millisecondsTimeOut: number) => this.post<string>("UsersService", "ChangeUserPasswordByToken", {
        securityToken: securityToken,
        affectedUserId: affectedUserId,
        newPassword: newPassword,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public changeCurrentUserPasswordByToken = (securityToken: string, currentPassword: string, newPassword: string, millisecondsTimeOut: number) => this.post<string>("UsersService", "ChangeCurrentUserPasswordByToken", {
        securityToken: securityToken,
        currentPassword: currentPassword,
        newPassword: newPassword,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public getAllUsers = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, millisecondsTimeOut: number) => this.post<UserDTO>("UsersService", "GetAllUsers", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public getAllUsersByToken = (securityToken: string, millisecondsTimeOut: number) => this.post<UserDTO[]>("UsersService", "GetAllUsersByToken", {
        securityToken: securityToken,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public getAllUserDetailsByToken = (securityToken: string, millisecondsTimeOut: number) => this.post<UserDetailsDTO[]>("UsersService", "GetAllUserDetailsByToken", {
        securityToken: securityToken,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public deleteUserByToken = (securityToken: string, id: string, millisecondsTimeOut: number) => this.post<string>("UsersService", "DeleteUserByToken", {
        securityToken: securityToken,
        id: id,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public updateUserByToken = (securityToken: string, model: UserDTO, millisecondsTimeOut: number) => this.post<string>("UsersService", "UpdateUserByToken", {
        securityToken: securityToken,
        model: model,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public insertUserByToken = (securityToken: string, model: UserDTO, millisecondsTimeOut: number) => this.post<boolean>("UsersService", "InsertUserByToken", {
        securityToken: securityToken,
        model: model,
        millisecondsTimeOut: millisecondsTimeOut
    });
}

export = UsersServiceApi;