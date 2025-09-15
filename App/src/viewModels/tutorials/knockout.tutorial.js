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
    var KnockoutToutorial = /** @class */ (function (_super) {
        __extends(KnockoutToutorial, _super);
        function KnockoutToutorial() {
            var _this = _super.call(this) || this;
            _this.myProperty = 123;
            //format can be string, boolean, number
            _this.myObservableProperty = ko.observable(123);
            _this.displayDetailedView = ko.observable(true);
            _this.myComputedProperty = ko.computed(function () {
                var convertedValue = _this.myObservableProperty() / 1000;
                return convertedValue + ' k';
            });
            return _this;
        }
        KnockoutToutorial.prototype.buttonClick = function () {
            this.myObservableProperty(0);
        };
        KnockoutToutorial.prototype.setValue = function (newValue) {
            if (_.isNumber(newValue)) {
                this.myObservableProperty(newValue);
            }
        };
        return KnockoutToutorial;
    }(ViewModelBase));
    return KnockoutToutorial;
});
//# sourceMappingURL=knockout.tutorial.js.map