var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./httpApi"], function (require, exports, HttpApi) {
    "use strict";
    var SecurityServiceApi = /** @class */ (function (_super) {
        __extends(SecurityServiceApi, _super);
        function SecurityServiceApi() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.connectWithToken = function (securityToken, requestedLicenses) {
                if (requestedLicenses === void 0) { requestedLicenses = null; }
                return _this.post("SecurityService", "ConnectWithToken", { securityToken: securityToken, requestedLicenses: requestedLicenses });
            };
            _this.login = function (sessionId, clientId, userName, password, isDomainUser, timeOut) { return _this.post("SecurityService", "Login", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                password: password,
                isDomainUser: isDomainUser,
                millisecondsTimeOut: timeOut
            }); };
            _this.isUserLoggedIn = function (securityToken, timeOut) { return _this.post("SecurityService", "IsUserLoggedIn", {
                securityToken: securityToken,
                millisecondsTimeOut: timeOut
            }); };
            _this.getCurrentLoggedInUser = function (securityToken, timeOut) { return _this.post("SecurityService", "GetCurrentLoggedInUser", {
                securityToken: securityToken,
                millisecondsTimeOut: timeOut
            }); };
            _this.logout = function (securityToken, timeOut) { return _this.post("SecurityService", "LogoutByToken", {
                securityToken: securityToken,
                millisecondsTimeOut: timeOut
            }); };
            _this.getCurrentUserAuthorizations = function (securityToken, timeOut) { return _this.post("SecurityService", "GetCurrentUserAuthorizations", {
                securityToken: securityToken,
                millisecondsTimeOut: timeOut
            }); };
            _this.checkProjectAuthorizations = function (securityToken, authorizations, timeOut) { return _this.post("SecurityService", "CheckProjectAuthorizations", {
                securityToken: securityToken,
                projectAuthorizations: authorizations,
                millisecondsTimeOut: timeOut
            }); };
            _this.checkSystemAuthorizations = function (securityToken, authorizations, timeOut) { return _this.post("SecurityService", "CheckSystemAuthorizations", {
                securityToken: securityToken,
                projectAuthorizations: authorizations,
                millisecondsTimeOut: timeOut
            }); };
            _this.loginWindowsUser = function (sessionId, clientId, timeOut) { return _this.postXhr("NtlmService", "LoginWindowsUser", {
                sessionId: sessionId,
                clientId: clientId,
                millisecondsTimeOut: timeOut
            }, null, { withCredentials: true }); };
            _this.getCallerAccountDetails = function () { return _this.post("NtlmService", "GetCallerAccountDetails", {}); };
            _this.getAllAuthorizationGroupDetails = function (securityToken, timeOut) { return _this.post("SecurityService", "GetAllAuthorizationGroupDetailsByToken", {
                securityToken: securityToken,
                millisecondsTimeOut: timeOut
            }); };
            _this.getAllAuthorizationGroup = function (securityToken, timeOut) { return _this.post("SecurityService", "GetAllAuthorizationGroupByToken", {
                securityToken: securityToken,
                millisecondsTimeOut: timeOut
            }); };
            _this.insertAuthorizationGroup = function (securityToken, model, timeOut) { return _this.post("SecurityService", "InsertAuthorizationGroupByToken", {
                securityToken: securityToken,
                model: model,
                millisecondsTimeOut: timeOut
            }); };
            _this.updateAuthorizationGroup = function (securityToken, model, timeOut) { return _this.post("SecurityService", "UpdateAuthorizationGroupByToken", {
                securityToken: securityToken,
                model: model,
                millisecondsTimeOut: timeOut
            }); };
            _this.deleteAuthorizationGroup = function (securityToken, id, timeOut) { return _this.post("SecurityService", "DeleteAuthorizationGroupByToken", {
                securityToken: securityToken,
                id: id,
                millisecondsTimeOut: timeOut
            }); };
            _this.getAllProjectAuthorization = function (securityToken, timeOut) { return _this.post("SecurityService", "GetAllProjectAuthorizationByToken", {
                securityToken: securityToken,
                millisecondsTimeOut: timeOut
            }); };
            _this.insertProjectAuthorization = function (securityToken, model, timeOut) { return _this.post("SecurityService", "InsertProjectAuthorizationByToken", {
                securityToken: securityToken,
                model: model,
                millisecondsTimeOut: timeOut
            }); };
            _this.updateProjectAuthorization = function (securityToken, model, timeOut) { return _this.post("SecurityService", "UpdateProjectAuthorizationByToken", {
                securityToken: securityToken,
                model: model,
                millisecondsTimeOut: timeOut
            }); };
            _this.deleteProjectAuthorization = function (securityToken, id, timeOut) { return _this.post("SecurityService", "DeleteProjectAuthorizationByToken", {
                securityToken: securityToken,
                id: id,
                millisecondsTimeOut: timeOut
            }); };
            _this.getAllSystemAuthorization = function (securityToken, timeOut) { return _this.post("SecurityService", "GetAllSystemAuthorizationByToken", {
                securityToken: securityToken,
                millisecondsTimeOut: timeOut
            }); };
            _this.getAllSchedulerLocation = function (securityToken, timeOut) { return _this.post("SecurityService", "GetAllSchedulerLocationByToken", {
                securityToken: securityToken,
                millisecondsTimeOut: timeOut
            }); };
            _this.getAllAccessGroup = function (securityToken, timeOut) { return _this.post("SecurityService", "GetAllAccessGroupByToken", {
                securityToken: securityToken,
                millisecondsTimeOut: timeOut
            }); };
            _this.getAllAccessGroupDetails = function (securityToken, timeOut) { return _this.post("SecurityService", "GetAllAccessGroupDetailsByToken", {
                securityToken: securityToken,
                millisecondsTimeOut: timeOut
            }); };
            _this.insertAccessGroup = function (securityToken, model, timeOut) { return _this.post("SecurityService", "InsertAccessGroupByToken", {
                securityToken: securityToken,
                model: model,
                millisecondsTimeOut: timeOut
            }); };
            _this.updateAccessGroup = function (securityToken, model, timeOut) { return _this.post("SecurityService", "UpdateAccessGroupByToken", {
                securityToken: securityToken,
                model: model,
                millisecondsTimeOut: timeOut
            }); };
            _this.deleteAccessGroup = function (securityToken, id, timeOut) { return _this.post("SecurityService", "DeleteAccessGroupByToken", {
                securityToken: securityToken,
                id: id,
                millisecondsTimeOut: timeOut
            }); };
            _this.getAllAccessAuthorization = function (securityToken, timeOut) { return _this.post("SecurityService", "GetAllAccessAuthorizationByToken", {
                securityToken: securityToken,
                millisecondsTimeOut: timeOut
            }); };
            _this.insertAccessAuthorization = function (securityToken, model, timeOut) { return _this.post("SecurityService", "InsertAccessAuthorizationByToken", {
                securityToken: securityToken,
                model: model,
                millisecondsTimeOut: timeOut
            }); };
            _this.updateAccessAuthorization = function (securityToken, model, timeOut) { return _this.post("SecurityService", "UpdateAccessAuthorizationByToken", {
                securityToken: securityToken,
                model: model,
                millisecondsTimeOut: timeOut
            }); };
            _this.deleteAccessAuthorization = function (securityToken, id, timeOut) { return _this.post("SecurityService", "DeleteAccessAuthorizationByToken", {
                securityToken: securityToken,
                id: id,
                millisecondsTimeOut: timeOut
            }); };
            return _this;
        }
        return SecurityServiceApi;
    }(HttpApi));
    return SecurityServiceApi;
});
//# sourceMappingURL=securityServiceApi.js.map