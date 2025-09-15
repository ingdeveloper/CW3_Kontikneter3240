import SessionService = require("./sessionService");
import Logger = require("./logger");
import Api = require("./api");
import SymbolicTextsService = require("./symbolicTextsService");

class SilverlightToolsService {
    public static timeOut = 10000;

    private static eventTypePlaceholder = "##EVENTTYPE##";
    private static eventTimePlaceholder = "##EVENTTIME##";
    private static eventTime2Placeholder = "##EVENTTIME2##";
    private static userNamePlaceholder = "##USERNAME##";
    private static clientMachinePlaceholder = "##CLIENTMACHINE##";
    private static serverNamePlaceholder = "##SERVERNAME##";
    private static signalNamePlaceholder = "##SIGNALNAME##";
    private static signalDescriptionPlaceholder = "##SIGNALDESCRIPTION##";
    private static signalUnitPlaceholder = "##SIGNALUNIT##";
    private static opcItemNamePlaceholder = "##OPCITEMNAME##";
    private static connectorPlaceholder = "##CONNECTOR##";
    private static signalGroupPlaceholder = "##SIGNALGROUP##";
    private static alarmTextPlaceholder = "##ALARMTEXT##";
    private static alarmGroupPlaceholder = "##ALARMGROUP##";
    private static alarmTypePlaceholder = "##ALARMTYPE##";
    private static alarmAcknowledgeTextPlaceholder = "##ACKNOWLEDGETEXT##";
    private static signalNewValuePlaceholder = "##SIGNALNEWVALUE##";
    private static signalOldValuePlaceholder = "##SIGNALOLDVALUE##";
    private static resultCodePlaceholder = "##RESULTCODE##";

    private static placeholderList = [
        SilverlightToolsService.eventTypePlaceholder,
        SilverlightToolsService.eventTimePlaceholder,
        SilverlightToolsService.eventTime2Placeholder,
        SilverlightToolsService.userNamePlaceholder,
        SilverlightToolsService.clientMachinePlaceholder,
        SilverlightToolsService.serverNamePlaceholder,
        SilverlightToolsService.signalNamePlaceholder,
        SilverlightToolsService.signalDescriptionPlaceholder,
        SilverlightToolsService.signalUnitPlaceholder,
        SilverlightToolsService.opcItemNamePlaceholder,
        SilverlightToolsService.connectorPlaceholder,
        SilverlightToolsService.signalGroupPlaceholder,
        SilverlightToolsService.alarmTextPlaceholder,
        SilverlightToolsService.alarmGroupPlaceholder,
        SilverlightToolsService.alarmTypePlaceholder,
        SilverlightToolsService.alarmAcknowledgeTextPlaceholder,
        SilverlightToolsService.signalNewValuePlaceholder,
        SilverlightToolsService.signalOldValuePlaceholder,
        SilverlightToolsService.resultCodePlaceholder
    ];

