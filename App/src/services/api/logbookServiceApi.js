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
    var LogbookServiceApi = /** @class */ (function (_super) {
        __extends(LogbookServiceApi, _super);
        function LogbookServiceApi() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.getLogbookEntries = function (LogbookEntryQueryDTO) { return _this.post("LogbookService", "GetUTCLogbookEntries", {
                logbookEntryQueryDTO: LogbookEntryQueryDTO
            }); };
            _this.getLogbookTopics = function () { return _this.post("LogbookService", "GetLogbookTopics", {}); };
            _this.addLogbookEntry = function (logbookEntryDTO) { return _this.post("LogbookService", "AddLogbookEntry", {
                logbookEntryDTO: logbookEntryDTO
            }); };
            return _this;
        }
        return LogbookServiceApi;
    }(HttpApi));
    return LogbookServiceApi;
});
//# sourceMappingURL=logbookServiceApi.js.map