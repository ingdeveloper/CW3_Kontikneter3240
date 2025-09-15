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
    var ExportServiceApi = /** @class */ (function (_super) {
        __extends(ExportServiceApi, _super);
        function ExportServiceApi() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.exportLogsValues = function (sessionId, clientId, userName, isDomainUser, exportInformation, millisecondsTimeOut) { return _this.downloadFile("SignalsService", "ExportLogsValues", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                exportInformation: exportInformation,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.exportLogsValuesByToken = function (securityToken, exportInformation, millisecondsTimeOut) { return _this.downloadFile("SignalsService", "ExportLogsValuesByToken", {
                securityToken: securityToken,
                exportInformation: exportInformation,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            return _this;
        }
        return ExportServiceApi;
    }(HttpApi));
    return ExportServiceApi;
});
//# sourceMappingURL=exportServiceApi.js.map