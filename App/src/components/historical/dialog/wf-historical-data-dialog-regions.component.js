var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./wf-historical-data-dialog-base.model", "../models/region-item.model"], function (require, exports, wf_historical_data_dialog_base_model_1, region_item_model_1) {
    "use strict";
    var WfHistoricalDataDialogRegionsComponent = /** @class */ (function (_super) {
        __extends(WfHistoricalDataDialogRegionsComponent, _super);
        function WfHistoricalDataDialogRegionsComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.axes = ko.observableArray([]);
            return _this;
        }
        WfHistoricalDataDialogRegionsComponent.prototype.createItem = function (item, isPersisted) {
            if (item === void 0) { item = {}; }
            if (isPersisted === void 0) { isPersisted = false; }
            return new region_item_model_1.RegionItem(this.provider, this.items, item, isPersisted);
        };
        WfHistoricalDataDialogRegionsComponent.prototype.getConfiguration = function (item) {
            return item.configuration;
        };
        WfHistoricalDataDialogRegionsComponent.prototype.getProviderItems = function () {
            return this.provider.regions();
        };
        WfHistoricalDataDialogRegionsComponent.prototype.updateProviderConfiguration = function (items) {
            this.provider.updateRegionConfiguration(items);
        };
        WfHistoricalDataDialogRegionsComponent.prototype.loadProviderAdditionalData = function () {
            this.axes(this.provider.axes());
        };
        return WfHistoricalDataDialogRegionsComponent;
    }(wf_historical_data_dialog_base_model_1.WfHistoricalDataBaseModel));
    return WfHistoricalDataDialogRegionsComponent;
});
//# sourceMappingURL=wf-historical-data-dialog-regions.component.js.map