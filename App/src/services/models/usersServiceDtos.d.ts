interface UserDetailsDTO extends UserDTO {
    AuthorizationGroups: AuthorizationGroupDTO[],
    ProjectAuthorizations: ProjectAuthorizationDTO[],
    SystemAuthorizations: SystemAuthorizationDTO[]
}

interface AuthorizationGroupDTO extends DescriptionDTO {
    CheckAccessGroups: boolean,
    Version: number,
    AccessGroupIDs: string[],
    AlarmGroupIDs: string[],
    AlarmTypeIDs: string[],
    LocationIDs: string[],
    ProjectAuthorizationIDs: string[],
    SystemAuthorizationIDs: string[],
    WriteGroupIDs: string[],
}

interface AuthorizationGroupDetailsDTO extends AuthorizationGroupDTO {
    AccessGroups: AccessGroupDTO[],
    AlarmGroups: AlarmGroupDTO[],
    AlarmTypes: AlarmTypeDTO[],
    Locations: SchedulerLocationDTO[],
    ProjectAuthorizations: ProjectAuthorizationDTO[],
    SystemAuthorizations: SystemAuthorizationDTO[],
    WriteGroups: WriteGroupDTO[],
}

interface ProjectAuthorizationDTO extends DescriptionDTO {
    Version: number
}

interface SystemAuthorizationDTO extends DescriptionDTO {
    Version: number
}

interface UserDTO extends DescriptionDTO {
    Password: string,
    UserLevel: number,
    AllowMultipleLogons: boolean,
    AutoLogOffInterval: number,
    MaxFailedLogOns: number,
    FailedLogOns: number,
    LogActivities: boolean,
    Active: boolean,
    FirstName: string,
    LastName: string,
    RFIDSerialNo: string,
    IDNumber: string,
    Plant: string,
    Company: string,
    MaintenancePassword: string,
    MobileJobsPlanViewDuration: number,
    Version: number,
    PasswordExpires: boolean,
    PasswordCreationDate: DateTime,
    IsAdmin: boolean,
    IsADUser: boolean,
    IsDeleted: boolean,
    AuthorizationGroupIDs: string[],
}


interface AccessAuthorizationDTO extends DescriptionDTO {
    AccessType: boolean,
    ComputerName: string,
    IPFilterClassA: number,
    IPFilterClassB: number,
    IPFilterClassC: number,
    IPFilterClassD: number,
    IPMaskClassA: number,
    IPMaskClassB: number,
    IPMaskClassC: number,
    IPMaskClassD: number,
    Version: number,
}

interface AccessGroupDTO extends DescriptionDTO {
    TimeOn: DateTime,
    TimeOff: DateTime,
    Version: number,
    AccessAuthorizationIDs: string[],
}
interface AccessGroupDetailsDTO extends AccessGroupDTO {
    AccessAuthorizations: AccessAuthorizationDTO[]
}

interface SchedulerLocationDTO extends DescriptionDTO {
    Version: number,
    ServerId: string,
}
interface AccountDTO extends UserDTO {
    ClientHostName: string;
    DomainName: string;
    AuthorizationGroups: string[];
}