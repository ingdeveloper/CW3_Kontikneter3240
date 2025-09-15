class OperationDiaryFilter {

    public affectedUserFilter: WFAffectedUserEventFilter = null;
    public alarmFilter: WFAlarmEventFilter = null;
    public languageId: number = null;
    public maxEvents: number = null;
    public serverFilter: WFEventCategoryFilter = null;
    public timePeriod: TimePeriod = null;
    public userFilter: WFUserEventFilter = null;

    public getTimePeriode = () => {
        return {
            Start: moment().subtract("hours", 1).toMSDate(),
            End: moment().toMSDate()
        };
    }

    public toDto(): WFEventFilter {

        const dto: WFEventFilter = {
            AffectedUserFilter: this.affectedUserFilter,
            AlarmFilter: this.alarmFilter,
            LanguageID: this.languageId,
            MaxEvents: this.maxEvents,
            ServerFilter: this.serverFilter,
            TimePeriod: this.timePeriod ? this.timePeriod : this.getTimePeriode(),
            UserFilter: this.userFilter,

            // From: this.from() ? this.from().utc().toMSDate() : null,
            // To: this.to() ? this.to().utc().toMSDate() : null,

        };

        return dto;
    }
}

export = OperationDiaryFilter;