    private static eventTextMap = [
        { type: WFEventType.AlarmOn, icon:"wf wf-alarm running", symbolicText: "I4SCADA_UM_EventAlarmOn", successfullSymbolicText: "I4SCADA_UM_SuccessfulAlarmOnEvent", failedSymbolicText: "I4SCADA_UM_FailedAlarmOnEvent" },
        { type: WFEventType.AlarmOff, icon: "wf wf-alarm red", symbolicText: "I4SCADA_UM_EventAlarmOff", successfullSymbolicText: "I4SCADA_UM_SuccessfulAlarmOffEvent", failedSymbolicText: "I4SCADA_UM_FailedAlarmOffEvent" },
        { type: WFEventType.AlarmAcknowledged, icon: "wf wf-alarm orange", symbolicText: "I4SCADA_UM_EventAlarmAcknowledged", successfullSymbolicText: "I4SCADA_UM_SuccessfulAlarmAcknowledgedEvent", failedSymbolicText: "I4SCADA_UM_FailedAlarmAcknowledgedEvent" },
        { type: WFEventType.AlarmActivated, icon: "wf wf-alarm", symbolicText: "I4SCADA_UM_EventAlarmActivated", successfullSymbolicText: "I4SCADA_UM_SuccessfulAlarmActivatedEvent", failedSymbolicText: "I4SCADA_UM_FailedAlarmActivatedEvent" },
        { type: WFEventType.AlarmDeactivated, icon: "wf wf-alarm-o", symbolicText: "I4SCADA_UM_EventAlarmDeactivated", successfullSymbolicText: "I4SCADA_UM_SuccessfulAlarmDeactivatedEvent", failedSymbolicText: "I4SCADA_UM_FailedAlarmDeactivatedEvent" },
        { type: WFEventType.ServerStarted, icon:"wf wf-play-round", symbolicText: "I4SCADA_UM_ServerStarted", successfullSymbolicText: "I4SCADA_UM_SuccessfulServerStartedEvent", failedSymbolicText: "I4SCADA_UM_FailedServerStartedEvent" },
        { type: WFEventType.ServerStopped, icon: "wf wf-stop-round", symbolicText: "I4SCADA_UM_ServerStopped", successfullSymbolicText: "I4SCADA_UM_SuccessfulServerStoppedEvent", failedSymbolicText: "I4SCADA_UM_FailedServerStoppedEvent" },
        { type: WFEventType.UserLoggedIn, icon: "wf wf-login text-info", symbolicText: "I4SCADA_UM_UserLoggedIn", successfullSymbolicText: "I4SCADA_UM_SuccessfulUserLoggedInEvent", failedSymbolicText: "I4SCADA_UM_FailedUserLoggedInEvent" },
        { type: WFEventType.UserLoggedOut, icon: "wf wf-logout orange", symbolicText: "I4SCADA_UM_UserLoggedOut", successfullSymbolicText: "I4SCADA_UM_SuccessfulUserLoggedOutEvent", failedSymbolicText: "I4SCADA_UM_FailedUserLoggedOutEvent" },
        { type: WFEventType.UserWroteSignal, icon: "wf wf-sine-wave", symbolicText: "I4SCADA_UM_UserWroteSignal", successfullSymbolicText: "I4SCADA_UM_SuccessfulUserWroteSignalEvent", failedSymbolicText: "I4SCADA_UM_FailedUserWroteSignalEvent" },
        { type: WFEventType.UserPasswordChanged, icon: "wf wf-password-field-1", symbolicText: "I4SCADA_UM_UserPasswordChanged", successfullSymbolicText: "I4SCADA_UM_SuccessfulUserPasswordChangedEvent", failedSymbolicText: "I4SCADA_UM_FailedUserPasswordChangedEvent" },
        { type: WFEventType.UserCreated, icon: "wf wf-user running", symbolicText: "I4SCADA_UM_UserCreated", successfullSymbolicText: "I4SCADA_UM_SuccessfulUserCreatedEvent", failedSymbolicText: "I4SCADA_UM_FailedUserCreatedEvent" },
        { type: WFEventType.UserDeleted, icon: "wf wf-user error", symbolicText: "I4SCADA_UM_UserDeleted", successfullSymbolicText: "I4SCADA_UM_SuccessfulUserDeletedEvent", failedSymbolicText: "I4SCADA_UM_FailedUserDeletedEvent" },
        { type: WFEventType.UserModified, icon: "wf wf-user-log", symbolicText: "I4SCADA_UM_UserModified", successfullSymbolicText: "I4SCADA_UM_SuccessfulUserModifiedEvent", failedSymbolicText: "I4SCADA_UM_FailedUserModifiedEvent" },
        ];

    public static async getWFEvents(filter: EventsFilter, languageId: number) {
        if (!filter) return null;

        const internalFilter: WFEventFilter = SilverlightToolsService.getWFEventsFilter(filter, languageId);
        Logger.info(SilverlightToolsService, `getWFEvents`);

        const events = await Api.silverlightTools.getWFEventsByToken(SessionService.getSecurityToken(), internalFilter, SilverlightToolsService.timeOut);

        return _.map(events, (event: WFEvent) => SilverlightToolsService.createVisualEvent(event));
    }

    public static async logUserActivity(eventDataDTO: EventDataDTO ) {
        if (!eventDataDTO) return null;

        Logger.info(SilverlightToolsService, `logUserActivity`);

        return await Api.silverlightTools.logUserActivityByToken(SessionService.getSecurityToken(), eventDataDTO, SilverlightToolsService.timeOut);
    }

    public static async getUserActivityEvents(filter: UserActivityEventFilter ) {
        if (!filter) return null;

        Logger.info(SilverlightToolsService, `getUserActivityEvents`);

        return await Api.silverlightTools.getUserActivityEventsByToken(SessionService.getSecurityToken(), filter, SilverlightToolsService.timeOut);
    }

    private static createVisualEvent(event: WFEvent): VisualEvent {
        const result = {} as VisualEvent;

        result.ID = event.ID;
        result.Version = event.Version;
        result.Type = event.Type;
        result.Time = event.Time;
        result.SystemTime = event.SystemTime;
        result.Alarm = event.Alarm;
        result.ClientMachine = event.ClientMachine;
        result.Server = event.Server;
        result.Signal = event.Signal;
        result.User = event.User;
        result.SignalOldValue = event.SignalOldValue;
        result.SignalNewValue = event.SignalNewValue;
        result.AlarmAcknoledgeText = event.AlarmAcknoledgeText;
        result.ResultCode = event.ResultCode;
        result.AffectedUserName = event.AffectedUserName;
        result.EventData = event.EventData;

        const textMap = _.find(SilverlightToolsService.eventTextMap, map => map.type === result.Type);

        if (textMap) {
            result.Icon = textMap.icon;
            result.EventText = SymbolicTextsService.translate(textMap.symbolicText);
            result.Text = ko.pureComputed<string>(() => {
                const unresolvedText = SymbolicTextsService.translate(result.ResultCode === 0
                                                                      ? textMap.successfullSymbolicText
                                                                      : textMap.failedSymbolicText);

                return SilverlightToolsService.resolvePlaceholders(unresolvedText(), result);
            });
        }

        return result;
    }

