import HttpApi = require("./httpApi");

class ConfigurationsServiceApi extends HttpApi {

    public getUserDefaultSettingsByToken = (securityToken: string, millisecondsTimeOut: number) => this.post<UserDefaultSettingsDTO>("ConfigurationsService", "GetUserDefaultSettingsByToken", {
        securityToken: securityToken,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public saveUserDefaultSettingsByToken = (securityToken: string, model: UserDefaultSettingsDTO, millisecondsTimeOut: number) => this.post<boolean>("ConfigurationsService", "SaveUserDefaultSettingsByToken", {
        securityToken: securityToken,
        model: model,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public getPasswordPolicySettingsByToken = (securityToken: string, millisecondsTimeOut: number) => this.post<PasswordPolicyDTO>("ConfigurationsService", "GetPasswordPolicySettingsByToken", {
        securityToken: securityToken,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public savePasswordPolicySettingsByToken = (securityToken: string, model: PasswordPolicyDTO, millisecondsTimeOut: number) => this.post<boolean>("ConfigurationsService", "SavePasswordPolicySettingsByToken", {
        securityToken: securityToken,
        model: model,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public getClientMachineSettings = () => this.post<MachineSettingsDTO>("ConfigurationsService", "GetClientMachineSettings", {
    });
}

export = ConfigurationsServiceApi;