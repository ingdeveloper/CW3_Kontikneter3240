import OperationDiaryFilter = require("./models/operationDiaryFilter");
import Api = require("./api");
import SessionService = require("./sessionService");
import ConnectorService = require("./connectorService");
import SignalsService = require("./signalsService");
import Signal = require("./models/signal");

class OperationDiarySource {
    public subscription: KnockoutSubscription;
    public EventsUpdatedSignal: Signal;
    public isPollingEnabled = false;
    public static updateInterval = 10000;
    public events: KnockoutObservableArray<WFEvent> = ko.observableArray<WFEvent>([]);

    constructor(private filter: OperationDiaryFilter) {

    }

    public async startPolling() {
        if (this.isPollingEnabled) {
            return;
        }

        this.isPollingEnabled = true;

        if (!this.EventsUpdatedSignal) {
            this.EventsUpdatedSignal = SignalsService.getSignal("WFSInternal_EventUpdates");
            await SignalsService.getOnlineUpdates();
        }

        if (!this.subscription) {
            this.subscription = this.EventsUpdatedSignal.value.subscribe(() => {
                this.pollData(false);
            });
        }
        _.delay(() => this.pollData(), OperationDiarySource.updateInterval);
    }

    public async stopPolling() {
        this.isPollingEnabled = false;
        this.subscription.dispose();
        await SignalsService.unregisterSignals([this.EventsUpdatedSignal]);
        this.subscription = null;
        this.EventsUpdatedSignal = null;
    }

    public async pollData(polling = true) {
        if (!this.isPollingEnabled) {
            return;
        }
        await this.getWFEvents();
        if (polling) {
            _.delay(() => this.pollData(), OperationDiarySource.updateInterval);
        }
    }

    public async getWFEvents() {
        await ConnectorService.connect();
        const events = await Api.operationDiaryService.getWFEvents(
            SessionService.sessionId, SessionService.getClientId(),
            SessionService.currentLoggedInUser(),
            SessionService.currentLoggedInUserIsDomainUser(),
            this.filter.toDto(),
            10000);

        this.events(events);
    }

}
export = OperationDiarySource;