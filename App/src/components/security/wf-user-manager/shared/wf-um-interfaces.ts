import  { SortOrder } from "./wf-um-enyms";

export interface WfUMSortedColumn {
    name: KnockoutObservable<string>,
    order: KnockoutObservable<string>,
}

export interface WfUMDropDownItem {
    value: string,
    text: string,
}

export interface WfUMUserActionsDTO {
    Icon: string,
    Time: string,
    Event: KnockoutComputed<string>,
    Text: KnockoutComputed<string>,
    UserName: string,
    AffectedUserName: string,
}

export interface EventsFilterExtended extends EventsFilter {
    AutoUpdate: boolean;
    TimeRangeDateInput: Date,
    SelectedRangeInput: CalendarTimeRanges,
    StartOffsetIntervall: number;
    StartOffset: string;
    EndOffset: string;
    EndOffsetIntervall: number;
}
