declare var uuid;

class AccessGroupObs {
    ID: KnockoutObservable<string>;
    Name: KnockoutObservable<string>;
    Description: KnockoutObservable<string>;
    TimeOn: KnockoutObservable<Date>;
    TimeOff: KnockoutObservable<Date>;
    Version: KnockoutObservable<number>;
    AccessAuthorizationIDs: KnockoutObservableArray<string>;
    
    constructor() {
        this.ID = ko.observable(null);
        this.Name = ko.observable(null);
        this.Name.extend({ required: '' }) // field is required
        this.Description = ko.observable(null);
        this.TimeOn = ko.observable(null);
        this.TimeOff = ko.observable(null);
        this.Version = ko.observable(0);
        this.AccessAuthorizationIDs = ko.observableArray([]);
    }

    initialize() {
        this.ID(uuid.v4()); // set new id
        this.Name(null);
        this.Description(null);
        this.TimeOn(this.dateTimeToday());
        this.TimeOff(this.dateTimeToday());
        this.Version(0);
        this.AccessAuthorizationIDs([]);
    }

    toDto() {
        let projectAuthorizationDto: AccessGroupDTO = {
            ID: this.ID(),
            Name: this.Name(),           
            Description: this.Description(),
            TimeOn: this.getDateOrTodayMsDate(this.TimeOn()),
            TimeOff: this.getDateOrTodayMsDate(this.TimeOff()),
            Version: this.Version(),
            AccessAuthorizationIDs: this.AccessAuthorizationIDs()
        }

        return projectAuthorizationDto;
    }

    fromDto(accessGroup: AccessGroupDTO) {
        this.ID(accessGroup.ID);
        this.Name(accessGroup.Name);
        this.Description(accessGroup.Description);
        this.TimeOn(moment(accessGroup.TimeOn).toDate());
        this.TimeOff(moment(accessGroup.TimeOff).toDate());
        this.Version(accessGroup.Version);
        this.AccessAuthorizationIDs(accessGroup.AccessAuthorizationIDs);
    }

    private dateTimeToday(): Date {
        var today = new Date();
        today.setHours(0); // or today.toUTCString(0) due to timezone differences
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        return today;
    }

    private getDateOrTodayMsDate(date: Date): string {
        let returnDate = date;

        if (!date) {
            returnDate = this.dateTimeToday();
        }

        return moment(returnDate).toMSDate();
    }
}

export = AccessGroupObs;