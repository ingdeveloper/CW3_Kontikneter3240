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
define(["require", "exports", "../../component-base.model", "../models/toolbox-params.model"], function (require, exports, ComponentBaseModel, toolbox_params_model_1) {
    "use strict";
    var WfHistoricalDataDialogToolboxComponent = /** @class */ (function (_super) {
        __extends(WfHistoricalDataDialogToolboxComponent, _super);
        function WfHistoricalDataDialogToolboxComponent(params) {
            return _super.call(this, params) || this;
        }
        WfHistoricalDataDialogToolboxComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.groupName = this.settings.groupName || "default";
            this.controlName = this.settings.controlName || "default-controlName";
            this.showLabels = this.settings.showLabels || false;
            this.css = this.settings.css || "btn btn-default";
            this.buildButtonsArray();
        };
        WfHistoricalDataDialogToolboxComponent.prototype.buildButtonsArray = function () {
            var _this = this;
            var buttons = (this.settings.buttons || []).map(function (item) {
                return _this.buildButtonsParams(item);
            });
            this.buttons = ko.observableArray(buttons);
        };
        WfHistoricalDataDialogToolboxComponent.prototype.buildButtonsParams = function (button) {
            button.name = this.getButtonComponentName(button.button);
            button.groupName = this.groupName;
            button.controlName = this.controlName;
            button.showLabel = this.showLabels;
            button.css = this.css;
            return button;
        };
        WfHistoricalDataDialogToolboxComponent.prototype.getButtonComponentName = function (buttonName) {
            switch (buttonName) {
                case toolbox_params_model_1.DialogToolboxButtons.Axes:
                    return "wf-historical-data-dialog-axes";
                case toolbox_params_model_1.DialogToolboxButtons.Data:
                    return "wf-historical-data-dialog-data";
                case toolbox_params_model_1.DialogToolboxButtons.Regions:
                    return "wf-historical-data-dialog-regions";
                case toolbox_params_model_1.DialogToolboxButtons.Devider:
                    return "devider";
            }
        };
        return WfHistoricalDataDialogToolboxComponent;
    }(ComponentBaseModel));
    return WfHistoricalDataDialogToolboxComponent;
});
//# sourceMappingURL=wf-historical-data-dialog-toolbox.component.js.map