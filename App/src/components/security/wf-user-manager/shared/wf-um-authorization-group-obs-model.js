define(["require", "exports"], function (require, exports) {
    "use strict";
    var AuthorizationGroupObs = /** @class */ (function () {
        function AuthorizationGroupObs() {
            this.ID = ko.observable(null);
            this.Name = ko.observable(null);
            this.Name.extend({ required: '' }); // field is required
            this.Description = ko.observable(null);
            this.CheckAccessGroups = ko.observable(false);
            this.Version = ko.observable(0);
            this.AccessGroupIDs = ko.observableArray([]);
            this.AlarmGroupIDs = ko.observableArray([]);
            this.AlarmTypeIDs = ko.observableArray([]);
            this.LocationIDs = ko.observableArray([]);
            this.ProjectAuthorizationIDs = ko.observableArray([]);
            this.SystemAuthorizationIDs = ko.observableArray([]);
            this.WriteGroupIDs = ko.observableArray([]);
        }
        AuthorizationGroupObs.prototype.initialize = function () {
            this.ID(uuid.v4()); // set new id
            this.Name(null);
            this.Description(null);
            this.CheckAccessGroups(false);
            this.Version(0);
            this.AccessGroupIDs([]);
            this.AlarmGroupIDs([]);
            this.AlarmTypeIDs([]);
            this.LocationIDs([]);
            this.ProjectAuthorizationIDs([]);
            this.SystemAuthorizationIDs([]);
            this.WriteGroupIDs([]);
        };
        AuthorizationGroupObs.prototype.toDto = function () {
            var authorizationGroupDto = {
                ID: this.ID(),
                Name: this.Name(),
                Description: this.Description(),
                CheckAccessGroups: this.CheckAccessGroups(),
                Version: this.Version(),
                AccessGroupIDs: this.AccessGroupIDs(),
                AlarmGroupIDs: this.AlarmGroupIDs(),
                AlarmTypeIDs: this.AlarmTypeIDs(),
                LocationIDs: this.LocationIDs(),
                ProjectAuthorizationIDs: this.ProjectAuthorizationIDs(),
                SystemAuthorizationIDs: this.SystemAuthorizationIDs(),
                WriteGroupIDs: this.WriteGroupIDs(),
            };
            return authorizationGroupDto;
        };
        AuthorizationGroupObs.prototype.fromDto = function (authorizationGroup) {
            this.ID(authorizationGroup.ID);
            this.Name(authorizationGroup.Name);
            this.Description(authorizationGroup.Description);
            this.CheckAccessGroups(authorizationGroup.CheckAccessGroups);
            this.Version(authorizationGroup.Version);
            this.AccessGroupIDs(authorizationGroup.AccessGroupIDs);
            this.AlarmGroupIDs(authorizationGroup.AlarmGroupIDs);
            this.AlarmTypeIDs(authorizationGroup.AlarmTypeIDs);
            this.LocationIDs(authorizationGroup.LocationIDs);
            this.ProjectAuthorizationIDs(authorizationGroup.ProjectAuthorizationIDs);
            this.SystemAuthorizationIDs(authorizationGroup.SystemAuthorizationIDs);
            this.WriteGroupIDs(authorizationGroup.WriteGroupIDs);
        };
        return AuthorizationGroupObs;
    }());
    return AuthorizationGroupObs;
});
//# sourceMappingURL=wf-um-authorization-group-obs-model.js.map