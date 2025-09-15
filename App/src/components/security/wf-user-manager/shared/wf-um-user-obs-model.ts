import ConfigurationsService = require("../../../../services/configurationsService");
declare var uuid;

class UserObs {
    ID: KnockoutObservable<string>;
    Name: KnockoutObservable<string>;
    Password: KnockoutObservable<string>;
    UserLevel: KnockoutObservable<number>;
    AllowMultipleLogons: KnockoutObservable<boolean>;
    AutoLogOffInterval: KnockoutObservable<number>;
    MaxFailedLogOns: KnockoutObservable<number>;
    FailedLogOns: KnockoutObservable<number>;
    LogActivities: KnockoutObservable<boolean>;
    Active: KnockoutObservable<boolean>;
    FirstName: KnockoutObservable<string>;
    LastName: KnockoutObservable<string>;
    RFIDSerialNo: KnockoutObservable<string>;
    IDNumber: KnockoutObservable<string>;
    Plant: KnockoutObservable<string>;
    Company: KnockoutObservable<string>;
    MaintenancePassword: KnockoutObservable<string>;
    MobileJobsPlanViewDuration: KnockoutObservable<number>;
    Version: KnockoutObservable<number>;
    PasswordExpires: KnockoutObservable<boolean>; boolean;
    PasswordCreationDate: KnockoutObservable<DateTime>;
    IsAdmin: KnockoutObservable<boolean>;
    IsADUser: KnockoutObservable<boolean>;
    IsDeleted: KnockoutObservable<boolean>;
    AuthorizationGroupIDs: KnockoutObservableArray<string>;
    Description: KnockoutObservable<string>;

    constructor() {
        this.ID = ko.observable(null);
        this.Name = ko.observable(null);
        this.Name.extend({ required: '' }) // field is required
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

    async initialize(userType) {
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
        // set default values
        const settingsResponse = await ConfigurationsService.getUserDefaultSettings();
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

        if(userType === 'domain') {
            this.IsADUser(true);
        }
    }

    toDto() {
        let userDto: UserDTO = {
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
        }

        return userDto;
    }

    fromDto(user: UserDTO) {
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
        this.PasswordCreationDate(user.PasswordCreationDate);;
        this.IsAdmin(user.IsAdmin);
        this.IsADUser(user.IsADUser);
        this.IsDeleted(user.IsDeleted);
        this.AuthorizationGroupIDs(user.AuthorizationGroupIDs);
        this.Description(user.Description);
    }
}

export = UserObs;