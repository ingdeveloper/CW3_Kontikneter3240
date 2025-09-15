declare enum SignalDefinitionResultsFilter {
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

declare enum LogValuesSortOrder {
    DateAscending = 0,
    DateDescending = 1
}

declare enum IncludedSymbolicTexts {
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

declare enum ServerSortOrder {
    DateDescending = 2,
    PriorityDescending = 4
}

declare enum AlarmStatusFilter {
    All = 16,
    Gone = 8,
    Active = 4,
    NotAcknowledged = 2,
    ActiveOrNotAcknowledged = 0
}

declare enum FilterColumnType {
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

declare enum AlarmProcessingAndDisplayState {
    OFF = 0,
    NotProcessedButVisible = 0,
    ON = 1,
    ProcessedAndVisible = 1,
    NotProcessedAndNotVisible = 2,
    ProcessedButNotVisible = 3,
}

declare enum ExportType {
    Csv,
    Excel,
    Xml,
    Json
}

declare type SignalValue = { [key: string]: any };

interface KeyValuePair<TKey, TValue> {
    key: TKey;
    value: TValue;
}

interface SessionDTO {
    SessionId: string;
    IsValidLicense: boolean;
}

interface SignalValueDTO {

    Value: any;
    Result: number;
}

interface SignalUpdateDTO {
    ResponseId: number;
    Updates: KeyValuePair<string, any>[];
}

interface I4SignalDeclaration {
    signalName: string;
    deviceName: string;
}

interface LogValuesFilterDTO {
    LogIDs: string[]; // string[]
    StartDate: moment.MSDateTimeOffset;
    EndDate: moment.MSDateTimeOffset;
    MaxResults?: number;
    SortOrder: LogValuesSortOrder;
}


interface SignalLogTagFilterDTO {
    SignalID: string;
    LogTag: string;
}

interface DatedLogValuesDTO {

    EntriesDate: DateTime | Date;
    Values: LogValueDTO[];
}

interface LogValueDTO {
    Value: number;

    Value2: string;

    EditedValue: number;

    EditedValue2: string;
}

interface GetSignalDefinitionsFilterDTO {
    ServerNames: string[];
    AliasNames: string[];
    LogTags: string[];
    ResultsFilter: SignalDefinitionResultsFilter;
}

interface DTO {
    ID: string;
}

//set Alias
interface SignalDefinitionDTO extends CommonSignalDefinition {

    AliasName: string;

    DescriptionSymbolicText: string;

    Status: number;

    OPCEnabled: boolean;

    OPCQuality: number;

    FactorX1: number;

    FactorX2: number;

    FactorY1: number;

    FactorY2: number;

    LogUserActivity: boolean;

    Hysterese: number;

    HystereseLog: number;

    HystereseAlarm: number;

    Hysterese_2: number;

    HystereseLog_2: number;

    HystereseAlarm_2: number;

    VChannel: boolean;

    VChannelTypeID: number;

    VChannelInitValue: string;

    AltValue: boolean;

    AltValue_1: number;

    AltValue_2: number;

    AltValue_3: number;

    AltValue_4: number;

    DataTypeID: number;

    OfflineValue: string;

    DiscreteValues: DiscreteValueDTO[];

    Logs: LogDTO[];

    Server: ServerDTO;

    Connector: ConnectorDTO;

    Group: SignalGroupDTO;

    WriteGroup: WriteGroupDTO;
}

interface DiscreteValueDTO extends DTO {
    Name: string;

    Value: number;

    Description: string;
}

interface LogDTO extends TranslatableDTO {

    LogTag: string;

    Description: string;

    Active: boolean;
}

interface ServerDTO extends DescriptionDTO {
}

interface DescriptionDTO extends NameDTO {

    Description: string;

}

interface NameDTO extends DTO {

    Name: string;

}

interface ConnectorDTO extends DTO {

    Name: string;

    Description: string;
}

interface SignalGroupDTO extends DTO {

    Name: string;

    Description: string;
}

interface WriteGroupDTO extends DescriptionDTO {
    Version: number;
    RestrictedAccess: boolean;
}

interface SecuritySessionDTO {
    Session: SessionDTO;
    SecurityToken: string;
}

interface UserAuthorizationInfo {
    ProjectAuthorizations: ProjectAuthorizationDTO[];
    SystemAuthorizations: SystemAuthorizationDTO[];
}

interface ProjectAuthorizationDTO extends DescriptionDTO {
    Version: number;
}

interface SystemAuthorizationDTO extends ProjectAuthorizationDTO {
}


interface SymbolicTextDTO extends DTO {
    SymbolicText: string;
    Translations: SymbolicTextTranslationDTO[];
}

interface SymbolicTextTranslationDTO extends DTO {
    LanguageID: number;
    Translation: string;
}

interface LanguageDTO {
    Id: number;
    Name: string;
    IsActive: boolean;
    IsDefault: boolean;
}


interface AlarmFilterDTO {

    LanguageID: number;

    TimeZoneID: string;

    AlarmGroups: string[];

    AlarmTypes: string[];

    MinimumPriority: number;

    MaximumPriority: number;

    SortOrder: ServerSortOrder;

    MaxRowCount: number;

    AlarmStatusFilter: AlarmStatusFilter;

    StartTime: moment.MSDateTimeOffset;

    EndTime: moment.MSDateTimeOffset;

    Column: FilterColumnType;

    ColumnFilters: string[];

    FilterAlarmGroupsByUser: boolean;

    UserName: string;

    IdentityNumber: number;

    RowNumber: number;
}

interface AlarmsDTO {

    Alarms: AlarmDTO[];

    HasMore: boolean;

    IdentityNumber: number;

    RowNumber: number;
}

interface AcknowledgeResultDTO {

    Result: boolean;

    ErrorCodes: number[];
}

interface AlarmDTO {

    AlarmLogID: string;

    DateOn: DateTime | Date;
    DateOff: DateTime | Date;
    DateAck: DateTime | Date;
    SysTime: DateTime | Date;
    AlarmID: string;

    AlarmTag: string;

    ServerName: string;

    SignalID: string;

    SignalName: string;

    SignalAliasName: string;

    ReplaceOn: number;

    Priority: number;

    AckText: string;

    AlarmLinkURL: string;

    Value1: string;
    Value2: string;
    Value3: string;
    Value4: string;
    Value5: string;
    Value6: string;
    Value7: string;
    Value8: string;
    Value9: string;
    Value10: string;
    Value11: string;
    Value12: string;
    Value13: string;
    Value14: string;
    Value15: string;
    Value16: string;
    Value17: string;
    Value18: string;
    Value19: string;
    Value20: string;

    AlarmConstant: number;

    AlarmConstantTo: number;

    AlarmSymbolicText: string;

    AlarmSymbolicTextTranslation: string;

    AlarmGroupSymbolicText: string;

    AlarmGroupSymbolicTextTranslation: string;

    AlarmTypeSymbolicText: string;

    AlarmTypeSymbolicTextTranslation: string;

    AckUserName: string;

    AlarmComment: string;

    OccurrenceComment: string;

    Status: string;

    ExtendedProperty1: string;

    ExtendedProperty2: string;

    ExtendedProperty3: string;

    ExtendedProperty4: string;

    ExtendedProperty5: string;

    ExtendedProperty6: string;

    ExtendedProperty7: string;

    ExtendedProperty8: string;

    ExtendedProperty9: string;

    ExtendedProperty10: string;

    ExtendedProperty11: string;

    ExtendedProperty12: string;

    ExtendedProperty13: string;

    ExtendedProperty14: string;

    ExtendedProperty15: string;

    ExtendedProperty16: string;

    ExtendedProperty17: string;

    ExtendedProperty18: string;

    ExtendedProperty19: string;

    ExtendedProperty20: string;

    ExtendedProperty21: string;

    ExtendedProperty22: string;

    ExtendedProperty23: string;

    ExtendedProperty24: string;

    ExtendedProperty25: string;

    ExtendedProperty26: string;

    ExtendedProperty27: string;

    ExtendedProperty28: string;

    ExtendedProperty29: string;

    ExtendedProperty30: string;

    ExtendedProperty31: string;

    ExtendedProperty32: string;

    HelpCause: string;

    HelpEffect: string;

    HelpRepair: string;

    OccurrenceCount: number;

    NavigationSource: string;

    NavigationTarget: string;

    OPCQuality: number;
}

interface AlarmGroupDTO extends TranslatableDTO {

}

interface TranslatableDTO extends DTO {

    SymbolicTextName: string;

    SymbolicTextTranslation: string;

}

interface AlarmTypeDTO extends TranslatableDTO {
}


interface LogbookEntryDTO extends DTO {
    CreatedOn: DateTime;
    Topic: string;
    Author: string;
    Subject: string;
    Body: string;
    Format: RichContentFormat;
}

interface LogbookEntryQueryDTO {
    TopN: number;
    Topic: string;
    Author: string;
    From: string;
    To: string;
    Format: RichContentFormat;
}

declare enum RichContentFormat {
    Text = 0,
    Xaml = 1,
    Html = 2,
    Docx = 3,
    Rtf = 4,
    MsRichTextBoxXaml = 5,
}

interface LogStatisticsFilterDTO {
    LogIDs: string[],
    StartDate: moment.MSDateTimeOffset,
    EndDate: moment.MSDateTimeOffset,
}

interface LogStatisticsDTO {
    LogID: string,
    Minimum: DateLogValueDTO,
    Maximum: DateLogValueDTO,
    Average: DateLogValueDTO,
}

interface DateLogValueDTO {
    Date: DateTime | Date,
    Value: LogValueDTO,
}

interface WritableSignalDTO {
    Name: string,
    Value: any,
}

declare enum CalendarTimeRanges {
    Custom = 0,
    Year = 1,
    Month = 2,
    Week = 3,
    Day = 4,
    Actual = 5,
    Yesterday = 6,
    Today = 7,
}

interface CommonSignalDefinition {
    ID: string;
    Name: string;
    Alias: string;
    Description: string;
    Unit: string;
    Active: boolean;
    Maximum: any;
    Minimum: any;
}

interface FunctionResultDTO<T> {
    Result: T;
    ErrorCodes: number[];
    Succeeded: boolean;
}
interface FunctionResultDTO<T> {

    Result: T;

    ErrorCodes: number[];

    Succeeded: boolean;
}

interface GetSignalNamesFilterDTO {
    ServerNames: string[],
    AliasNames: string[],
    Pattern?: string,
    GroupIds: Guid[],
    WithLogs?: boolean
}

interface GetGroupNamesFilterDTO {
    ServerNames: string[],
    GroupNames: string[],
}

interface UserDefaultSettingsDTO {
    ID: string,
    Description: string,
    UserLevel: number,
    AllowMultipleLogons: boolean,
    AutoLogOffInterval: number,
    MaxFailedLogons: number,
    LogActivities: boolean,
    IsAdmin: boolean,
    Active: boolean,
}

interface PasswordPolicyDTO {
    ID: string,
    EnforcePasswordHistoryCount: number,
    MinPasswordLength: number,
    MaxPasswordAgeInDays: number,
    MustContainDigits: boolean,
    MustContainUpperCaseChars: boolean,
    MustContainLowerCaseChars: boolean,
    MustContainSpecialChars: boolean,
}
interface MachineSettingsDTO {
    MachineName: string,
    HasVirtualKeyboard: boolean,
    UpdateRate: number,
}

interface AlarmProcessingAndDisplayDTO {
    AlarmID: Guid;
    AlarmTag: string;
    AlarmSymbolicTextTranslation: string;
    SignalName: string;
    OPCItemName: string;
    State: AlarmProcessingAndDisplayState;
}

interface WFEventFilter {
    AlarmFilter: WFAlarmEventFilter,
    ServerFilter: WFEventCategoryFilter,
    UserFilter: WFUserEventFilter,
    AffectedUserFilter: WFAffectedUserEventFilter,
    LanguageID: number,
    TimePeriod: TimePeriod,
    MaxEvents: number,
}

interface WFAlarmEventFilter extends WFEventCategoryFilter {
    AlarmTypeFilter: GenericItemListFilter<AlarmType>,
    AlarmGroupFilter: GenericItemListFilter<AlarmGroup>,
    AlarmPriorityFilter: AlarmPriorityFilter,
}

interface WFEventCategoryFilter extends AbstractFilter {
    EventResultFilter: GenericItemListFilter<WFEventResult>,
    EventTypeFilter: GenericItemListFilter<WFEventType>,
}

interface WFUserEventFilter extends WFUserEventCategoryFilter {
}

interface WFAffectedUserEventFilter extends WFUserEventCategoryFilter {
    CustomUserNameFilter: string,
}

interface WFUserEventCategoryFilter extends WFEventCategoryFilter {
    UserFilter: GenericItemListFilter<User>,
}

interface AlarmPriorityFilter extends AbstractFilter {
    From: number,
    To: number,
}

interface AbstractFilter {
    Action: FilterAction
}

interface GenericItemListFilter<T> extends AbstractFilter {
    Items: T[]
}

//DTOs
interface TimePeriod {
    Start: DateTime,
    End: DateTime,
}

interface DomainObject {
    ID: string,
    Version: number,
}

interface User extends DomainObject {
    Name: string
}

interface SymbolicTextBasedObject extends DomainObject {
    Text: SymbolicText
}

interface SymbolicText extends DomainObject {
    Name: string,
    Translation: string,
}

interface AlarmGroup extends SymbolicTextBasedObject {
}

interface AlarmType extends SymbolicTextBasedObject {
}

interface WFEvent extends DomainObject {
    Type: WFEventType,
    Time: DateTime,
    SystemTime: DateTime,
    Alarm: Alarm,
    ClientMachine: string,
    Server: Server,
    Signal: Signal,
    User: User,
    SignalOldValue: string,
    SignalNewValue: string,
    AlarmAcknoledgeText: string,
    ResultCode: number,
    AffectedUserName: string,
    EventData: string,
}

interface VisualEvent extends WFEvent {
    EventText: KnockoutComputed<string>,
    Text: KnockoutComputed<string>,
    Icon: string,
}

interface Alarm extends SymbolicTextBasedObject {
    Type: AlarmType,
    Group: AlarmGroup,
    Signal: Signal,
    Symbol: number,
    Priority: number,
    Value1?: number,
    Value2?: number,
    Value3?: number,
    Value4?: number,
    Value5?: number,
    Value6?: number,
    Value7?: number,
    Value8?: number,
    Value9?: number,
    Value10?: number,
    Value11?: number,
    Value12?: number,
    Value13?: number,
    Value14?: number,
    Value15?: number,
    Value16?: number,
    Value17?: number,
    Value18?: number,
    Value19?: number,
    Value20?: number,
}

interface Signal extends DomainObject {
    AliasName: string,
    Description: string,
    Unit: string,
    Name: string,
    Group: SignalGroup,
}

interface SignalGroup extends DomainObject {
    Name: string,
    Connector: Connector,
}

interface Connector extends DomainObject {
    Descriptio: string,
    Server: Server,
}

interface Server extends DomainObject {
    Name: string
}

//Enums
declare enum EventType {
    AlarmOn = 1,
    AlarmOff = 2,
    AlarmAcknowledged = 3,
}

declare enum WFEventType {
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

declare enum FilterAction {
    IncludeAll,
    IncludeSome,
    IncludeNone,
}

declare enum WFEventResult {
    Successfull,
    Unsuccessfull
}

declare enum ExceptionType {
    Concurrency,
    Domain,
    Other
}

interface EventsFilter {
    ShouldFilterByUsers: boolean,
    Users: NameDTO[],
    Time: TimePeriod,
    MaximumCount: number,
    EventTypes: WFEventType[],
}

interface RecipeManagerDTO extends DTO {
    UserId: Guid,
    Name: string,
    Owner: string,
    CreatedOn: DateTime,
    Version: string,
}

interface EventDataDTO {
    ActionText: string;
    AffectedEntityType: EntityType;
    AffectedEntityID: Guid;
    AffectedEntityName: string;
}

declare enum EntityType {
    Recipe = 1,
    RecipeDefinition = 2
}

interface UserActivityEventFilter {
    UserFilter: GenericItemListFilter<User>;
    LanguageID: number;
    TimePeriod: TimePeriod;
    MaxEvents: number;
}

interface UserActivityEvent extends DomainObject {
    ClientMachine: string;
    Time: DateTime;
    User: User;
    ResultCode: number;
    TranslatedActionText: string;
    ActionText: string;
    AffectedEntityType: EntityType;
    AffectedEntityID: object;
    AffectedEntityName: string;
}

interface ExportLogValuesDTO extends LogValuesFilterDTO {
    Colors: string[];
    LanguageId: number;
    CsvDelimiter: string;
    DateTimeFormat: string;
    ExportType: ExportType;
    FileName: string;
}

declare enum ExtendedAlarmDataType {
    String = 0,
    Integer = 1,
    Double = 2
}

interface ExtendedAlarmPropertyDTO {
    Index: number;
    IsActive: boolean
    DataType: ExtendedAlarmDataType;
    SymbolicTextName: string;
}

interface SignalWithAlarmInfosDTO {
    Data: SignalWithAlarmInfoDTO[];
    Count: number;
}

interface SignalWithAlarmInfoDTO {
    SignalId: System.Guid;
    Name: string;
    AliasName: string;
    Description: string;
    Unit: string;
    DiscreteValueTypeID: System.Guid;
    NotProcessedButVisibleCount?: number;
    ProcessedAndVisibleCount?: number;
    NotProcessedAndNotVisibleCount?: number;
    ProcessedButNotVisibleCount?: number;
    InactiveCount?: number;
    OnCount?: number;
    AcknowledgedCount?: number;
    OffCount?: number;
    AlarmInfos: AlarmInfoDTO[];
}

interface AlarmInfoDTO {
    AlarmId: System.Guid;
    AlarmTag: string;
}

enum AlarmOnlineStatus {
    Inactive,
    On,
    Acknowledged,
    Off
}

enum SortOrder {
    ASC,
    DESC
}

interface GetSignalsWithAlarmInfoFilterDTO {
    Pattern?: string;
    AliasNames?: string[];
    Unit?: string;
    AlarmProcessingAndDisplayStates?: AlarmProcessingAndDisplayState[];
    AlarmOnlineStatus?: AlarmOnlineStatus[];
    Order?: { Key: string, Value: SortOrder }[];
}