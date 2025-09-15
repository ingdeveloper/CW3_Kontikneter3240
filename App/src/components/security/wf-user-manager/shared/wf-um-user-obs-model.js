var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "../../../../services/configurationsService"], function (require, exports, ConfigurationsService) {
    "use strict";
    var UserObs = /** @class */ (function () {
        function UserObs() {
            this.ID = ko.observable(null);
            this.Name = ko.observable(null);
            this.Name.extend({ required: '' }); // field is required
            this.Password = ko.observable(null);
            this.UserLevel = ko.observable(0);
            this.AllowMultipleLogons = ko.observable(false);
            this.AutoLogOffInterval = ko.observable(0);
            this.MaxFailedLogOns = ko.observable(0);
            this.FailedLogOns = ko.observable(0);
            this.LogActivities = ko.observable(false);
            this.Active = ko.observable(false);
            this.FirstName = ko.observable(null);
            this.LastName = ko.observable(null);
            this.RFIDSerialNo = ko.observable(null);
            this.IDNumber = ko.observable(null);
            this.Plant = ko.observable(null);
            this.Company = ko.observable(null);
            this.MaintenancePassword = ko.observable(null);
            this.MobileJobsPlanViewDuration = ko.observable(0);
            this.Version = ko.observable(0);
            this.PasswordExpires = ko.observable(false);
            this.PasswordCreationDate = ko.observable(null);
            this.IsAdmin = ko.observable(false);
            this.IsADUser = ko.observable(false);
            this.IsDeleted = ko.observable(false);
            this.AuthorizationGroupIDs = ko.observableArray([]);
            this.Description = ko.observable(null);
        }
        UserObs.prototype.initialize = function (userType) {
            return __awaiter(this, void 0, void 0, function () {
                var settingsResponse;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.ID(uuid.v4()); // set new id
                            this.Name(null);
                            this.Password(null);
                            this.UserLevel(0);
                            this.AllowMultipleLogons(false);
                            this.AutoLogOffInterval(0);
                            this.MaxFailedLogOns(0);
                            this.FailedLogOns(0);
                            this.LogActivities(false);
                            this.Active(false);
                            this.FirstName(null);
                            this.LastName(null);
                            this.RFIDSerialNo(null);
                            this.IDNumber(null);
                            this.Plant(null);
                            this.Company(null);
                            this.MaintenancePassword(null);
                            this.MobileJobsPlanViewDuration(0);
                            this.Version(0);
                            this.PasswordExpires(false);
                            this.PasswordCreationDate(null);
                            this.IsAdmin(false);
                            this.IsADUser(false);
                            this.IsDeleted(false);
                            this.AuthorizationGroupIDs([]);
                            this.Description(null);
                            return [4 /*yield*/, ConfigurationsService.getUserDefaultSettings()];
                        case 1:
                            settingsResponse = _a.sent();
                            if (!isNullOrUndefined(settingsResponse)) {
                                this.Description(settingsResponse.Description);
                                this.UserLevel(settingsResponse.UserLevel);
                                this.AllowMultipleLogons(settingsResponse.AllowMultipleLogons);
                                this.AutoLogOffInterval(settingsResponse.AutoLogOffInterval);
                                this.MaxFailedLogOns(settingsResponse.MaxFailedLogons);
                                this.LogActivities(settingsResponse.LogActivities);
                                this.IsAdmin(settingsResponse.IsAdmin);
                                this.Active(settingsResponse.Active);
                            }
                            if (userType === 'domain') {
                                this.IsADUser(true);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        UserObs.prototype.toDto = function () {
            var userDto = {
                ID: this.ID(),
                Name: this.Name(),
                Password: this.Password(),
                UserLevel: this.UserLevel(),
                AllowMultipleLogons: this.AllowMultipleLogons(),
                AutoLogOffInterval: this.AutoLogOffInterval(),
                MaxFailedLogOns: this.MaxFailedLogOns(),
                FailedLogOns: this.FailedLogOns(),
                LogActivities: this.LogActivities(),
                Active: this.Active(),
                FirstName: this.FirstName(),
                LastName: this.LastName(),
                RFIDSerialNo: this.RFIDSerialNo(),
                IDNumber: this.IDNumber(),
                Plant: this.Plant(),
                Company: this.Company(),
                MaintenancePassword: this.MaintenancePassword(),
                MobileJobsPlanViewDuration: this.MobileJobsPlanViewDuration(),
                Version: this.Version(),
                PasswordExpires: this.PasswordExpires(),
                PasswordCreationDate: this.PasswordCreationDate(),
                IsAdmin: this.IsAdmin(),
                IsADUser: this.IsADUser(),
                IsDeleted: this.IsDeleted(),
                AuthorizationGroupIDs: this.AuthorizationGroupIDs(),
                Description: this.Description(),
            };
            return userDto;
        };
        UserObs.prototype.fromDto = function (user) {
            this.ID(user.ID);
            this.Name(user.Name);
            this.Password(user.Password);
            this.UserLevel(user.UserLevel);
            this.AllowMultipleLogons(user.AllowMultipleLogons);
            this.AutoLogOffInterval(user.AutoLogOffInterval);
            this.MaxFailedLogOns(user.MaxFailedLogOns);
            this.FailedLogOns(user.FailedLogOns);
            this.LogActivities(user.LogActivities);
            this.Active(user.Active);
            this.FirstName(user.FirstName);
            this.LastName(user.LastName);
            this.RFIDSerialNo(user.RFIDSerialNo);
            this.IDNumber(user.IDNumber);
            this.Plant(user.Plant);
            this.Company(user.Company);
            this.MaintenancePassword(user.MaintenancePassword);
            this.MobileJobsPlanViewDuration(user.MobileJobsPlanViewDuration);
            this.Version(user.Version);
            this.PasswordExpires(user.PasswordExpires);
            this.PasswordCreationDate(user.PasswordCreationDate);
            ;
            this.IsAdmin(user.IsAdmin);
            this.IsADUser(user.IsADUser);
            this.IsDeleted(user.IsDeleted);
            this.AuthorizationGroupIDs(user.AuthorizationGroupIDs);
            this.Description(user.Description);
        };
        return UserObs;
    }());
    return UserObs;
});
//# sourceMappingURL=wf-um-user-obs-model.js.map