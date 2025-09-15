import HttpApi = require("./httpApi");

class ExportServiceApi extends HttpApi {


    public exportLogsValues = (sessionId: string, clientId: string, userName: string, isDomainUser: boolean, exportInformation: ExportLogValuesDTO, millisecondsTimeOut: number) => this.downloadFile("SignalsService", "ExportLogsValues", {
        sessionId: sessionId,
        clientId: clientId,
        userName: userName,
        isDomainUser: isDomainUser,
        exportInformation: exportInformation,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public exportLogsValuesByToken = (securityToken: string, exportInformation: ExportLogValuesDTO, millisecondsTimeOut: number) => this.downloadFile("SignalsService", "ExportLogsValuesByToken", {
        securityToken: securityToken,
        exportInformation: exportInformation,
        millisecondsTimeOut: millisecondsTimeOut
    });

}

export = ExportServiceApi;