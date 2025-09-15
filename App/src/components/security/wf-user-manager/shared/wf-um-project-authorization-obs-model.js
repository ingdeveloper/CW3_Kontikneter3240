define(["require", "exports"], function (require, exports) {
    "use strict";
    var ProjectAuthorizationObs = /** @class */ (function () {
        function ProjectAuthorizationObs() {
            this.ID = ko.observable(null);
            this.Name = ko.observable(null);
            this.Name.extend({ required: '' }); // field is required
            this.Description = ko.observable(null);
            this.Version = ko.observable(0);
        }
        ProjectAuthorizationObs.prototype.initialize = function () {
            this.ID(uuid.v4()); // set new id
            this.Name(null);
            this.Description(null);
            this.Version(0);
        };
        ProjectAuthorizationObs.prototype.toDto = function () {
            var projectAuthorizationDto = {
                ID: this.ID(),
                Name: this.Name(),
                Description: this.Description(),
                Version: this.Version(),
            };
            return projectAuthorizationDto;
        };
        ProjectAuthorizationObs.prototype.fromDto = function (projectAuthorization) {
            this.ID(projectAuthorization.ID);
            this.Name(projectAuthorization.Name);
            this.Description(projectAuthorization.Description);
            this.Version(projectAuthorization.Version);
        };
        return ProjectAuthorizationObs;
    }());
    return ProjectAuthorizationObs;
});
//# sourceMappingURL=wf-um-project-authorization-obs-model.js.map