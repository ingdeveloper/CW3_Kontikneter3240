import Logger = require("../../../services/logger");
import { ISeries } from "../models/series.model";

export class SeriesSubscriptionItem {

    constructor(public readonly item: ISeries) {

    }

    private _referenceCount = 0;

    public addSubscriber() {
        this._referenceCount++;
        Logger.info(this, `Subscribed to ${this.item.signal.AliasName}/${this.item.tag} Subscription Item [total subscriptions: ${this._referenceCount}]`);
    }

    public releaseSubscriber() {
        this._referenceCount = Math.max(this._referenceCount - 1, 0);
        Logger.info(this, `Unsubscribed from ${this.item.signal.AliasName}/${this.item.tag} Subscription Item [total subscriptions: ${this._referenceCount}]`);
    }

    public hasSubscribers() {
        return this._referenceCount > 0;
    }

}