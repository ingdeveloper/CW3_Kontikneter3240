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
    var UsersServiceApi = /** @class */ (function (_super) {
        __extends(UsersServiceApi, _super);
        function UsersServiceApi() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.getCurrentUserDetails = function (sessionId, clientId) { return _this.post("UsersService", "GetCurrentUserDetails", {
                sessionId: sessionId,
                clientId: clientId
            }); };
            _this.changeUserPasswordByToken = function (securityToken, affectedUserId, newPassword, millisecondsTimeOut) { return _this.post("UsersService", "ChangeUserPasswordByToken", {
                securityToken: securityToken,
                affectedUserId: affectedUserId,
                newPassword: newPassword,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.changeCurrentUserPasswordByToken = function (securityToken, currentPassword, newPassword, millisecondsTimeOut) { return _this.post("UsersService", "ChangeCurrentUserPasswordByToken", {
                securityToken: securityToken,
                currentPassword: currentPassword,
                newPassword: newPassword,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.getAllUsers = function (sessionId, clientId, userName, isDomainUser, millisecondsTimeOut) { return _this.post("UsersService", "GetAllUsers", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.getAllUsersByToken = function (securityToken, millisecondsTimeOut) { return _this.post("UsersService", "GetAllUsersByToken", {
                securityToken: securityToken,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.getAllUserDetailsByToken = function (securityToken, millisecondsTimeOut) { return _this.post("UsersService", "GetAllUserDetailsByToken", {
                securityToken: securityToken,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.deleteUserByToken = function (securityToken, id, millisecondsTimeOut) { return _this.post("UsersService", "DeleteUserByToken", {
                securityToken: securityToken,
                id: id,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.updateUserByToken = function (securityToken, model, millisecondsTimeOut) { return _this.post("UsersService", "UpdateUserByToken", {
                securityToken: securityToken,
                model: model,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.insertUserByToken = function (securityToken, model, millisecondsTimeOut) { return _this.post("UsersService", "InsertUserByToken", {
                securityToken: securityToken,
                model: model,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            return _this;
        }
        return UsersServiceApi;
    }(HttpApi));
    return UsersServiceApi;
});
//# sourceMappingURL=usersServiceApi.js.map