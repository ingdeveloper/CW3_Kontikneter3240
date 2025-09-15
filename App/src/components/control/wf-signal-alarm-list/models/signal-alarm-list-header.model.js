define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SignalAlarmListHeader = void 0;
    var SignalAlarmListHeader = /** @class */ (function () {
        function SignalAlarmListHeader(orderItems, propertyName, displayName, requestOrder, defaultSortOrder) {
            var _this = this;
            if (orderItems === void 0) { orderItems = []; }
            if (requestOrder === void 0) { requestOrder = function () { }; }
            if (defaultSortOrder === void 0) { defaultSortOrder = null; }
            this.orderItems = orderItems;
            this.propertyName = propertyName;
            this.displayName = displayName;
            this.requestOrder = requestOrder;
            this.sortOrder = ko.observable(null);
            this.sortOrderIcon = ko.pureComputed(function () {
                if (_this.sortOrder() === SortOrder.ASC)
                    return "wf wf-shape-triangle";
                if (_this.sortOrder() === SortOrder.DESC)
                    return "wf wf-shape-triangle wf-w";
                return "";
            });
            this.isSortable = this.orderItems.length > 0;
            if (defaultSortOrder !== null) {
                this.sortOrder(defaultSortOrder);
            }
            this.cssName = "wf-header-" + propertyName;
        }
        SignalAlarmListHeader.prototype.onOrder = function () {
            var newSortOrder = SortOrder.DESC;
            if (this.sortOrder() === SortOrder.ASC) {
                newSortOrder = SortOrder.DESC;
            }
            if (this.sortOrder() === SortOrder.DESC) {
                newSortOrder = SortOrder.ASC;
            }
            this.sortOrder(newSortOrder);
            this.requestOrder(newSortOrder, this);
        };
        SignalAlarmListHeader.prototype.getOrderFragment = function () {
            var _this = this;
            return this.orderItems.map(function (x) { return { Key: x, Value: _this.sortOrder() }; }).filter(function (x) { return x.Value !== null; });
        };
        return SignalAlarmListHeader;
    }());
    exports.SignalAlarmListHeader = SignalAlarmListHeader;
});
//# sourceMappingURL=signal-alarm-list-header.model.js.map