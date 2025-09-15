import LogbookSource = require("./logbookSource");
import Api = require("./api");
import Logger = require("./logger");
import LogbookFilter = require("./models/logbookFilter");
import SessionService = require("./sessionService");
import Moment = moment.Moment;

class LogbookService {
    public static UpdateRate = 5000;

    public static getLogbookEntries(filter: LogbookFilter): LogbookSource {
        return new LogbookSource(filter, LogbookService.UpdateRate);
    }

    public static getLogbookTopics() {
        return Api.logbookService.getLogbookTopics();
    }

    public static addLogbookEntry(logbookEntry: LogbookEntryDTO) {
        return Api.logbookService.addLogbookEntry(logbookEntry);
    }

}

export = LogbookService;