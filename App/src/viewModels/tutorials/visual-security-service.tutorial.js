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
define(["require", "exports", "../viewModelBase", "../../components/services/visual-security.service", "../../services/connector"], function (require, exports, ViewModelBase, VisualSecurityService, Connector) {
    "use strict";
    var VisualSecurityServiceTutorial = /** @class */ (function (_super) {
        __extends(VisualSecurityServiceTutorial, _super);
        function VisualSecurityServiceTutorial() {
            return _super.call(this) || this;
        }
        VisualSecurityServiceTutorial.prototype.activate = function () {
            this.connector = new Connector();
            //enableOperator und visibilityOperator
            // value == signalValue
            // value != signalValue
            // value <  signalValue
            // value >  signalValue
            // value <= signalValue
            // value >= signalValue
            this.settings = {
                visibilitySignalName: "Setpoint 1",
                visibilitySignalValue: 1,
                visibilityOperator: "!=",
                enableSignalName: "Setpoint 2",
                enableSignalValue: 1,
                enableOperator: "!=",
            };
            this.visualSecurityService = new VisualSecurityService(this.settings);
            this.isVisible = this.visualSecurityService.isVisible;
            this.isDisabled = this.visualSecurityService.isDisabled;
        };
        VisualSecurityServiceTutorial.prototype.detached = function () {
            if (this.visualSecurityService)
                this.visualSecurityService.dispose();
        };
        return VisualSecurityServiceTutorial;
    }(ViewModelBase));
    return VisualSecurityServiceTutorial;
});
//# sourceMappingURL=visual-security-service.tutorial.js.map