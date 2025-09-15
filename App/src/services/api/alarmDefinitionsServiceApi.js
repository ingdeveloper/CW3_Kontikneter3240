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
    var AlarmDefinitionsServiceApi = /** @class */ (function (_super) {
        __extends(AlarmDefinitionsServiceApi, _super);
        function AlarmDefinitionsServiceApi() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.getAlarmDefinitions = function (sessionId, clientId, userName, isDomainUser, filter, timeOut) { return _this.post("AlarmsService", "GetAlarmDefinitions", {
                sessionId: sessionId,
                clientId: clientId,
                userName: userName,
                isDomainUser: isDomainUser,
                filter: filter,
                millisecondsTimeOut: timeOut
            }); };
            return _this;
        }
        return AlarmDefinitionsServiceApi;
    }(HttpApi));
    return AlarmDefinitionsServiceApi;
});
//# sourceMappingURL=alarmDefinitionsServiceApi.js.map