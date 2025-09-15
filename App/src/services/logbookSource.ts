import LogbookFilter = require("./models/logbookFilter");
import Api = require("./api");

class LogbookSource {
    protected isPollingEnabled = false;
    public logsEntries: KnockoutObservableArray<LogbookEntryDTO> = ko.observableArray<LogbookEntryDTO>([]);
    protected filterDto: LogbookEntryQueryDTO;
    constructor(public filter: LogbookFilter, public updateRate: number) {
        this.filterDto = filter.toDto();
        this.updateRate = updateRate;
    }

    public startPolling() {
        if (this.isPollingEnabled) {
            return;
        }
        this.filterDto = this.filter.toDto();
        this.isPollingEnabled = true;
        this.pollData(true);
    }

    public stopPolling() {
        this.isPollingEnabled = false;
    }

    public pollData(immediate = true): any {
        if (!this.isPollingEnabled) {
            return;
        }

        var timeOut = immediate ? 0 : this.updateRate;
        _.delay(() => this.getLogbookEntries(), timeOut);
    }

    protected getLogbookEntries() {
        Api.logbookService.getLogbookEntries(this.filterDto)
            .then((logsEntries: any) => {
                this.logsEntries(logsEntries);
                this.pollData(false);
            });
    }

    public getEntries() {
        Api.logbookService.getLogbookEntries(this.filterDto)
            .then((logsEntries: any) => {
                this.logsEntries(logsEntries);
            });
    }

    public getFilterDto() {
        var filter = this.filter;
        return filter.toDto();
    }

}
export = LogbookSource;