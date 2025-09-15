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
define(["require", "exports", "./wf-svg-path.component"], function (require, exports, WfSvgPathComponent) {
    "use strict";
    var WfSvgRectangleComponent = /** @class */ (function (_super) {
        __extends(WfSvgRectangleComponent, _super);
        function WfSvgRectangleComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.pathData = ko.unwrap(_this.settings.pathData) || "M25 0A25 25 0 0 1 0 25v15A40 40 0 0 0 40 0H25z";
            _this.height = ko.unwrap(_this.settings.height) !== undefined ? ko.unwrap(_this.settings.height) : 50;
            _this.width = ko.unwrap(_this.settings.width) !== undefined ? ko.unwrap(_this.settings.width) : 100;
            var defaultStates = [
            // { conditionRule: '%Local Second% <= 30', cssClassName: 'running' },
            // { conditionRule: '%Local Second% > 30', cssClassName: 'warning' }
            ];
            _this.settings.states = _.union(_this.settings.states, defaultStates);
            return _this;
        }
        return WfSvgRectangleComponent;
    }(WfSvgPathComponent));
    return WfSvgRectangleComponent;
});
//# sourceMappingURL=wf-svg-rectangle.component.js.map