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
define(["require", "exports", "../viewModelBase", "../../services/connector"], function (require, exports, ViewModelBase, Connector) {
    "use strict";
    var BufferWriteTutorial = /** @class */ (function (_super) {
        __extends(BufferWriteTutorial, _super);
        function BufferWriteTutorial() {
            var _this = _super.call(this) || this;
            _this.connector = new Connector();
            return _this;
        }
        return BufferWriteTutorial;
    }(ViewModelBase));
    return BufferWriteTutorial;
});
//# sourceMappingURL=buffer-write.tutorial.js.map