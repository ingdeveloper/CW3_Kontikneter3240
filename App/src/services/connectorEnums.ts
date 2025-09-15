export enum SignalDefinitionResultsFilter {
    Basic = 0,
    Extended = 1,
    Connector = 2,
    Group = 4,
    WriteGroup = 8,
    Server = 16,
    Logs = 32,
    DiscreteValues = 64,
    All = 128
}

export enum LogValuesSortOrder {
    DateAscending = 0,
    DateDescending = 1
}

export enum IncludedSymbolicTexts {
    SymbolicTexts = 0,
    InternallyUsed = 1,
    AlarmGroups = 2,
    AlarmTypes = 4,
    Alarms = 8,
    AlarmHelpTexts = 16,
    ExtendedAlarmProperties = 32,
    Signals = 64,
    SignalGroups = 128,
    Logs = 256,
    DiscreteValues = 512,
    All = 1024
}

export enum ServerSortOrder {
    DateDescending = 2,
    PriorityDescending = 4
}

export enum AlarmStatusFilter {
    All = 16,
    Gone = 8,
    Active = 4,
    NotAcknowledged = 2,
    ActiveOrNotAcknowledged = 0
}

export enum FilterColumnType {
    None,
    Text,
    SignalName,
    ServerName,
    OpcItem,
    Name,
    HttpLink,
    HelpCause,
    HelpEffect,
    HelpRepair,
    GeneralComment,
    OccurrenceComment,
    AcknowledgeComment,
    NavigationSource,
    NavigationTarget,
    ExtendedProperty1,
    ExtendedProperty2,
    ExtendedProperty3,
    ExtendedProperty4,
    ExtendedProperty5,
    ExtendedProperty6,
    ExtendedProperty7,
    ExtendedProperty8,
    ExtendedProperty9,
    ExtendedProperty10,
    ExtendedProperty11,
    ExtendedProperty12,
    ExtendedProperty13,
    ExtendedProperty14,
    ExtendedProperty15,
    ExtendedProperty16,
    ExtendedProperty17,
    ExtendedProperty18,
    ExtendedProperty19,
    ExtendedProperty20,
    ExtendedProperty21,
    ExtendedProperty22,
    ExtendedProperty23,
    ExtendedProperty24,
    ExtendedProperty25,
    ExtendedProperty26,
    ExtendedProperty27,
    ExtendedProperty28,
    ExtendedProperty29,
    ExtendedProperty30,
    ExtendedProperty31,
    ExtendedProperty32,
}

export enum AlarmProcessingAndDisplayState {
    OFF = 0,
    NotProcessedButVisible = 0,
    ON = 1,
    ProcessedAndVisible = 1,
    NotProcessedAndNotVisible = 2,
    ProcessedButNotVisible = 3,
}

export enum ConfigControlType {
    //Trending = 0,
    //OperationDiary = 1,
    //DataTable = 2,
    //AlarmViewer = 3,
    //Logbook = 4,
    //LogbookDocumentTemplate = 5,
    //AlarmManager = 6,
    //BacnetTrending = 7,
    LogStatistics = 8,
    LogTagTrend = 9,
    LogTagTable = 10,
    Alarmliste = 11,
    Logbook = 12,
    SignalList = 13,
    UserManager = 14,
    RecipeManager = 15,
    HistoricalDataChart = 16,
    SignalALarmList = 17,
}

export enum CalendarTimeRanges {
    Custom = 0,
    Year = 1,
    Month = 2,
    Week = 3,
    Day = 4,
    Actual = 5,
    Yesterday = 6,
    Today = 7,
}

//Enums
export enum EventType {
    AlarmOn = 1,
    AlarmOff = 2,
    AlarmAcknowledged = 3,
}

export enum WFEventType {
    AlarmOn = 1,
    AlarmOff = 2,
    AlarmAcknowledged = 3,
    ServerStarted = 4,
    ServerStopped = 5,
    UserLoggedIn = 6,
    UserLoggedOut = 7,
    UserWroteSignal = 8,
    AlarmActivated = 9,
    AlarmDeactivated = 10,
    UserCreated = 11,
    UserModified = 12,
    UserDeleted = 13,
    UserPasswordChanged = 14
}

export enum FilterAction {
    IncludeAll,
    IncludeSome,
    IncludeNone,
}

export enum WFEventResult {
    Successfull,
    Unsuccessfull
}

declare enum ExceptionType {
    Concurrency,
    Domain,
    Other
}

// Historical data enums
export enum ExportType {
    Csv,
    Excel,
    Xml,
    Json
}

export enum TimeSeriesMode {
    Offline,
    Online
}

export enum ToolboxButtons {
    PauseResume,
    TimeSettings,
    Export,
    LoadConfiguration,
    SaveConfiguration,
    Back,
    Forward,
    Devider
}

export enum DialogToolboxButtons {
    Axes,
    Data,
    Regions,
    Devider
}

export enum ChartType {
    Line,
    StackedLine,
    Dots,
    LineDots,
    Step,
    Bar,
    StackedBar
}

export enum SeriesDetailsDisplayMode {
    Row,
    Column,
    Card
}

export enum InterpolationTypes {
    None,
    Linear,
    CubicSpline,
    Differential
}

export enum ValuePosition {
    Outside,
    Inside
}

export enum SeriesDisplayType {
    Name,
    Alias,
    Description
}

export enum RangeConfigurationType {
    Value,
    Signal
}

export enum HorizontalLineConfigurationType {
    SignalMin,
    SignalMax,
    Value,
    IntervalMin,
    IntervalMax,
    IntervalAvg
}

export enum ExtendedAlarmDataType {
    String = 0,
    Integer = 1,
    Double = 2
}

export enum SortOrder {
    ASC,
    DESC
}
