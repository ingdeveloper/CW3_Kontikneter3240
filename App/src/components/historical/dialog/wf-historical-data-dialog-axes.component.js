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
define(["require", "exports", "../models/series-configuration.model", "../models/axis-item.model", "./wf-historical-data-dialog-base.model"], function (require, exports, series_configuration_model_1, axis_item_model_1, wf_historical_data_dialog_base_model_1) {
    "use strict";
    var WfHistoricalDataDialogAxesComponent = /** @class */ (function (_super) {
        __extends(WfHistoricalDataDialogAxesComponent, _super);
        function WfHistoricalDataDialogAxesComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.valuePositions = ko.observableArray([
                { id: series_configuration_model_1.ValuePosition.Outside, text: _this.connector.translate("I4SCADA_Outside") },
                { id: series_configuration_model_1.ValuePosition.Inside, text: _this.connector.translate("I4SCADA_Inside") }
            ]);
            return _this;
        }
        WfHistoricalDataDialogAxesComponent.prototype.createItem = function (item, isPersisted) {
            if (item === void 0) { item = {}; }
            if (isPersisted === void 0) { isPersisted = false; }
            return new axis_item_model_1.AxesItem(this.provider, this.items, item, isPersisted);
        };
        WfHistoricalDataDialogAxesComponent.prototype.getConfiguration = function (item) {
            return item.configuration;
        };
        WfHistoricalDataDialogAxesComponent.prototype.getProviderItems = function () {
            return this.provider.axes();
        };
        WfHistoricalDataDialogAxesComponent.prototype.updateProviderConfiguration = function (items) {
            this.provider.updateAxesConfiguration(items);
        };
        WfHistoricalDataDialogAxesComponent.prototype.loadProviderAdditionalData = function () {
        };
        return WfHistoricalDataDialogAxesComponent;
    }(wf_historical_data_dialog_base_model_1.WfHistoricalDataBaseModel));
    return WfHistoricalDataDialogAxesComponent;
});
//# sourceMappingURL=wf-historical-data-dialog-axes.component.js.map