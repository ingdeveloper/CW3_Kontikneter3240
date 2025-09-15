import AlarmsService = require("../../../../services/alarmsService");
import Connector = require("../../../../services/connector");
import Signal = require("../../../../services/models/signal");
import SignalsService = require("../../../../services/signalsService");
import { IBackgroundForegroundColors, SignalWithAlarmInfo } from "../models/signal-with-alarm-info.model";
import Logger = require("../../../../services/logger");
import BusyIndicator = require("../../../../decorators/busyIndicator");
import { SignalAlarmListHeader } from "../models/signal-alarm-list-header.model";
import { SignalAlarmListFiledNames } from "../models/signal-alarm-list-fields.model";
import { SignalAlarmColumnNameService } from "./signal-alarm-column-name.service";

export class SignalAlarmListService {

    public readonly busyContext: BusyIndicator;
    private readonly connector = new Connector();
    public readonly items = ko.observableArray<SignalWithAlarmInfo>([]);
    public readonly signalAlarmListHeaders = ko.observableArray<SignalAlarmListHeader>([]);

    public static readonly AlarmStateUpdates = "WFSInternal_AlarmStateUpdates";
    public static readonly AlarmUpdates = "WFSInternal_AlarmUpdates";
    private alarmStateUpdatesSignal: Signal;
    private alarmUpdatesSignal: Signal;
    private readonly subscriptions: KnockoutSubscription[] = [];

    public pattern: string;
    public unit: string;
    public maxSignalCount = ko.observable(50);
    public hasMoreSignals = ko.observable(false);
    public aliasNames = ko.observableArray<string>([]);

    public colors: IBackgroundForegroundColors;

    private updatePromise: Promise<void[]> = null;

    private readonly update = ko.observable(false).extend({ notify: 'always', rateLimit: { timeout: 500, method: "notifyWhenChangesStop" } });

    constructor(
        private readonly signalAlarmColumnNameService: SignalAlarmColumnNameService
    ) {
        this.busyContext = new BusyIndicator(this);
        this.alarmStateUpdatesSignal = this.connector.getSignal(SignalAlarmListService.AlarmStateUpdates);
        this.alarmUpdatesSignal = this.connector.getSignal(SignalAlarmListService.AlarmUpdates);
        this.subscriptions.push(this.alarmStateUpdatesSignal.value.subscribe(() => this.update(true)));
        this.subscriptions.push(this.alarmUpdatesSignal.value.subscribe(() => this.update(true)));
        this.subscriptions.push(this.update.subscribe(this.updateAsync));

        this.subscriptions.push(this.connector.currentLanguageId.subscribe(() => {
            this.getDataAsync();
        }));
        this.subscriptions.push(this.connector.currentLoggedInUser.subscribe(() => {
            this.getDataAsync();
        }));
    }

    public dispose() {
        for (const subscription of this.subscriptions) {
            subscription.dispose();
        }

        this.connector.unregisterSignals(this.alarmStateUpdatesSignal, this.alarmUpdatesSignal);
    }

    public async onSignalsSelected(aliasNames: string[]) {
        this.pattern = null;
        this.unit = null;
        this.aliasNames(aliasNames);
        this.getDataAsync();
    }

    public async onSettingsApplied(columnsOrder: string[], maxSignalPageCount: number) {
        this.maxSignalCount(maxSignalPageCount);
        this.setSignalInformationColumns(columnsOrder);
        await this.getDataAsync();
    }

    public async getDataAsync() {
        await this.busyContext.runLongAction("Getting Signals", async () => {
            const pattern = this.pattern ? `*${this.pattern}*` : null;
            const unit = this.unit || null;
            try {
                var items = await SignalsService.getSignalsWithAlarmInfo({
                    Pattern: pattern,
                    Unit: unit,
                    AliasNames: this.aliasNames(),
                    Order: this.getOrderFragments()
                }, 0, Math.max(Math.min(this.maxSignalCount(), 2147483647), 1));

                const discreteValueSignals: SignalDefinitionDTO[] = <SignalDefinitionDTO[]>(await this.connector.getSignalDefinitions(items.Data.filter(x => x.DiscreteValueTypeID != null).map(x => x.AliasName)));

                const signals: SignalWithAlarmInfo[] = [];
                for (const signal of items.Data) {
                    const discreteValueSignal = discreteValueSignals.find(x => x.ID === signal.SignalId);
                    let discreteValues: DiscreteValueDTO[] = null;
                    if (discreteValueSignal) {
                        discreteValues = discreteValueSignal.DiscreteValues
                    }
                    const item = this.createSignalWithAlarmInfoItem(signal, discreteValues, this.colors);
                    signals.push(item);
                }
                this.items(signals);
                this.hasMoreSignals(items.Count > items.Data.length);
            } catch (error) {
                this.connector.handleError(SignalAlarmListService)(error);
            }
        });
    }

