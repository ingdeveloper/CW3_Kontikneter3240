import HttpApi = require("./httpApi");

class LogbookServiceApi extends HttpApi {

    public getLogbookEntries = (LogbookEntryQueryDTO: LogbookEntryQueryDTO) => this.post<LogbookEntryDTO[]>("LogbookService", "GetUTCLogbookEntries", {
        logbookEntryQueryDTO: LogbookEntryQueryDTO
    });

    public getLogbookTopics = () => this.post<string[]>("LogbookService", "GetLogbookTopics", {});

    public addLogbookEntry = (logbookEntryDTO: LogbookEntryDTO) => this.post("LogbookService", "AddLogbookEntry", {
        logbookEntryDTO: logbookEntryDTO
    });

}

export = LogbookServiceApi;