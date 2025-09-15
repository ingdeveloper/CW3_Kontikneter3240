define(["require", "exports"], function (require, exports) {
    "use strict";
    var AccessGroupObs = /** @class */ (function () {
        function AccessGroupObs() {
            this.ID = ko.observable(null);
            this.Name = ko.observable(null);
            this.Name.extend({ required: '' }); // field is required
            this.Description = ko.observable(null);
            this.TimeOn = ko.observable(null);
            this.TimeOff = ko.observable(null);
            this.Version = ko.observable(0);
            this.AccessAuthorizationIDs = ko.observableArray([]);
        }
        AccessGroupObs.prototype.initialize = function () {
            this.ID(uuid.v4()); // set new id
            this.Name(null);
            this.Description(null);
            this.TimeOn(this.dateTimeToday());
            this.TimeOff(this.dateTimeToday());
            this.Version(0);
            this.AccessAuthorizationIDs([]);
        };
        AccessGroupObs.prototype.toDto = function () {
            var projectAuthorizationDto = {
                ID: this.ID(),
                Name: this.Name(),
                Description: this.Description(),
                TimeOn: this.getDateOrTodayMsDate(this.TimeOn()),
                TimeOff: this.getDateOrTodayMsDate(this.TimeOff()),
                Version: this.Version(),
                AccessAuthorizationIDs: this.AccessAuthorizationIDs()
            };
            return projectAuthorizationDto;
        };
        AccessGroupObs.prototype.fromDto = function (accessGroup) {
            this.ID(accessGroup.ID);
            this.Name(accessGroup.Name);
            this.Description(accessGroup.Description);
            this.TimeOn(moment(accessGroup.TimeOn).toDate());
            this.TimeOff(moment(accessGroup.TimeOff).toDate());
            this.Version(accessGroup.Version);
            this.AccessAuthorizationIDs(accessGroup.AccessAuthorizationIDs);
        };
        AccessGroupObs.prototype.dateTimeToday = function () {
            var today = new Date();
            today.setHours(0); // or today.toUTCString(0) due to timezone differences
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);
            return today;
        };
        AccessGroupObs.prototype.getDateOrTodayMsDate = function (date) {
            var returnDate = date;
            if (!date) {
                returnDate = this.dateTimeToday();
            }
            return moment(returnDate).toMSDate();
        };
        return AccessGroupObs;
    }());
    return AccessGroupObs;
});
//# sourceMappingURL=wf-um-access-group-obs-model.js.map