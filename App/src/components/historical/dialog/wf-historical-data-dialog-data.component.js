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
define(["require", "exports", "../models/series-configuration.model", "../models/series-item.model", "./wf-historical-data-dialog-base.model"], function (require, exports, series_configuration_model_1, series_item_model_1, wf_historical_data_dialog_base_model_1) {
    "use strict";
    var WfHistoricalDataDialogDataComponent = /** @class */ (function (_super) {
        __extends(WfHistoricalDataDialogDataComponent, _super);
        function WfHistoricalDataDialogDataComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.axes = ko.observableArray([]);
            _this.displays = ko.observableArray([
                { id: series_configuration_model_1.SeriesDisplayType.Name, text: _this.connector.translate("I4SCADA_Name") },
                { id: series_configuration_model_1.SeriesDisplayType.Alias, text: _this.connector.translate("I4SCADA_Alias") },
                { id: series_configuration_model_1.SeriesDisplayType.Description, text: _this.connector.translate("I4SCADA_Description") },
            ]);
            _this.chartTypes = ko.observableArray([
                { id: series_configuration_model_1.ChartType.Line, text: _this.connector.translate("I4SCADA_Line") },
                { id: series_configuration_model_1.ChartType.StackedLine, text: _this.connector.translate("I4SCADA_StackedLine") },
                { id: series_configuration_model_1.ChartType.Step, text: _this.connector.translate("I4SCADA_Step") },
                { id: series_configuration_model_1.ChartType.Bar, text: _this.connector.translate("I4SCADA_Bar") },
                { id: series_configuration_model_1.ChartType.StackedBar, text: _this.connector.translate("I4SCADA_StackedBar") },
                { id: series_configuration_model_1.ChartType.Dots, text: _this.connector.translate("I4SCADA_Dots") },
                { id: series_configuration_model_1.ChartType.LineDots, text: _this.connector.translate("I4SCADA_LineDots") },
            ]);
            _this.interpolations = ko.observableArray([
                { id: series_configuration_model_1.InterpolationTypes.None, text: _this.connector.translate("I4SCADA_None") },
                { id: series_configuration_model_1.InterpolationTypes.Linear, text: _this.connector.translate("I4SCADA_Linear") },
                { id: series_configuration_model_1.InterpolationTypes.CubicSpline, text: _this.connector.translate("I4SCADA_Cubic_spline") },
                { id: series_configuration_model_1.InterpolationTypes.Differential, text: _this.connector.translate("I4SCADA_Differential") },
            ]);
            return _this;
        }
        WfHistoricalDataDialogDataComponent.prototype.createItem = function (item, isPersisted) {
            if (item === void 0) { item = {}; }
            if (isPersisted === void 0) { isPersisted = false; }
            return new series_item_model_1.SeriesItem(this.provider, this.items, item, isPersisted);
        };
        WfHistoricalDataDialogDataComponent.prototype.getConfiguration = function (item) {
            return item.configuration;
        };
        WfHistoricalDataDialogDataComponent.prototype.getProviderItems = function () {
            return this.provider.series();
        };
        WfHistoricalDataDialogDataComponent.prototype.updateProviderConfiguration = function (items) {
            this.provider.updateSeriesConfigurationAsync(items);
        };
        WfHistoricalDataDialogDataComponent.prototype.loadProviderAdditionalData = function () {
            this.axes(this.provider.axes());
        };
        return WfHistoricalDataDialogDataComponent;
    }(wf_historical_data_dialog_base_model_1.WfHistoricalDataBaseModel));
    return WfHistoricalDataDialogDataComponent;
});
//# sourceMappingURL=wf-historical-data-dialog-data.component.js.map