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
define(["require", "exports", "../viewModelBase"], function (require, exports, ViewModelBase) {
    "use strict";
    var DynamicPropertiesTutorial = /** @class */ (function (_super) {
        __extends(DynamicPropertiesTutorial, _super);
        function DynamicPropertiesTutorial() {
            var _this = _super.call(this) || this;
            _this.components = [{
                    name: "wf-input",
                    params: ko.observable("signalName:'Setpoint 1', signalNameLabel:true")
                },
                {
                    name: "wf-value",
                    params: ko.observable("signalName:'Setpoint 2', signalNameLabel:true")
                },
                {
                    name: "wf-arc",
                    params: ko.observable("signalName:'Setpoint 3'")
                },
                {
                    name: "wf-chart-1",
                    params: ko.observable("lines :[{ signalName: 'Level 1', logTagName: 'LogTagLevel1', color: '#337AB7'},{ signalName: 'Level 2', logTagName: 'LogTagLevel2', color: '#f0ad4e', axis: 'y2'}],autoUpdate: false,'y1AxisColor': '#337AB7', y2AxisColor: '#f0ad4e'")
                },
                {
                    name: "wf-signal-list",
                    params: ko.observable("signals: [ { signalName: 'Level 1', signalLabel: 'Temperature', staticUnitText: '°C' }, { signalName: 'Level 3', signalLabel: 'Signal Label' }]")
                }
            ];
            _this.component = ko.observable({
                name: "wf-input",
                params: ko.observable("signalName:'Setpoint 1', signalNameLabel:true")
            });
            _this.paramObject = ko.pureComputed({
                read: function () {
                    try {
                        return {
                            name: _this.component().name,
                            params: eval("({" + _this.component().params() + "})")
                        };
                    }
                    catch (error) {
                    }
                }
            });
            return _this;
        }
        return DynamicPropertiesTutorial;
    }(ViewModelBase));
    return DynamicPropertiesTutorial;
});
//# sourceMappingURL=dynamic-properties.tutorial.js.map