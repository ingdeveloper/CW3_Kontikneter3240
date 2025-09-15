define(["require", "exports", "../../services/connector"], function (require, exports, Connector) {
    "use strict";
    var SecuredService = /** @class */ (function () {
        function SecuredService(projectAuthorization, systemAuthorization) {
            var _this = this;
            this.hasAuthorization = ko.pureComputed(function () {
                if (_this.projectAuthorization === "" && _this.systemAuthorization === "")
                    return true;
                if (!_this.connector.currentUserProjectAuthorizations())
                    return false;
                var userProjectAuthorizationArray = _.map(_this.connector.currentUserProjectAuthorizations(), function (item) { return item.Name; });
                var userSystemAuthorizationArray = _.map(_this.connector.currentUserSystemAuthorizations(), function (item) { return item.Name; });
                var projectAuthorizationArray = _.map(_this.projectAuthorization.split(","), function (item) { return item.trim(); });
                var systemAuthorizationArray = _.map(_this.systemAuthorization.split(","), function (item) { return item.trim(); });
                var hasRequestedProjectAuthorizations = _.intersection(userProjectAuthorizationArray, projectAuthorizationArray).length > 0;
                var hasRequestedSystemAuthorizations = _.intersection(userSystemAuthorizationArray, systemAuthorizationArray).length > 0;
                return hasRequestedProjectAuthorizations || hasRequestedSystemAuthorizations;
            });
            this.hasNoAuthorization = ko.pureComputed(function () {
                return !_this.hasAuthorization();
            });
            this.connector = new Connector();
            this.projectAuthorization = (ko.unwrap(projectAuthorization) || "").trim();
            this.systemAuthorization = (ko.unwrap(systemAuthorization) || "").trim();
        }
        return SecuredService;
    }());
    return SecuredService;
});
//# sourceMappingURL=secured.service.js.map