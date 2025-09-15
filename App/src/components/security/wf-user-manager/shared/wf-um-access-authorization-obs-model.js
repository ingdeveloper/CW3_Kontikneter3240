define(["require", "exports"], function (require, exports) {
    "use strict";
    var AccessAuthorizationObs = /** @class */ (function () {
        function AccessAuthorizationObs() {
            this.ID = ko.observable(null);
            this.Name = ko.observable(null);
            this.Name.extend({ required: '' }); // field is required
            this.Description = ko.observable(null);
            this.AccessType = ko.observable(false);
            this.ComputerName = ko.observable(null);
            this.ComputerName.extend({ required: '' }); // field is required
            this.IPFilterClassA = ko.observable(0);
            this.IPFilterClassB = ko.observable(0);
            this.IPFilterClassC = ko.observable(0);
            this.IPFilterClassD = ko.observable(0);
            this.IPMaskClassA = ko.observable(0);
            this.IPMaskClassB = ko.observable(0);
            this.IPMaskClassC = ko.observable(0);
            this.IPMaskClassD = ko.observable(0);
            this.Version = ko.observable(0);
        }
        AccessAuthorizationObs.prototype.initialize = function () {
            this.ID(uuid.v4()); // set new id
            this.Name(null);
            this.Description(null);
            this.AccessType(false);
            this.ComputerName(null);
            this.IPFilterClassA(0);
            this.IPFilterClassB(0);
            this.IPFilterClassC(0);
            this.IPFilterClassD(0);
            this.IPMaskClassA(0);
            this.IPMaskClassB(0);
            this.IPMaskClassC(0);
            this.IPMaskClassD(0);
            this.Version(0);
        };
        AccessAuthorizationObs.prototype.toDto = function () {
            var accessAuthorizationDto = {
                ID: this.ID(),
                Name: this.Name(),
                Description: this.Description(),
                AccessType: this.AccessType(),
                ComputerName: this.ComputerName(),
                IPFilterClassA: this.IPFilterClassA(),
                IPFilterClassB: this.IPFilterClassB(),
                IPFilterClassC: this.IPFilterClassC(),
                IPFilterClassD: this.IPFilterClassD(),
                IPMaskClassA: this.IPMaskClassA(),
                IPMaskClassB: this.IPMaskClassB(),
                IPMaskClassC: this.IPMaskClassC(),
                IPMaskClassD: this.IPMaskClassD(),
                Version: this.Version(),
            };
            return accessAuthorizationDto;
        };
        AccessAuthorizationObs.prototype.fromDto = function (accessAuthorization) {
            this.ID(accessAuthorization.ID);
            this.Name(accessAuthorization.Name);
            this.Description(accessAuthorization.Description);
            this.AccessType(accessAuthorization.AccessType);
            this.ComputerName(accessAuthorization.ComputerName);
            this.IPFilterClassA(accessAuthorization.IPFilterClassA);
            this.IPFilterClassB(accessAuthorization.IPFilterClassB);
            this.IPFilterClassC(accessAuthorization.IPFilterClassC);
            this.IPFilterClassD(accessAuthorization.IPFilterClassD);
            this.IPMaskClassA(accessAuthorization.IPMaskClassA);
            this.IPMaskClassB(accessAuthorization.IPMaskClassB);
            this.IPMaskClassC(accessAuthorization.IPMaskClassC);
            this.IPMaskClassD(accessAuthorization.IPMaskClassD);
            this.Version(accessAuthorization.Version);
        };
        return AccessAuthorizationObs;
    }());
    return AccessAuthorizationObs;
});
//# sourceMappingURL=wf-um-access-authorization-obs-model.js.map