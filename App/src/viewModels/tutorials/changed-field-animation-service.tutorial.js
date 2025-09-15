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
define(["require", "exports", "../viewModelBase", "../../services/connector", "../../components/services/changed-field-animation.service"], function (require, exports, ViewModelBase, Connector, ChangedFieldAnimationService) {
    "use strict";
    var ChangedFieldAnimationServiceTutorial = /** @class */ (function (_super) {
        __extends(ChangedFieldAnimationServiceTutorial, _super);
        function ChangedFieldAnimationServiceTutorial() {
            return _super.call(this) || this;
        }
        ChangedFieldAnimationServiceTutorial.prototype.activate = function () {
            this.connector = new Connector();
            this.signal = this.connector.getSignal("Setpoint 1");
            this.signalValue = this.signal.value;
            this.displayClassNames = "label-default";
            this.settings = {
                changedCssDuration: 1000,
                signalChangedClass: "label-warning",
                additionalCssForAnimation: ""
            };
            this.changedFieldAnimationService = new ChangedFieldAnimationService(this.settings, this.signalValue, this.displayClassNames);
            this.cssClass = this.changedFieldAnimationService.cssClass;
        };
        ChangedFieldAnimationServiceTutorial.prototype.detached = function () {
            if (!this.signal)
                return;
            this.changedFieldAnimationService.dispose();
            return this.connector.unregisterSignals(this.signal);
        };
        return ChangedFieldAnimationServiceTutorial;
    }(ViewModelBase));
    return ChangedFieldAnimationServiceTutorial;
});
//# sourceMappingURL=changed-field-animation-service.tutorial.js.map