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
define(["require", "exports", "../viewModelBase", "../../components/services/states.service"], function (require, exports, ViewModelBase, StatesService) {
    "use strict";
    var StatesServiceTutorial = /** @class */ (function (_super) {
        __extends(StatesServiceTutorial, _super);
        function StatesServiceTutorial() {
            return _super.call(this) || this;
        }
        StatesServiceTutorial.prototype.activate = function () {
            this.settings = {
                states: [
                    { conditionRule: "%Setpoint 1% == 1" },
                    { conditionRule: "%Setpoint 1% == 2" }
                ]
            };
            this.states = new StatesService(this.settings);
        };
        StatesServiceTutorial.prototype.detached = function () {
            this.states.unregisterSignals();
        };
        return StatesServiceTutorial;
    }(ViewModelBase));
    return StatesServiceTutorial;
});
//# sourceMappingURL=states-service.tutorial.js.map