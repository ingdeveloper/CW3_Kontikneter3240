import SecurityServiceApi = require("./api/securityServiceApi");
import ServiceApi = require("./api/signalsServiceApi");
import AlarmServiceApi = require("./api/alarmServiceApi");
import SymbolicTextsServiceApi = require("./api/symbolicTextsServiceApi");
import LogbookServiceApi = require("./api/logbookServiceApi");
import OperationDiaryServiceApi = require("./api/operationDiaryServiceApi");
import ControlConfigurationsServiceApi = require("./api/controlConfigurationsServiceApi");
import ConfigurationsServiceApi = require("./api/configurationsServiceApi");
import UsesServiceApi = require("./api/usersServiceApi");
import AlarmDefinitionsServiceApi = require("./api/alarmDefinitionsServiceApi");
import SilverlightsToolsApi = require("./api/silverlightsToolsApi");
import ExportServiceApi = require("./api/exportServiceApi");

class Api {
    public static securityService = new SecurityServiceApi();
    public static signalsService = new ServiceApi();
    public static alarmsService = new AlarmServiceApi();
    public static symbolicTextsService = new SymbolicTextsServiceApi();
    public static logbookService = new LogbookServiceApi();
    public static operationDiaryService = new OperationDiaryServiceApi();
    public static controlConfigurationsService = new ControlConfigurationsServiceApi();
    public static configurationsService = new ConfigurationsServiceApi();
    public static usersService = new UsesServiceApi();
    public static alarmDefinitionsService = new AlarmDefinitionsServiceApi();
    public static silverlightTools = new SilverlightsToolsApi();
    public static exportService = new ExportServiceApi();
}

export = Api;