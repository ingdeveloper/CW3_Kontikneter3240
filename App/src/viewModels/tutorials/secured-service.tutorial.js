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
define(["require", "exports", "../viewModelBase", "../../components/services/secured.service"], function (require, exports, ViewModelBase, SecuredService) {
    "use strict";
    var SecuredServiceTutorial = /** @class */ (function (_super) {
        __extends(SecuredServiceTutorial, _super);
        function SecuredServiceTutorial() {
            return _super.call(this) || this;
        }
        SecuredServiceTutorial.prototype.activate = function () {
            this.projectAuthorization = "Administration";
            this.securedService = new SecuredService(this.projectAuthorization);
            this.hasAuthorization = this.securedService.hasAuthorization;
        };
        return SecuredServiceTutorial;
    }(ViewModelBase));
    return SecuredServiceTutorial;
});
//# sourceMappingURL=secured-service.tutorial.js.map