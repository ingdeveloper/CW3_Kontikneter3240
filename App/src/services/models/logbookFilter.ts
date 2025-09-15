import Moment = moment.Moment;

class LogbookFilter {

    public topN: KnockoutObservable<number> = ko.observable<number>(null);
    public topic: KnockoutObservable<string> = ko.observable<string>(null);
    public author: KnockoutObservable<string> = ko.observable<string>(null);
    public from: KnockoutObservable<Moment> = ko.observable<Moment>();
    public to: KnockoutObservable<Moment> = ko.observable<Moment>();
    public format: KnockoutObservable<RichContentFormat> = ko.observable<RichContentFormat>(null);

    public toDto(): LogbookEntryQueryDTO {

        var dto: LogbookEntryQueryDTO = {

            TopN: this.topN(),
            Topic: this.topic(),
            Author: this.author(),
            From: this.from() ? this.from().utc().toMSDate() : null,
            To: this.to() ? this.to().utc().toMSDate() : null,
            Format: this.format()
        };

        return dto;
    }
}

export = LogbookFilter;