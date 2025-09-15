define(["require", "exports"], function (require, exports) {
    "use strict";
    var AlarmsFilter = /** @class */ (function () {
        function AlarmsFilter() {
            this.languageId = ko.observable(null);
            this.alarmGroups = ko.observableArray(null);
            this.alarmTypes = ko.observableArray(null);
            this.minimumPriority = ko.observable(null);
            this.maximumPriority = ko.observable(null);
            this.sortOrder = ko.observable(null);
            this.maxRowCount = ko.observable(null);
            this.alarmStatusFilter = ko.observable(AlarmStatusFilter.All);
            this.column = ko.observable(null);
            this.columnFilters = ko.observableArray(null);
            this.filterAlarmGroupsByUser = ko.observable(false);
            this.userName = ko.observable(null);
            this.startDate = ko.observable();
            this.endDate = ko.observable();
            this.isRollingTimeWindow = ko.observable();
        }
        AlarmsFilter.prototype.toDto = function (identityNumber, rowNumber) {
            if (identityNumber === void 0) { identityNumber = 0; }
            if (rowNumber === void 0) { rowNumber = 0; }
            var timeZone = window.defaultTimeZone;
            var dto = {
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
        };
        AlarmsFilter.prototype.copy = function () {
            var filter = new AlarmsFilter();
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
        };
        AlarmsFilter.prototype.set = function (filter) {
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
            this.startDate((filter.startDate()));
            this.endDate((filter.endDate()));
            this.startDate(filter.startDate());
            this.endDate(filter.endDate());
            this.isRollingTimeWindow(filter.isRollingTimeWindow());
        };
        AlarmsFilter.prototype.getValidMsDateTime = function (date, defaultDateTime) {
            if (date === undefined) {
                return defaultDateTime;
            }
            var momentDate = moment(date);
            return momentDate.isValid() ? momentDate.toMSDateTimeOffset() : defaultDateTime;
        };
        return AlarmsFilter;
    }());
    return AlarmsFilter;
});
//# sourceMappingURL=alarmsFilter.js.map