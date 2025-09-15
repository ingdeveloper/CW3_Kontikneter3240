define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SortOrder = exports.ExtendedAlarmDataType = exports.HorizontalLineConfigurationType = exports.RangeConfigurationType = exports.SeriesDisplayType = exports.ValuePosition = exports.InterpolationTypes = exports.SeriesDetailsDisplayMode = exports.ChartType = exports.DialogToolboxButtons = exports.ToolboxButtons = exports.TimeSeriesMode = exports.ExportType = exports.WFEventResult = exports.FilterAction = exports.WFEventType = exports.EventType = exports.CalendarTimeRanges = exports.ConfigControlType = exports.AlarmProcessingAndDisplayState = exports.FilterColumnType = exports.AlarmStatusFilter = exports.ServerSortOrder = exports.IncludedSymbolicTexts = exports.LogValuesSortOrder = exports.SignalDefinitionResultsFilter = void 0;
    var SignalDefinitionResultsFilter;
    (function (SignalDefinitionResultsFilter) {
        SignalDefinitionResultsFilter[SignalDefinitionResultsFilter["Basic"] = 0] = "Basic";
        SignalDefinitionResultsFilter[SignalDefinitionResultsFilter["Extended"] = 1] = "Extended";
        SignalDefinitionResultsFilter[SignalDefinitionResultsFilter["Connector"] = 2] = "Connector";
        SignalDefinitionResultsFilter[SignalDefinitionResultsFilter["Group"] = 4] = "Group";
        SignalDefinitionResultsFilter[SignalDefinitionResultsFilter["WriteGroup"] = 8] = "WriteGroup";
        SignalDefinitionResultsFilter[SignalDefinitionResultsFilter["Server"] = 16] = "Server";
        SignalDefinitionResultsFilter[SignalDefinitionResultsFilter["Logs"] = 32] = "Logs";
        SignalDefinitionResultsFilter[SignalDefinitionResultsFilter["DiscreteValues"] = 64] = "DiscreteValues";
        SignalDefinitionResultsFilter[SignalDefinitionResultsFilter["All"] = 128] = "All";
    })(SignalDefinitionResultsFilter = exports.SignalDefinitionResultsFilter || (exports.SignalDefinitionResultsFilter = {}));
    var LogValuesSortOrder;
    (function (LogValuesSortOrder) {
        LogValuesSortOrder[LogValuesSortOrder["DateAscending"] = 0] = "DateAscending";
        LogValuesSortOrder[LogValuesSortOrder["DateDescending"] = 1] = "DateDescending";
    })(LogValuesSortOrder = exports.LogValuesSortOrder || (exports.LogValuesSortOrder = {}));
    var IncludedSymbolicTexts;
    (function (IncludedSymbolicTexts) {
        IncludedSymbolicTexts[IncludedSymbolicTexts["SymbolicTexts"] = 0] = "SymbolicTexts";
        IncludedSymbolicTexts[IncludedSymbolicTexts["InternallyUsed"] = 1] = "InternallyUsed";
        IncludedSymbolicTexts[IncludedSymbolicTexts["AlarmGroups"] = 2] = "AlarmGroups";
        IncludedSymbolicTexts[IncludedSymbolicTexts["AlarmTypes"] = 4] = "AlarmTypes";
        IncludedSymbolicTexts[IncludedSymbolicTexts["Alarms"] = 8] = "Alarms";
        IncludedSymbolicTexts[IncludedSymbolicTexts["AlarmHelpTexts"] = 16] = "AlarmHelpTexts";
        IncludedSymbolicTexts[IncludedSymbolicTexts["ExtendedAlarmProperties"] = 32] = "ExtendedAlarmProperties";
        IncludedSymbolicTexts[IncludedSymbolicTexts["Signals"] = 64] = "Signals";
        IncludedSymbolicTexts[IncludedSymbolicTexts["SignalGroups"] = 128] = "SignalGroups";
        IncludedSymbolicTexts[IncludedSymbolicTexts["Logs"] = 256] = "Logs";
        IncludedSymbolicTexts[IncludedSymbolicTexts["DiscreteValues"] = 512] = "DiscreteValues";
        IncludedSymbolicTexts[IncludedSymbolicTexts["All"] = 1024] = "All";
    })(IncludedSymbolicTexts = exports.IncludedSymbolicTexts || (exports.IncludedSymbolicTexts = {}));
    var ServerSortOrder;
    (function (ServerSortOrder) {
        ServerSortOrder[ServerSortOrder["DateDescending"] = 2] = "DateDescending";
        ServerSortOrder[ServerSortOrder["PriorityDescending"] = 4] = "PriorityDescending";
    })(ServerSortOrder = exports.ServerSortOrder || (exports.ServerSortOrder = {}));
    var AlarmStatusFilter;
    (function (AlarmStatusFilter) {
        AlarmStatusFilter[AlarmStatusFilter["All"] = 16] = "All";
        AlarmStatusFilter[AlarmStatusFilter["Gone"] = 8] = "Gone";
        AlarmStatusFilter[AlarmStatusFilter["Active"] = 4] = "Active";
        AlarmStatusFilter[AlarmStatusFilter["NotAcknowledged"] = 2] = "NotAcknowledged";
        AlarmStatusFilter[AlarmStatusFilter["ActiveOrNotAcknowledged"] = 0] = "ActiveOrNotAcknowledged";
    })(AlarmStatusFilter = exports.AlarmStatusFilter || (exports.AlarmStatusFilter = {}));
    var FilterColumnType;
    (function (FilterColumnType) {
        FilterColumnType[FilterColumnType["None"] = 0] = "None";
        FilterColumnType[FilterColumnType["Text"] = 1] = "Text";
        FilterColumnType[FilterColumnType["SignalName"] = 2] = "SignalName";
        FilterColumnType[FilterColumnType["ServerName"] = 3] = "ServerName";
        FilterColumnType[FilterColumnType["OpcItem"] = 4] = "OpcItem";
        FilterColumnType[FilterColumnType["Name"] = 5] = "Name";
        FilterColumnType[FilterColumnType["HttpLink"] = 6] = "HttpLink";
        FilterColumnType[FilterColumnType["HelpCause"] = 7] = "HelpCause";
        FilterColumnType[FilterColumnType["HelpEffect"] = 8] = "HelpEffect";
        FilterColumnType[FilterColumnType["HelpRepair"] = 9] = "HelpRepair";
        FilterColumnType[FilterColumnType["GeneralComment"] = 10] = "GeneralComment";
        FilterColumnType[FilterColumnType["OccurrenceComment"] = 11] = "OccurrenceComment";
        FilterColumnType[FilterColumnType["AcknowledgeComment"] = 12] = "AcknowledgeComment";
        FilterColumnType[FilterColumnType["NavigationSource"] = 13] = "NavigationSource";
        FilterColumnType[FilterColumnType["NavigationTarget"] = 14] = "NavigationTarget";
        FilterColumnType[FilterColumnType["ExtendedProperty1"] = 15] = "ExtendedProperty1";
        FilterColumnType[FilterColumnType["ExtendedProperty2"] = 16] = "ExtendedProperty2";
        FilterColumnType[FilterColumnType["ExtendedProperty3"] = 17] = "ExtendedProperty3";
        FilterColumnType[FilterColumnType["ExtendedProperty4"] = 18] = "ExtendedProperty4";
        FilterColumnType[FilterColumnType["ExtendedProperty5"] = 19] = "ExtendedProperty5";
        FilterColumnType[FilterColumnType["ExtendedProperty6"] = 20] = "ExtendedProperty6";
        FilterColumnType[FilterColumnType["ExtendedProperty7"] = 21] = "ExtendedProperty7";
        FilterColumnType[FilterColumnType["ExtendedProperty8"] = 22] = "ExtendedProperty8";
        FilterColumnType[FilterColumnType["ExtendedProperty9"] = 23] = "ExtendedProperty9";
        FilterColumnType[FilterColumnType["ExtendedProperty10"] = 24] = "ExtendedProperty10";
        FilterColumnType[FilterColumnType["ExtendedProperty11"] = 25] = "ExtendedProperty11";
        FilterColumnType[FilterColumnType["ExtendedProperty12"] = 26] = "ExtendedProperty12";
        FilterColumnType[FilterColumnType["ExtendedProperty13"] = 27] = "ExtendedProperty13";
        FilterColumnType[FilterColumnType["ExtendedProperty14"] = 28] = "ExtendedProperty14";
        FilterColumnType[FilterColumnType["ExtendedProperty15"] = 29] = "ExtendedProperty15";
        FilterColumnType[FilterColumnType["ExtendedProperty16"] = 30] = "ExtendedProperty16";
        FilterColumnType[FilterColumnType["ExtendedProperty17"] = 31] = "ExtendedProperty17";
        FilterColumnType[FilterColumnType["ExtendedProperty18"] = 32] = "ExtendedProperty18";
        FilterColumnType[FilterColumnType["ExtendedProperty19"] = 33] = "ExtendedProperty19";
        FilterColumnType[FilterColumnType["ExtendedProperty20"] = 34] = "ExtendedProperty20";
        FilterColumnType[FilterColumnType["ExtendedProperty21"] = 35] = "ExtendedProperty21";
        FilterColumnType[FilterColumnType["ExtendedProperty22"] = 36] = "ExtendedProperty22";
        FilterColumnType[FilterColumnType["ExtendedProperty23"] = 37] = "ExtendedProperty23";
        FilterColumnType[FilterColumnType["ExtendedProperty24"] = 38] = "ExtendedProperty24";
        FilterColumnType[FilterColumnType["ExtendedProperty25"] = 39] = "ExtendedProperty25";
        FilterColumnType[FilterColumnType["ExtendedProperty26"] = 40] = "ExtendedProperty26";
        FilterColumnType[FilterColumnType["ExtendedProperty27"] = 41] = "ExtendedProperty27";
        FilterColumnType[FilterColumnType["ExtendedProperty28"] = 42] = "ExtendedProperty28";
        FilterColumnType[FilterColumnType["ExtendedProperty29"] = 43] = "ExtendedProperty29";
        FilterColumnType[FilterColumnType["ExtendedProperty30"] = 44] = "ExtendedProperty30";
        FilterColumnType[FilterColumnType["ExtendedProperty31"] = 45] = "ExtendedProperty31";
        FilterColumnType[FilterColumnType["ExtendedProperty32"] = 46] = "ExtendedProperty32";
    })(FilterColumnType = exports.FilterColumnType || (exports.FilterColumnType = {}));
    var AlarmProcessingAndDisplayState;
    (function (AlarmProcessingAndDisplayState) {
        AlarmProcessingAndDisplayState[AlarmProcessingAndDisplayState["OFF"] = 0] = "OFF";
        AlarmProcessingAndDisplayState[AlarmProcessingAndDisplayState["NotProcessedButVisible"] = 0] = "NotProcessedButVisible";
        AlarmProcessingAndDisplayState[AlarmProcessingAndDisplayState["ON"] = 1] = "ON";
        AlarmProcessingAndDisplayState[AlarmProcessingAndDisplayState["ProcessedAndVisible"] = 1] = "ProcessedAndVisible";
        AlarmProcessingAndDisplayState[AlarmProcessingAndDisplayState["NotProcessedAndNotVisible"] = 2] = "NotProcessedAndNotVisible";
        AlarmProcessingAndDisplayState[AlarmProcessingAndDisplayState["ProcessedButNotVisible"] = 3] = "ProcessedButNotVisible";
    })(AlarmProcessingAndDisplayState = exports.AlarmProcessingAndDisplayState || (exports.AlarmProcessingAndDisplayState = {}));
    var ConfigControlType;
    (function (ConfigControlType) {
        //Trending = 0,
        //OperationDiary = 1,
        //DataTable = 2,
        //AlarmViewer = 3,
        //Logbook = 4,
        //LogbookDocumentTemplate = 5,
        //AlarmManager = 6,
        //BacnetTrending = 7,
        ConfigControlType[ConfigControlType["LogStatistics"] = 8] = "LogStatistics";
        ConfigControlType[ConfigControlType["LogTagTrend"] = 9] = "LogTagTrend";
        ConfigControlType[ConfigControlType["LogTagTable"] = 10] = "LogTagTable";
        ConfigControlType[ConfigControlType["Alarmliste"] = 11] = "Alarmliste";
        ConfigControlType[ConfigControlType["Logbook"] = 12] = "Logbook";
        ConfigControlType[ConfigControlType["SignalList"] = 13] = "SignalList";
        ConfigControlType[ConfigControlType["UserManager"] = 14] = "UserManager";
        ConfigControlType[ConfigControlType["RecipeManager"] = 15] = "RecipeManager";
        ConfigControlType[ConfigControlType["HistoricalDataChart"] = 16] = "HistoricalDataChart";
        ConfigControlType[ConfigControlType["SignalALarmList"] = 17] = "SignalALarmList";
    })(ConfigControlType = exports.ConfigControlType || (exports.ConfigControlType = {}));
    var CalendarTimeRanges;
    (function (CalendarTimeRanges) {
        CalendarTimeRanges[CalendarTimeRanges["Custom"] = 0] = "Custom";
        CalendarTimeRanges[CalendarTimeRanges["Year"] = 1] = "Year";
        CalendarTimeRanges[CalendarTimeRanges["Month"] = 2] = "Month";
        CalendarTimeRanges[CalendarTimeRanges["Week"] = 3] = "Week";
        CalendarTimeRanges[CalendarTimeRanges["Day"] = 4] = "Day";
        CalendarTimeRanges[CalendarTimeRanges["Actual"] = 5] = "Actual";
        CalendarTimeRanges[CalendarTimeRanges["Yesterday"] = 6] = "Yesterday";
        CalendarTimeRanges[CalendarTimeRanges["Today"] = 7] = "Today";
    })(CalendarTimeRanges = exports.CalendarTimeRanges || (exports.CalendarTimeRanges = {}));
    //Enums
    var EventType;
    (function (EventType) {
        EventType[EventType["AlarmOn"] = 1] = "AlarmOn";
        EventType[EventType["AlarmOff"] = 2] = "AlarmOff";
        EventType[EventType["AlarmAcknowledged"] = 3] = "AlarmAcknowledged";
    })(EventType = exports.EventType || (exports.EventType = {}));
    var WFEventType;
    (function (WFEventType) {
        WFEventType[WFEventType["AlarmOn"] = 1] = "AlarmOn";
        WFEventType[WFEventType["AlarmOff"] = 2] = "AlarmOff";
        WFEventType[WFEventType["AlarmAcknowledged"] = 3] = "AlarmAcknowledged";
        WFEventType[WFEventType["ServerStarted"] = 4] = "ServerStarted";
        WFEventType[WFEventType["ServerStopped"] = 5] = "ServerStopped";
        WFEventType[WFEventType["UserLoggedIn"] = 6] = "UserLoggedIn";
        WFEventType[WFEventType["UserLoggedOut"] = 7] = "UserLoggedOut";
        WFEventType[WFEventType["UserWroteSignal"] = 8] = "UserWroteSignal";
        WFEventType[WFEventType["AlarmActivated"] = 9] = "AlarmActivated";
        WFEventType[WFEventType["AlarmDeactivated"] = 10] = "AlarmDeactivated";
        WFEventType[WFEventType["UserCreated"] = 11] = "UserCreated";
        WFEventType[WFEventType["UserModified"] = 12] = "UserModified";
        WFEventType[WFEventType["UserDeleted"] = 13] = "UserDeleted";
        WFEventType[WFEventType["UserPasswordChanged"] = 14] = "UserPasswordChanged";
    })(WFEventType = exports.WFEventType || (exports.WFEventType = {}));
    var FilterAction;
    (function (FilterAction) {
        FilterAction[FilterAction["IncludeAll"] = 0] = "IncludeAll";
        FilterAction[FilterAction["IncludeSome"] = 1] = "IncludeSome";
        FilterAction[FilterAction["IncludeNone"] = 2] = "IncludeNone";
    })(FilterAction = exports.FilterAction || (exports.FilterAction = {}));
    var WFEventResult;
    (function (WFEventResult) {
        WFEventResult[WFEventResult["Successfull"] = 0] = "Successfull";
        WFEventResult[WFEventResult["Unsuccessfull"] = 1] = "Unsuccessfull";
    })(WFEventResult = exports.WFEventResult || (exports.WFEventResult = {}));
    // Historical data enums
    var ExportType;
    (function (ExportType) {
        ExportType[ExportType["Csv"] = 0] = "Csv";
        ExportType[ExportType["Excel"] = 1] = "Excel";
        ExportType[ExportType["Xml"] = 2] = "Xml";
        ExportType[ExportType["Json"] = 3] = "Json";
    })(ExportType = exports.ExportType || (exports.ExportType = {}));
    var TimeSeriesMode;
    (function (TimeSeriesMode) {
        TimeSeriesMode[TimeSeriesMode["Offline"] = 0] = "Offline";
        TimeSeriesMode[TimeSeriesMode["Online"] = 1] = "Online";
    })(TimeSeriesMode = exports.TimeSeriesMode || (exports.TimeSeriesMode = {}));
    var ToolboxButtons;
    (function (ToolboxButtons) {
        ToolboxButtons[ToolboxButtons["PauseResume"] = 0] = "PauseResume";
        ToolboxButtons[ToolboxButtons["TimeSettings"] = 1] = "TimeSettings";
        ToolboxButtons[ToolboxButtons["Export"] = 2] = "Export";
        ToolboxButtons[ToolboxButtons["LoadConfiguration"] = 3] = "LoadConfiguration";
        ToolboxButtons[ToolboxButtons["SaveConfiguration"] = 4] = "SaveConfiguration";
        ToolboxButtons[ToolboxButtons["Back"] = 5] = "Back";
        ToolboxButtons[ToolboxButtons["Forward"] = 6] = "Forward";
        ToolboxButtons[ToolboxButtons["Devider"] = 7] = "Devider";
    })(ToolboxButtons = exports.ToolboxButtons || (exports.ToolboxButtons = {}));
    var DialogToolboxButtons;
    (function (DialogToolboxButtons) {
        DialogToolboxButtons[DialogToolboxButtons["Axes"] = 0] = "Axes";
        DialogToolboxButtons[DialogToolboxButtons["Data"] = 1] = "Data";
        DialogToolboxButtons[DialogToolboxButtons["Regions"] = 2] = "Regions";
        DialogToolboxButtons[DialogToolboxButtons["Devider"] = 3] = "Devider";
    })(DialogToolboxButtons = exports.DialogToolboxButtons || (exports.DialogToolboxButtons = {}));
    var ChartType;
    (function (ChartType) {
        ChartType[ChartType["Line"] = 0] = "Line";
        ChartType[ChartType["StackedLine"] = 1] = "StackedLine";
        ChartType[ChartType["Dots"] = 2] = "Dots";
        ChartType[ChartType["LineDots"] = 3] = "LineDots";
        ChartType[ChartType["Step"] = 4] = "Step";
        ChartType[ChartType["Bar"] = 5] = "Bar";
        ChartType[ChartType["StackedBar"] = 6] = "StackedBar";
    })(ChartType = exports.ChartType || (exports.ChartType = {}));
    var SeriesDetailsDisplayMode;
    (function (SeriesDetailsDisplayMode) {
        SeriesDetailsDisplayMode[SeriesDetailsDisplayMode["Row"] = 0] = "Row";
        SeriesDetailsDisplayMode[SeriesDetailsDisplayMode["Column"] = 1] = "Column";
        SeriesDetailsDisplayMode[SeriesDetailsDisplayMode["Card"] = 2] = "Card";
    })(SeriesDetailsDisplayMode = exports.SeriesDetailsDisplayMode || (exports.SeriesDetailsDisplayMode = {}));
    var InterpolationTypes;
    (function (InterpolationTypes) {
        InterpolationTypes[InterpolationTypes["None"] = 0] = "None";
        InterpolationTypes[InterpolationTypes["Linear"] = 1] = "Linear";
        InterpolationTypes[InterpolationTypes["CubicSpline"] = 2] = "CubicSpline";
        InterpolationTypes[InterpolationTypes["Differential"] = 3] = "Differential";
    })(InterpolationTypes = exports.InterpolationTypes || (exports.InterpolationTypes = {}));
    var ValuePosition;
    (function (ValuePosition) {
        ValuePosition[ValuePosition["Outside"] = 0] = "Outside";
        ValuePosition[ValuePosition["Inside"] = 1] = "Inside";
    })(ValuePosition = exports.ValuePosition || (exports.ValuePosition = {}));
    var SeriesDisplayType;
    (function (SeriesDisplayType) {
        SeriesDisplayType[SeriesDisplayType["Name"] = 0] = "Name";
        SeriesDisplayType[SeriesDisplayType["Alias"] = 1] = "Alias";
        SeriesDisplayType[SeriesDisplayType["Description"] = 2] = "Description";
    })(SeriesDisplayType = exports.SeriesDisplayType || (exports.SeriesDisplayType = {}));
    var RangeConfigurationType;
    (function (RangeConfigurationType) {
        RangeConfigurationType[RangeConfigurationType["Value"] = 0] = "Value";
        RangeConfigurationType[RangeConfigurationType["Signal"] = 1] = "Signal";
    })(RangeConfigurationType = exports.RangeConfigurationType || (exports.RangeConfigurationType = {}));
    var HorizontalLineConfigurationType;
    (function (HorizontalLineConfigurationType) {
        HorizontalLineConfigurationType[HorizontalLineConfigurationType["SignalMin"] = 0] = "SignalMin";
        HorizontalLineConfigurationType[HorizontalLineConfigurationType["SignalMax"] = 1] = "SignalMax";
        HorizontalLineConfigurationType[HorizontalLineConfigurationType["Value"] = 2] = "Value";
        HorizontalLineConfigurationType[HorizontalLineConfigurationType["IntervalMin"] = 3] = "IntervalMin";
        HorizontalLineConfigurationType[HorizontalLineConfigurationType["IntervalMax"] = 4] = "IntervalMax";
        HorizontalLineConfigurationType[HorizontalLineConfigurationType["IntervalAvg"] = 5] = "IntervalAvg";
    })(HorizontalLineConfigurationType = exports.HorizontalLineConfigurationType || (exports.HorizontalLineConfigurationType = {}));
    var ExtendedAlarmDataType;
    (function (ExtendedAlarmDataType) {
        ExtendedAlarmDataType[ExtendedAlarmDataType["String"] = 0] = "String";
        ExtendedAlarmDataType[ExtendedAlarmDataType["Integer"] = 1] = "Integer";
        ExtendedAlarmDataType[ExtendedAlarmDataType["Double"] = 2] = "Double";
    })(ExtendedAlarmDataType = exports.ExtendedAlarmDataType || (exports.ExtendedAlarmDataType = {}));
    var SortOrder;
    (function (SortOrder) {
        SortOrder[SortOrder["ASC"] = 0] = "ASC";
        SortOrder[SortOrder["DESC"] = 1] = "DESC";
    })(SortOrder = exports.SortOrder || (exports.SortOrder = {}));
});
//# sourceMappingURL=connectorEnums.js.map