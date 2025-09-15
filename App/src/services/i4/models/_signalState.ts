import Guid = System.Guid;

interface ISignalState extends WEBfactory.DWH.Data.Exchange.INamedItem<Guid> {
    timestamp: KnockoutObservable<moment.Moment>;
    value: KnockoutObservable<any>;
}