    private activateOrDeactivateAlarmStateAsync = async (ids: System.Guid[], state: AlarmProcessingAndDisplayState) => {
        try {
            const result = await AlarmsService.setAlarmStates(ids as string[], ids.map(_ => state), ids.map(x => moment(new Date(9999, 1, 1, 23, 59, 59)).toMSDate()));
            if (result === false) {
                Logger.warnToast(this.connector.translate("I4SCADA_Change_alarm_state_failed")());
            }
            if (result === true) {
                Logger.successToast(this.connector.translate("I4SCADA_Change_alarm_state_successful")());
            }
        } catch (error) {
            this.connector.error(SignalAlarmListService, error);
        }
    }

    public updateAsync = async () => {
        try {
            if (this.updatePromise) {
                Logger.warn(this, "Unable to update update is running.");
                return;
            }

            if (this.items()) {
                const signalsWithAlarms = this.items().filter(x => x.alarmInfos != null && x.alarmInfos.length > 0);
                if (!signalsWithAlarms.length) return;

                const promises: Promise<void>[] = [];
                let chunk = 500;
                for (let i = 0, j = signalsWithAlarms.length; i < j; i += chunk) {
                    let temporary = signalsWithAlarms.slice(i, i + chunk);
                    promises.push(this.getSignals(temporary));;
                }
                this.updatePromise = Promise.all(promises);
                await this.updatePromise;
            }
        } catch (error) {
            Logger.error(this, "Unable to update signals ", error);
        } finally {
            this.updatePromise = null;
        }
    }

    private async getSignals(signalsWithAlarms: SignalWithAlarmInfo[]) {
        try {
            var items = await SignalsService.getSignalsWithAlarmInfo({
                AliasNames: signalsWithAlarms.map(x => x.aliasName)
            }, 0, signalsWithAlarms.length);

            for (const item of items.Data) {
                const signal = this.items().find(x => x.signalId === item.SignalId);
                if (signal) {
                    signal.updateCounts(item);
                }
            }
        } catch (error) {
            Logger.error(this, "Unable to get signal update", error);
        }
    }

    /*
     * header functionality
     */
    public setSignalInformationColumns(columns: string[]) {
        this.signalAlarmListHeaders([])
        for (const item of columns) {
            this.signalAlarmListHeaders.push(this.createSignalAlarmListHeaderItem(item));
        }
    }

    private createSignalAlarmListHeaderItem(name: string) {
        return new SignalAlarmListHeader(
            this.getOrderItems(name),
            this.getPropertyName(name),
            this.getDisplayName(name),
            this.order,
            this.getDefaultSortOrder(name),
        );
    }

    private getDefaultSortOrder(name: string) {
        if (name === SignalAlarmListFiledNames.AliasName)
            return SortOrder.ASC;
        return null;
    }

    private getOrderItems(name: string) {
        if (name === SignalAlarmListFiledNames.AlarmStatus)
            return [SignalAlarmListFiledNames.OnCount, SignalAlarmListFiledNames.AcknowledgedCount, SignalAlarmListFiledNames.OffCount, SignalAlarmListFiledNames.InactiveCount]
        if (name === SignalAlarmListFiledNames.AlarmProcessingAndDisplayStatus)
            return [SignalAlarmListFiledNames.ProcessedButNotVisibleCount, SignalAlarmListFiledNames.NotProcessedAndNotVisibleCount, SignalAlarmListFiledNames.ProcessedAndVisibleCount, SignalAlarmListFiledNames.NotProcessedButVisibleCount]
        return [name]
    }

    private getPropertyName(name: string) {
        return name
    }

    private getDisplayName(name: string) {
        return this.signalAlarmColumnNameService.getSymbolicText(name);
    }

    private order = (order: SortOrder, sortItem: SignalAlarmListHeader) => {
        for (const iterator of this.signalAlarmListHeaders()) {
            iterator.sortOrder(null);
        }
        sortItem.sortOrder(order);
        if (sortItem.propertyName != "Value") {
            this.getDataAsync();
        }
        else {
            this.items.sort((a, b) => {
                let x = a.value();
                let y = b.value();

                if ($.isNumeric(x))
                    x = numeral(x).value();

                if ($.isNumeric(y))
                    y = numeral(y).value();

                return sortItem.sortOrder() === SortOrder.ASC ? ((x < y) ? -1 : ((x > y) ? 1 : 0)) : ((x > y) ? -1 : ((x < y) ? 1 : 0));
            });
        }
    }

    private getOrderFragments() {
        const orderItems: { Key: string, Value: SortOrder }[] = [];
        for (const iterator of this.signalAlarmListHeaders()) {
            orderItems.push(...iterator.getOrderFragment());
        }

        if (!orderItems.find(x => x.Key === SignalAlarmListFiledNames.AliasName) && orderItems.length === 0) {
            orderItems.push({
                Key: SignalAlarmListFiledNames.AliasName,
                Value: SortOrder.ASC
            });
        }

        return orderItems;
    }

    private createSignalWithAlarmInfoItem(item: SignalWithAlarmInfoDTO, discreteValues: DiscreteValueDTO[], colors: IBackgroundForegroundColors) {
        const signal = this.connector.getSignal(item.AliasName, false);
        return new SignalWithAlarmInfo(item, discreteValues, colors, this.activateOrDeactivateAlarmStateAsync).updateValue(signal.value);
    }
}