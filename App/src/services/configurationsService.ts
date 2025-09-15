import SessionService = require("./sessionService");
import Logger = require("./logger");
import Api = require("./api");
import ConnectorService = require("./connectorService");

class ConfigurationsService {
    public static timeOut = 10000;

    public static async getPasswordPolicySettings() {
        Logger.info(ConfigurationsService, `getPasswordPolicySettings`);
        await ConnectorService.connect();
        return Api.configurationsService.getPasswordPolicySettingsByToken(SessionService.getSecurityToken(), ConfigurationsService.timeOut);
    }

    public static async savePasswordPolicySettings(model: PasswordPolicyDTO) {
        Logger.info(ConfigurationsService, `savePasswordPolicySettings`);
        await ConnectorService.connect();
        return Api.configurationsService.savePasswordPolicySettingsByToken(SessionService.getSecurityToken(), model, ConfigurationsService.timeOut);
    }

    public static async getUserDefaultSettings() {
        Logger.info(ConfigurationsService, `getUserDefaultSettings`);
        await ConnectorService.connect();
        return Api.configurationsService.getUserDefaultSettingsByToken(SessionService.getSecurityToken(), ConfigurationsService.timeOut);
    }

    public static async saveUserDefaultSettings(model: UserDefaultSettingsDTO) {
        Logger.info(ConfigurationsService, `saveUserDefaultSettings`);
        await ConnectorService.connect();
        return Api.configurationsService.saveUserDefaultSettingsByToken(SessionService.getSecurityToken(), model, ConfigurationsService.timeOut);
    }

    public static async getClientMachineSettings() {
        Logger.info(ConfigurationsService, `getClientMachineSettings`);
        return Api.configurationsService.getClientMachineSettings();
    }

}

export = ConfigurationsService;