define(["require", "exports", "../../../services/logger"], function (require, exports, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SeriesSubscriptionItem = void 0;
    var SeriesSubscriptionItem = /** @class */ (function () {
        function SeriesSubscriptionItem(item) {
            this.item = item;
            this._referenceCount = 0;
        }
        SeriesSubscriptionItem.prototype.addSubscriber = function () {
            this._referenceCount++;
            Logger.info(this, "Subscribed to " + this.item.signal.AliasName + "/" + this.item.tag + " Subscription Item [total subscriptions: " + this._referenceCount + "]");
        };
        SeriesSubscriptionItem.prototype.releaseSubscriber = function () {
            this._referenceCount = Math.max(this._referenceCount - 1, 0);
            Logger.info(this, "Unsubscribed from " + this.item.signal.AliasName + "/" + this.item.tag + " Subscription Item [total subscriptions: " + this._referenceCount + "]");
        };
        SeriesSubscriptionItem.prototype.hasSubscribers = function () {
            return this._referenceCount > 0;
        };
        return SeriesSubscriptionItem;
    }());
    exports.SeriesSubscriptionItem = SeriesSubscriptionItem;
});
//# sourceMappingURL=series-subscription-item.js.map