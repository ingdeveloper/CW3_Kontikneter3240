import HttpApi = require("./httpApi");

class SecurityServiceApi extends HttpApi {
    public connectWithToken = (securityToken: string, requestedLicenses: string[] = null) => this.post<SecuritySessionDTO>("SecurityService", "ConnectWithToken", { securityToken: securityToken, requestedLicenses: requestedLicenses });

    public login = (sessionId: string, clientId: string, userName: string, password: string, isDomainUser: boolean, timeOut: number) => this.post<string>("SecurityService", "Login", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        password: password,
        isDomainUser: isDomainUser,
        millisecondsTimeOut: timeOut
    });
    public isUserLoggedIn = (securityToken: string, timeOut: number) => this.post<boolean>("SecurityService", "IsUserLoggedIn", {
        securityToken: securityToken,
        millisecondsTimeOut: timeOut
    });
    public getCurrentLoggedInUser = (securityToken: string, timeOut: number) => this.post<UserDTO>("SecurityService", "GetCurrentLoggedInUser", {
        securityToken: securityToken,
        millisecondsTimeOut: timeOut
    });
    public logout = (securityToken: string, timeOut: number) => this.post<boolean>("SecurityService", "LogoutByToken", {
        securityToken: securityToken,
        millisecondsTimeOut: timeOut
    });
    public getCurrentUserAuthorizations = (securityToken: string, timeOut: number) => this.post<UserAuthorizationInfo>("SecurityService", "GetCurrentUserAuthorizations", {
        securityToken: securityToken,
        millisecondsTimeOut: timeOut
    });
    public checkProjectAuthorizations = (securityToken: string, authorizations: string[], timeOut: number) => this.post<{ [key: string]: boolean }[]>("SecurityService", "CheckProjectAuthorizations", {
        securityToken: securityToken,
        projectAuthorizations: authorizations,
        millisecondsTimeOut: timeOut
    });
    public checkSystemAuthorizations = (securityToken: string, authorizations: string[], timeOut: number) => this.post<{ [key: string]: boolean }[]>("SecurityService", "CheckSystemAuthorizations", {
        securityToken: securityToken,
        projectAuthorizations: authorizations,
        millisecondsTimeOut: timeOut
    });
    public loginWindowsUser = (sessionId: string, clientId: string, timeOut: number) => this.postXhr<any>("NtlmService", "LoginWindowsUser", {
        sessionId: sessionId,
        clientId: clientId,
        millisecondsTimeOut: timeOut
    }, null, { withCredentials: true });

    public getCallerAccountDetails = () => this.post<AccountDTO>("NtlmService", "GetCallerAccountDetails", {
        });

    public getAllAuthorizationGroupDetails = (securityToken: string, timeOut: number) => this.post<AuthorizationGroupDetailsDTO[]>("SecurityService", "GetAllAuthorizationGroupDetailsByToken", {
        securityToken: securityToken,
        millisecondsTimeOut: timeOut
    });
    public getAllAuthorizationGroup = (securityToken: string, timeOut: number) => this.post<AuthorizationGroupDTO[]>("SecurityService", "GetAllAuthorizationGroupByToken", {
        securityToken: securityToken,
        millisecondsTimeOut: timeOut
    });
    public insertAuthorizationGroup = (securityToken: string, model: AuthorizationGroupDTO, timeOut: number) => this.post<boolean>("SecurityService", "InsertAuthorizationGroupByToken", {
        securityToken: securityToken,
        model: model,
        millisecondsTimeOut: timeOut
    });
    public updateAuthorizationGroup = (securityToken: string, model: AuthorizationGroupDTO, timeOut: number) => this.post<boolean>("SecurityService", "UpdateAuthorizationGroupByToken", {
        securityToken: securityToken,
        model: model,
        millisecondsTimeOut: timeOut
    });
    public deleteAuthorizationGroup = (securityToken: string, id: string, timeOut: number) => this.post<boolean>("SecurityService", "DeleteAuthorizationGroupByToken", {
        securityToken: securityToken,
        id: id,
        millisecondsTimeOut: timeOut
    });

    public getAllProjectAuthorization = (securityToken: string, timeOut: number) => this.post<ProjectAuthorizationDTO[]>("SecurityService", "GetAllProjectAuthorizationByToken", {
            securityToken: securityToken,
            millisecondsTimeOut: timeOut
        });
    public insertProjectAuthorization = (securityToken: string, model: ProjectAuthorizationDTO, timeOut: number) => this.post<boolean>("SecurityService", "InsertProjectAuthorizationByToken", {
            securityToken: securityToken,
            model: model,
            millisecondsTimeOut: timeOut
        });
    public updateProjectAuthorization = (securityToken: string, model: ProjectAuthorizationDTO, timeOut: number) => this.post<boolean>("SecurityService", "UpdateProjectAuthorizationByToken", {
            securityToken: securityToken,
            model: model,
            millisecondsTimeOut: timeOut
        });
    public deleteProjectAuthorization = (securityToken: string, id: string, timeOut: number) => this.post<boolean>("SecurityService", "DeleteProjectAuthorizationByToken", {
            securityToken: securityToken,
            id: id,
            millisecondsTimeOut: timeOut
        });


    public getAllSystemAuthorization = (securityToken: string, timeOut: number) => this.post<SystemAuthorizationDTO[]>("SecurityService", "GetAllSystemAuthorizationByToken", {
            securityToken: securityToken,
            millisecondsTimeOut: timeOut
    });


    public getAllSchedulerLocation = (securityToken: string, timeOut: number) => this.post<SchedulerLocationDTO[]>("SecurityService", "GetAllSchedulerLocationByToken", {
            securityToken: securityToken,
            millisecondsTimeOut: timeOut
    });


    public getAllAccessGroup = (securityToken: string, timeOut: number) => this.post<AccessGroupDTO[]>("SecurityService", "GetAllAccessGroupByToken", {
            securityToken: securityToken,
            millisecondsTimeOut: timeOut
        });
    public getAllAccessGroupDetails = (securityToken: string, timeOut: number) => this.post<AccessGroupDetailsDTO[]>("SecurityService", "GetAllAccessGroupDetailsByToken", {
            securityToken: securityToken,
            millisecondsTimeOut: timeOut
        });
    public insertAccessGroup = (securityToken: string, model: AccessGroupDTO, timeOut: number) => this.post<boolean>("SecurityService", "InsertAccessGroupByToken", {
            securityToken: securityToken,
            model: model,
            millisecondsTimeOut: timeOut
        });
    public updateAccessGroup = (securityToken: string, model: AccessGroupDTO, timeOut: number) => this.post<boolean>("SecurityService", "UpdateAccessGroupByToken", {
            securityToken: securityToken,
            model: model,
            millisecondsTimeOut: timeOut
        });
    public deleteAccessGroup = (securityToken: string, id: string, timeOut: number) => this.post<boolean>("SecurityService", "DeleteAccessGroupByToken", {
            securityToken: securityToken,
            id: id,
            millisecondsTimeOut: timeOut
        });


    public getAllAccessAuthorization = (securityToken: string, timeOut: number) => this.post<AccessAuthorizationDTO[]>("SecurityService", "GetAllAccessAuthorizationByToken", {
            securityToken: securityToken,
            millisecondsTimeOut: timeOut
        });
    public insertAccessAuthorization = (securityToken: string, model: AccessAuthorizationDTO, timeOut: number) => this.post<boolean>("SecurityService", "InsertAccessAuthorizationByToken", {
            securityToken: securityToken,
            model: model,
            millisecondsTimeOut: timeOut
        });
    public updateAccessAuthorization = (securityToken: string, model: AccessAuthorizationDTO, timeOut: number) => this.post<boolean>("SecurityService", "UpdateAccessAuthorizationByToken", {
            securityToken: securityToken,
            model: model,
            millisecondsTimeOut: timeOut
        });
    public deleteAccessAuthorization = (securityToken: string, id: string, timeOut: number) => this.post<boolean>("SecurityService", "DeleteAccessAuthorizationByToken", {
            securityToken: securityToken,
            id: id,
            millisecondsTimeOut: timeOut
        });

}

export = SecurityServiceApi;