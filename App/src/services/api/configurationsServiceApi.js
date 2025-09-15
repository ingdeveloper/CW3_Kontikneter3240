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
    var ConfigurationsServiceApi = /** @class */ (function (_super) {
        __extends(ConfigurationsServiceApi, _super);
        function ConfigurationsServiceApi() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.getUserDefaultSettingsByToken = function (securityToken, millisecondsTimeOut) { return _this.post("ConfigurationsService", "GetUserDefaultSettingsByToken", {
                securityToken: securityToken,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.saveUserDefaultSettingsByToken = function (securityToken, model, millisecondsTimeOut) { return _this.post("ConfigurationsService", "SaveUserDefaultSettingsByToken", {
                securityToken: securityToken,
                model: model,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.getPasswordPolicySettingsByToken = function (securityToken, millisecondsTimeOut) { return _this.post("ConfigurationsService", "GetPasswordPolicySettingsByToken", {
                securityToken: securityToken,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.savePasswordPolicySettingsByToken = function (securityToken, model, millisecondsTimeOut) { return _this.post("ConfigurationsService", "SavePasswordPolicySettingsByToken", {
                securityToken: securityToken,
                model: model,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.getClientMachineSettings = function () { return _this.post("ConfigurationsService", "GetClientMachineSettings", {}); };
            return _this;
        }
        return ConfigurationsServiceApi;
    }(HttpApi));
    return ConfigurationsServiceApi;
});
//# sourceMappingURL=configurationsServiceApi.js.map