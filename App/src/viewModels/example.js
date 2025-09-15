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
define(["require", "exports", "./viewModelBase"], function (require, exports, ViewModelBase) {
    "use strict";
    // Class name has to be unique
    var Example = /** @class */ (function (_super) {
        __extends(Example, _super);
        function Example() {
            return _super.call(this) || this;
        }
        Example.prototype.activate = function (id) {
            //this.idParameter = id;
        };
        return Example;
    }(ViewModelBase));
    return Example;
});
//# sourceMappingURL=example.js.map