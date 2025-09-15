
class LogValuesFilter {
    public logIds = ko.observableArray<string>();
    public startDate = ko.observable<moment.Moment>();
    public endDate = ko.observable<moment.Moment>();
    public maxResults = ko.observable<number>();
    public sortOrder = ko.observable<LogValuesSortOrder>();

    constructor(logIds: string[], startDate: moment.Moment, endDate: moment.Moment, maxResults: number = null, sortOrder: LogValuesSortOrder = LogValuesSortOrder.DateAscending) {
        this.logIds(logIds);
        this.startDate(startDate);
        this.endDate(endDate);
        this.maxResults(maxResults);
        this.sortOrder(sortOrder);
    }

    public toDto(): LogValuesFilterDTO {
        var dto: LogValuesFilterDTO = {
            LogIDs: this.logIds(),
            StartDate: moment(this.startDate()).toMSDateTimeOffset(),
            EndDate: moment(this.endDate()).toMSDateTimeOffset(),
            SortOrder: this.sortOrder(),
            MaxResults: this.maxResults()
        };

        return dto;
    }
}

export = LogValuesFilter;