    private static getWFEventsFilter(filter: EventsFilter, languageId: number): WFEventFilter {

        const result: WFEventFilter = {
            AlarmFilter: {
                Action: FilterAction.IncludeNone
            } as WFAlarmEventFilter,
            ServerFilter: {
                Action: FilterAction.IncludeNone
            } as WFEventCategoryFilter,
            LanguageID: languageId,
            MaxEvents: filter.MaximumCount,
            TimePeriod: filter.Time,
            AffectedUserFilter: SilverlightToolsService.getAffectedUserEventFilter(filter.EventTypes, filter.Users, filter.ShouldFilterByUsers),
            UserFilter: SilverlightToolsService.getUserEventCategoryFilter(filter.EventTypes, filter.Users, filter.ShouldFilterByUsers)
        };

        return result;
    }

    private static getUserEventCategoryFilter(eventTypes: WFEventType[], users: NameDTO[], shouldFilterByUsers: boolean): WFUserEventCategoryFilter {
        const usersFilter: GenericItemListFilter<User> =
            shouldFilterByUsers
                ? {
                    Items: _.map<NameDTO, User>(users,
                        dto => {
                            return {
                                ID: dto.ID,
                                Name: dto.Name,
                                Version: 0
                            } as User;
                        }),
                    Action: FilterAction.IncludeSome
                }
                : { Items: [], Action: FilterAction.IncludeAll };

        return {
            UserFilter: usersFilter,
            Action: FilterAction.IncludeSome,
            EventResultFilter: { Action: FilterAction.IncludeAll, Items: [] },
            EventTypeFilter: {
                Items: eventTypes,
                Action: FilterAction.IncludeSome
            }
        };
    }

    private static getAffectedUserEventFilter(eventTypes: WFEventType[], users: NameDTO[], shouldFilterByUsers: boolean): WFAffectedUserEventFilter {
        const result = SilverlightToolsService.getUserEventCategoryFilter(eventTypes, users, shouldFilterByUsers) as WFAffectedUserEventFilter;
        result.CustomUserNameFilter = null;

        return result;
    }

    private static resolvePlaceholders(unresolvedText: string, event: VisualEvent): string {
        let result = ko.unwrap(unresolvedText);

        if (!result) return "";

        const existingPlaceholderList = _.filter(SilverlightToolsService.placeholderList,
            (placeholder) => {
                return result.indexOf(placeholder) > -1;
            });

        for (let placeholder of existingPlaceholderList) {
            const replacementValue = SilverlightToolsService.resolvePlaceholder(placeholder, event);
            result = result.replace(new RegExp(placeholder, "g"), replacementValue);
        }

        return result;
    }

    private static resolvePlaceholder(placeholder: string, event: VisualEvent): string {
        switch (placeholder) {
            case SilverlightToolsService.eventTypePlaceholder:
                return event.EventText();
            case SilverlightToolsService.eventTimePlaceholder:
                return event.Time;
            case SilverlightToolsService.eventTime2Placeholder:
                return event.SystemTime;
            case SilverlightToolsService.userNamePlaceholder:
                return event.User.Name;
            case SilverlightToolsService.clientMachinePlaceholder:
                return event.ClientMachine;
            case SilverlightToolsService.serverNamePlaceholder:
                return event.Server.Name;
            case SilverlightToolsService.signalNamePlaceholder:
                return event.Signal.AliasName;
            case SilverlightToolsService.signalDescriptionPlaceholder:
                return event.Signal.Description;
            case SilverlightToolsService.signalUnitPlaceholder:
                return event.Signal.Unit;
            //case SilverlightToolsService.opcItemNamePlaceholder:
            //    return visualEvent.Signal.OpcItemName;
            case SilverlightToolsService.connectorPlaceholder:
                return event.Signal.Group.Connector.Descriptio;
            case SilverlightToolsService.signalGroupPlaceholder:
                return event.Signal.Group.Name;
            case SilverlightToolsService.alarmTextPlaceholder:
                return event.Alarm.Text.Translation;
            case SilverlightToolsService.alarmGroupPlaceholder:
                return event.Alarm.Group.Text.Translation;
            case SilverlightToolsService.alarmTypePlaceholder:
                return event.Alarm.Type.Text.Translation;
            case SilverlightToolsService.alarmAcknowledgeTextPlaceholder:
                return event.AlarmAcknoledgeText;
            case SilverlightToolsService.signalNewValuePlaceholder:
                return event.SignalNewValue;
            case SilverlightToolsService.signalOldValuePlaceholder:
                return event.SignalOldValue;
            case SilverlightToolsService.resultCodePlaceholder:
                return event.ResultCode.toString();
            default:
                return "";
        }
    }
}

export = SilverlightToolsService;