define(["require", "exports", "./api/securityServiceApi", "./api/signalsServiceApi", "./api/alarmServiceApi", "./api/symbolicTextsServiceApi", "./api/logbookServiceApi", "./api/operationDiaryServiceApi", "./api/controlConfigurationsServiceApi", "./api/configurationsServiceApi", "./api/usersServiceApi", "./api/alarmDefinitionsServiceApi", "./api/silverlightsToolsApi", "./api/exportServiceApi"], function (require, exports, SecurityServiceApi, ServiceApi, AlarmServiceApi, SymbolicTextsServiceApi, LogbookServiceApi, OperationDiaryServiceApi, ControlConfigurationsServiceApi, ConfigurationsServiceApi, UsesServiceApi, AlarmDefinitionsServiceApi, SilverlightsToolsApi, ExportServiceApi) {
    "use strict";
    var Api = /** @class */ (function () {
        function Api() {
        }
        Api.securityService = new SecurityServiceApi();
        Api.signalsService = new ServiceApi();
        Api.alarmsService = new AlarmServiceApi();
        Api.symbolicTextsService = new SymbolicTextsServiceApi();
        Api.logbookService = new LogbookServiceApi();
        Api.operationDiaryService = new OperationDiaryServiceApi();
        Api.controlConfigurationsService = new ControlConfigurationsServiceApi();
        Api.configurationsService = new ConfigurationsServiceApi();
        Api.usersService = new UsesServiceApi();
        Api.alarmDefinitionsService = new AlarmDefinitionsServiceApi();
        Api.silverlightTools = new SilverlightsToolsApi();
        Api.exportService = new ExportServiceApi();
        return Api;
    }());
    return Api;
});
//# sourceMappingURL=api.js.map