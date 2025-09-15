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
    var SilverlightToolsApi = /** @class */ (function (_super) {
        __extends(SilverlightToolsApi, _super);
        function SilverlightToolsApi() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.getWFEventsByToken = function (securityToken, wFEventFilter, timeOut) { return _this.post("SilverlightTools", "GetWFEventsByToken", {
                securityToken: securityToken,
                filter: wFEventFilter,
                millisecondsTimeOut: timeOut
            }); };
            _this.getWFEvents = function (sessionId, clientId, userName, isDomainUser, wFEventFilter, timeOut) { return _this.post("SilverlightTools", "GetWFEvents", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                filter: wFEventFilter,
                millisecondsTimeOut: timeOut
            }); };
            _this.logUserActivityByToken = function (securityToken, eventDataDTO, timeOut) { return _this.post("SilverlightTools", "LogUserActivityByToken", {
                securityToken: securityToken,
                eventDataDTO: eventDataDTO,
                millisecondsTimeOut: timeOut
            }); };
            _this.getUserActivityEventsByToken = function (securityToken, userActivityEventFilter, timeOut) { return _this.post("SilverlightTools", "GetUserActivityEventsByToken", {
                securityToken: securityToken,
                userActivityEventFilter: userActivityEventFilter,
                millisecondsTimeOut: timeOut
            }); };
            return _this;
        }
        return SilverlightToolsApi;
    }(HttpApi));
    return SilverlightToolsApi;
});
//# sourceMappingURL=silverlightsToolsApi.js.map