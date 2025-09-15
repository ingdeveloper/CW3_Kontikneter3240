import ComponentBaseModel = require("../component-base.model");
import { TimeRangeService } from "../services/time-range.service";

interface IWfTimeRangeComponentParams extends IComponentBaseParams {
    hideTimeRangeSelector: boolean;
    startOffset: "minutes" | "seconds" | "minutes" | "days" | "weeks" | "months" | "years";
    startOffsetIntervall: number;
    endOffset: "minutes" | "seconds" | "minutes" | "days" | "weeks" | "months" | "years";
    endOffsetIntervall: number;

    startDateInput: KnockoutObservable<Date>;
    timeRangeDateInput: KnockoutObservable<Date>;
    endDateInput: KnockoutObservable<Date>;
    selectedRangeInput: KnockoutObservable<CalendarTimeRanges>;
}

interface ITimeRange {
    id: CalendarTimeRanges, text: string;
}

class WfTimeRangeComponent extends ComponentBaseModel<IWfTimeRangeComponentParams> {
    private timeRangeCalendarWeeks: KnockoutComputed<boolean>;
    private timeRangeCalendarFormat: KnockoutComputed<"YYYY" | "MMMM YYYY" | "DD.MM.YYYY">;
    private timeRangeCalendarView: KnockoutComputed<"years" | "months" | "days">;
    private showDateTimeSelectors: KnockoutComputed<boolean>;
    private shouldDisableRangeChange: KnockoutComputed<boolean>;
    private showTimerangeCalendar: KnockoutComputed<boolean>;
    private timeRangeLabel: KnockoutComputed<string>;
    private ranges: ITimeRange[];
    private selectedRange: KnockoutObservable<CalendarTimeRanges>;
    private selectedRangeInput: KnockoutObservable<CalendarTimeRanges>;
    private timeRangeDateInput: KnockoutObservable<Date>;
    private endDateInput: KnockoutObservable<Date>;
    private startDateInput: KnockoutObservable<Date>;

    private endOffsetIntervall: number;
    private endOffset: string;
    private startOffsetIntervall: number;
    private startOffset: string;
    private hideTimeRangeSelector: boolean;

    private symbolicText: KnockoutObservable<string> | string;

    constructor(params: IWfTimeRangeComponentParams) {
        super(params);
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.hideTimeRangeSelector = this.settings.hideTimeRangeSelector ? this.settings.hideTimeRangeSelector : false;

        this.startOffset = ko.unwrap(this.settings.startOffset) ? ko.unwrap(this.settings.startOffset).trim().toLowerCase() : "minutes"; //"seconds", "minutes", "hours" "days", "weeks", "months", "years"
        this.startOffsetIntervall = ko.unwrap(this.settings.startOffsetIntervall) ? ko.unwrap(this.settings.startOffsetIntervall) : 15;

        this.endOffset = ko.unwrap(this.settings.endOffset) ? ko.unwrap(this.settings.endOffset).trim().toLowerCase() : "minutes"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
        this.endOffsetIntervall = ko.unwrap(this.settings.endOffsetIntervall) ? ko.unwrap(this.settings.endOffsetIntervall) : 0;

        this.startDateInput = this.settings.startDateInput ? this.settings.startDateInput : ko.observable<Date>();
        this.endDateInput = this.settings.endDateInput ? this.settings.endDateInput : ko.observable<Date>();
        this.timeRangeDateInput = this.settings.timeRangeDateInput ? this.settings.timeRangeDateInput : ko.observable<Date>();
        this.selectedRangeInput = this.settings.selectedRangeInput ? this.settings.selectedRangeInput : ko.observable<CalendarTimeRanges>();

        this.selectedRange = ko.observable(CalendarTimeRanges.Custom);

        this.ranges = [];
        this.initRanges();
        this.setTimeRangeDateInput();
        this.timeRangeChanged();
        this.timeRangeLabel = ko.computed(() => {
            var range = _.findWhere(this.ranges, { id: this.selectedRangeInput() });
            return range !== undefined ? range.text : "";
        }, this);

        this.showTimerangeCalendar = ko.computed(() => {
            return _.contains([CalendarTimeRanges.Year, CalendarTimeRanges.Month, CalendarTimeRanges.Week, CalendarTimeRanges.Day], this.selectedRangeInput());
        }, this);
        this.shouldDisableRangeChange = ko.pureComputed(() => {
            return ko.unwrap(this.hideTimeRangeSelector) || this.selectedRangeInput() !== CalendarTimeRanges.Custom;
        }, this);

        this.showDateTimeSelectors = ko.computed(() => {
            return _.contains([CalendarTimeRanges.Custom], this.selectedRangeInput());
        }, this);

        this.timeRangeCalendarView = ko.computed(() => {
            if (this.selectedRangeInput() === CalendarTimeRanges.Year)
                return 'years';

            if (this.selectedRangeInput() === CalendarTimeRanges.Month)
                return 'months';

            return "days";
        }, this);

        this.timeRangeCalendarFormat = ko.computed(() => {
            if (this.selectedRangeInput() === CalendarTimeRanges.Year)
                return 'YYYY';

            if (this.selectedRangeInput() === CalendarTimeRanges.Month)
                return 'MMMM YYYY';

            return "DD.MM.YYYY";
        }, this);
        this.timeRangeDateInput.subscribe(this.timeRangeChanged, this);
        this.timeRangeCalendarWeeks = ko.computed(() => {
            return this.selectedRangeInput() === CalendarTimeRanges.Week;
        }, this);
    }

    private timeRangeChanged() {
        this.startDateInput(TimeRangeService.getRangeStartDate(this.selectedRangeInput(), this.timeRangeDateInput() || new Date(), this.startDateInput(), this.startOffsetIntervall, this.startOffset));
        this.endDateInput(TimeRangeService.getRangeEndDate(this.selectedRangeInput(), this.timeRangeDateInput() || new Date(), this.endDateInput(), this.endOffsetIntervall, this.endOffset));
    }

    private setTimeRangeDateInput() {
        this.timeRangeDateInput(TimeRangeService.getRangeStartDate(this.selectedRangeInput(), this.timeRangeDateInput() || new Date(), this.startDateInput(), this.startOffsetIntervall, this.startOffset));
    }

    private initRanges() {
        this.ranges.push({ id: CalendarTimeRanges.Custom, text: this.connector.translate("I4SCADA_Custom_Range") });
        this.ranges.push({ id: CalendarTimeRanges.Year, text: this.connector.translate("I4SCADA_Year") });
        this.ranges.push({ id: CalendarTimeRanges.Month, text: this.connector.translate("I4SCADA_Month") });
        this.ranges.push({ id: CalendarTimeRanges.Week, text: this.connector.translate("I4SCADA_Week") });
        this.ranges.push({ id: CalendarTimeRanges.Day, text: this.connector.translate("I4SCADA_Day") });
        this.ranges.push({ id: CalendarTimeRanges.Actual, text: this.connector.translate("I4SCADA_Current") });
        this.ranges.push({ id: CalendarTimeRanges.Yesterday, text: this.connector.translate("I4SCADA_Yesterday") });
        this.ranges.push({ id: CalendarTimeRanges.Today, text: this.connector.translate("I4SCADA_Current_Day") });
    }
    
    protected async dispose() {
        await super.dispose();
    }
}

export = WfTimeRangeComponent;

