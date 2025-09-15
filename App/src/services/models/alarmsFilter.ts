import Moment = moment.Moment;
import MSDateTimeOffset = moment.MSDateTimeOffset;

class AlarmsFilter {
    public languageId = ko.observable<number>(null);
    public alarmGroups = ko.observableArray<string>(null);
    public alarmTypes = ko.observableArray<string>(null);
    public minimumPriority = ko.observable<number>(null);
    public maximumPriority = ko.observable<number>(null);
    public sortOrder = ko.observable<ServerSortOrder>(null);
    public maxRowCount = ko.observable<number>(null);
    public alarmStatusFilter = ko.observable<AlarmStatusFilter>(AlarmStatusFilter.All);
    public column = ko.observable<FilterColumnType>(null);
    public columnFilters = ko.observableArray<string>(null);
    public filterAlarmGroupsByUser = ko.observable<boolean>(false);
    public userName = ko.observable<string>(null);

    public startDate = ko.observable<Date>();
    public endDate = ko.observable<Date>();
    public isRollingTimeWindow = ko.observable<boolean>();

    public toDto(identityNumber: number = 0, rowNumber: number = 0): AlarmFilterDTO {
        const timeZone = window.defaultTimeZone;

        const dto: AlarmFilterDTO = {
            LanguageID: this.languageId(),
            TimeZoneID: timeZone,
            AlarmGroups: this.alarmGroups(),
            AlarmTypes: this.alarmTypes(),
            MinimumPriority: this.minimumPriority(),
            MaximumPriority: this.maximumPriority(),
            SortOrder: this.sortOrder(),
            MaxRowCount: this.maxRowCount(),
            AlarmStatusFilter: this.alarmStatusFilter(),
            StartTime: this.getValidMsDateTime(this.startDate(), moment().minimumMSDateTimeOffset()),
            EndTime: this.getValidMsDateTime(this.endDate(), moment().maximumMSDateTimeOffset()),
            Column: this.column(),
            ColumnFilters: this.columnFilters(),
            FilterAlarmGroupsByUser: this.filterAlarmGroupsByUser(),
            UserName: this.userName(),
            IdentityNumber: identityNumber,
            RowNumber: rowNumber
        };

        return dto;
    }

    public copy() {
        const filter = new AlarmsFilter();
        filter.languageId(this.languageId());
        filter.alarmGroups(this.alarmGroups().concat([]));
        filter.alarmTypes(this.alarmTypes().concat([]));
        filter.minimumPriority(this.minimumPriority());
        filter.maximumPriority(this.maximumPriority());
        filter.sortOrder(this.sortOrder());
        filter.maxRowCount(this.maxRowCount());
        filter.alarmStatusFilter(this.alarmStatusFilter());
        filter.column(this.column());
        filter.columnFilters(this.columnFilters().concat([]));
        filter.filterAlarmGroupsByUser(this.filterAlarmGroupsByUser());
        filter.userName(this.userName());
        filter.startDate(new Date(this.startDate()));
        filter.endDate(new Date(this.endDate()));
        filter.startDate(this.startDate());
        filter.endDate(this.endDate());
        filter.isRollingTimeWindow(this.isRollingTimeWindow());
        return filter;
    }

    public set(filter: AlarmsFilter) {
        this.languageId(filter.languageId());
        this.alarmGroups(filter.alarmGroups().concat([]));
        this.alarmTypes(filter.alarmTypes().concat([]));
        this.minimumPriority(filter.minimumPriority());
        this.maximumPriority(filter.maximumPriority());
        this.sortOrder(filter.sortOrder());
        this.maxRowCount(filter.maxRowCount());
        this.alarmStatusFilter(filter.alarmStatusFilter());
        this.column(filter.column());
        this.columnFilters(filter.columnFilters().concat([]));
        this.filterAlarmGroupsByUser(filter.filterAlarmGroupsByUser());
        this.userName(filter.userName());
        // this.startDate(new Date(filter.startDate()));
        // this.endDate(new Date(filter.endDate()));
        this.startDate( (filter.startDate()));
        this.endDate( (filter.endDate()));
        this.startDate(filter.startDate());
        this.endDate(filter.endDate());
        this.isRollingTimeWindow(filter.isRollingTimeWindow());
    }

    private getValidMsDateTime(date: Date, defaultDateTime: MSDateTimeOffset): MSDateTimeOffset {
        if (date === undefined) {
            return defaultDateTime;
        }

        const momentDate = moment(date);

        return momentDate.isValid() ? momentDate.toMSDateTimeOffset() : defaultDateTime;
    }
}

export = AlarmsFilter;