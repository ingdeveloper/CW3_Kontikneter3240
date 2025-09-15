interface IOccurrence {
    id: System.Guid;
    eventId: System.Guid;
    //event: (string | WEBfactory.DWH.Model.Event);

    //priority?: KnockoutObservable<WEBfactory.DWH.Model.EventPriority>;

    sourceId: System.Guid;
    //source: WEBfactory.DWH.Server.RealTime.Proxies.Model.Source | WEBfactory.DWH.Model.Source;

    start: moment.Moment;
    end?: KnockoutObservable<moment.Moment>;
    acknowledge?: KnockoutObservable<moment.Moment>;

    owner?: KnockoutObservable<string>;
    //metadata?: KnockoutObservable<WEBfactory.DWH.Data.Exchange.StringDictionary<WEBfactory.DWH.Server.Model.Events.MetadataEntry>>;

    partId?: KnockoutObservable<string>;

    comment?: KnockoutObservable<string>;
}