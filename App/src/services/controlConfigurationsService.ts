import SessionService = require("./sessionService");
import Logger = require("./logger");
import Api = require("./api");

class ControlConfigurationsService {

    public static timeOut = 10000;

    public static getControlConfigurationByName(name: string, configurationNamespace: string, type: number) {
        Logger.info(ControlConfigurationsService, `getControlConfigurationByName`);
        return Api.controlConfigurationsService.getControlConfigurationByName(name, configurationNamespace, type);
    }

    public static getControlConfigurationThatStartWithName(name: string, configurationNamespace: string, type: number) {
        Logger.info(ControlConfigurationsService, `getControlConfigurationThatStartWithName`);
        return Api.controlConfigurationsService.getControlConfigurationThatStartWithName(name, configurationNamespace, type);
    }

    public static getControlConfigurationsByNamespace(configurationNamespace: string, type: number) {
        Logger.info(ControlConfigurationsService, `getControlConfigurationsByNamespace`);
        return Api.controlConfigurationsService.getControlConfigurationsByNamespace(configurationNamespace, type);
    }

    public static insertControlConfiguration(controlConfiguration: ControlConfigurationDTO) {
        Logger.info(ControlConfigurationsService, `insertControlConfiguration`);
        return Api.controlConfigurationsService.insertControlConfiguration(controlConfiguration);
    }

    public static updateControlConfiguration(controlConfiguration: ControlConfigurationDTO) {
        Logger.info(ControlConfigurationsService, `updateControlConfiguration`);
        return Api.controlConfigurationsService.updateControlConfiguration(controlConfiguration);
    }

    public static deleteControlConfiguration(id: string) {
        Logger.info(ControlConfigurationsService, `deleteControlConfiguration`);
        return Api.controlConfigurationsService.deleteControlConfiguration(id);
    }

    public static getControlConfigurationById(id: string) {
        Logger.info(ControlConfigurationsService, `getControlConfigurationById`);
        return Api.controlConfigurationsService.getControlConfigurationById(id);
    }

    public static getControlConfigurationNameCount(name: string, configurationNamespace: string, type: number, excludeId: string) {
        Logger.info(ControlConfigurationsService, `getControlConfigurationNameCount`);
        return Api.controlConfigurationsService.getControlConfigurationNameCount(name, configurationNamespace, type, excludeId);
    }


    // Recipe
    public static getRecipes() {
        Logger.info(ControlConfigurationsService, `getRecipes`);
        return Api.controlConfigurationsService.getRecipes(SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
    }

    public static getRecipeById(id: Guid) {
        Logger.info(ControlConfigurationsService, `getRecipeById`);
        return Api.controlConfigurationsService.getRecipeById(id, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
    }

    public static getRecipeByName(name: string) {
        Logger.info(ControlConfigurationsService, `getRecipeByName`);
        return Api.controlConfigurationsService.getRecipeByName(name, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
    }

    public static deleteRecipe(id: Guid) {
        Logger.info(ControlConfigurationsService, `deleteRecipe`);
        return Api.controlConfigurationsService.deleteRecipe(id, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
    }

    public static isRecipeNameValid(name: string, excludeId: Guid) {
        Logger.info(ControlConfigurationsService, `isRecipeNameValid`);
        return Api.controlConfigurationsService.isRecipeNameValid(name, excludeId, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
    }

    public static createRecipe(name: string, content: string) {
        Logger.info(ControlConfigurationsService, `createRecipe`);
        return Api.controlConfigurationsService.createRecipe(name, content, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
    }

    public static updateRecipe(id: Guid, name: string, content: string) {
        Logger.info(ControlConfigurationsService, `updateRecipe`);
        return Api.controlConfigurationsService.updateRecipe(id, name, content, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
    }

    // RecipeDefinition
    public static getRecipeDefinitions() {
        Logger.info(ControlConfigurationsService, `getRecipeDefinitions`);
        return Api.controlConfigurationsService.getRecipeDefinitions(SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
    }

    public static getRecipeDefinitionById(id: Guid) {
        Logger.info(ControlConfigurationsService, `getRecipeDefinitionById`);
        return Api.controlConfigurationsService.getRecipeDefinitionById(id, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
    }

    public static getRecipeDefinitionByName(name: string) {
        Logger.info(ControlConfigurationsService, `getRecipeDefinitionByName`);
        return Api.controlConfigurationsService.getRecipeDefinitionByName(name, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
    }

    public static deleteRecipeDefinition(id: Guid) {
        Logger.info(ControlConfigurationsService, `deleteRecipeDefinition`);
        return Api.controlConfigurationsService.deleteRecipeDefinition(id, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
    }

    public static isRecipeDefinitionNameValid(name: string, excludeId: Guid) {
        Logger.info(ControlConfigurationsService, `isRecipeDefinitionNameValid`);
        return Api.controlConfigurationsService.isRecipeDefinitionNameValid(name, excludeId, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
    }

    public static createRecipeDefinition(name: string, content: string) {
        Logger.info(ControlConfigurationsService, `createRecipeDefinition`);
        return Api.controlConfigurationsService.createRecipeDefinition(name, content, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
    }

    public static updateRecipeDefinition(id: Guid, name: string, content: string) {
        Logger.info(ControlConfigurationsService, `updateRecipeDefinition`);
        return Api.controlConfigurationsService.updateRecipeDefinition(id, name, content, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
    }
}

export = ControlConfigurationsService;