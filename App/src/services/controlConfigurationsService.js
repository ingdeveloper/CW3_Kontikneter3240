define(["require", "exports", "./sessionService", "./logger", "./api"], function (require, exports, SessionService, Logger, Api) {
    "use strict";
    var ControlConfigurationsService = /** @class */ (function () {
        function ControlConfigurationsService() {
        }
        ControlConfigurationsService.getControlConfigurationByName = function (name, configurationNamespace, type) {
            Logger.info(ControlConfigurationsService, "getControlConfigurationByName");
            return Api.controlConfigurationsService.getControlConfigurationByName(name, configurationNamespace, type);
        };
        ControlConfigurationsService.getControlConfigurationThatStartWithName = function (name, configurationNamespace, type) {
            Logger.info(ControlConfigurationsService, "getControlConfigurationThatStartWithName");
            return Api.controlConfigurationsService.getControlConfigurationThatStartWithName(name, configurationNamespace, type);
        };
        ControlConfigurationsService.getControlConfigurationsByNamespace = function (configurationNamespace, type) {
            Logger.info(ControlConfigurationsService, "getControlConfigurationsByNamespace");
            return Api.controlConfigurationsService.getControlConfigurationsByNamespace(configurationNamespace, type);
        };
        ControlConfigurationsService.insertControlConfiguration = function (controlConfiguration) {
            Logger.info(ControlConfigurationsService, "insertControlConfiguration");
            return Api.controlConfigurationsService.insertControlConfiguration(controlConfiguration);
        };
        ControlConfigurationsService.updateControlConfiguration = function (controlConfiguration) {
            Logger.info(ControlConfigurationsService, "updateControlConfiguration");
            return Api.controlConfigurationsService.updateControlConfiguration(controlConfiguration);
        };
        ControlConfigurationsService.deleteControlConfiguration = function (id) {
            Logger.info(ControlConfigurationsService, "deleteControlConfiguration");
            return Api.controlConfigurationsService.deleteControlConfiguration(id);
        };
        ControlConfigurationsService.getControlConfigurationById = function (id) {
            Logger.info(ControlConfigurationsService, "getControlConfigurationById");
            return Api.controlConfigurationsService.getControlConfigurationById(id);
        };
        ControlConfigurationsService.getControlConfigurationNameCount = function (name, configurationNamespace, type, excludeId) {
            Logger.info(ControlConfigurationsService, "getControlConfigurationNameCount");
            return Api.controlConfigurationsService.getControlConfigurationNameCount(name, configurationNamespace, type, excludeId);
        };
        // Recipe
        ControlConfigurationsService.getRecipes = function () {
            Logger.info(ControlConfigurationsService, "getRecipes");
            return Api.controlConfigurationsService.getRecipes(SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
        };
        ControlConfigurationsService.getRecipeById = function (id) {
            Logger.info(ControlConfigurationsService, "getRecipeById");
            return Api.controlConfigurationsService.getRecipeById(id, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
        };
        ControlConfigurationsService.getRecipeByName = function (name) {
            Logger.info(ControlConfigurationsService, "getRecipeByName");
            return Api.controlConfigurationsService.getRecipeByName(name, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
        };
        ControlConfigurationsService.deleteRecipe = function (id) {
            Logger.info(ControlConfigurationsService, "deleteRecipe");
            return Api.controlConfigurationsService.deleteRecipe(id, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
        };
        ControlConfigurationsService.isRecipeNameValid = function (name, excludeId) {
            Logger.info(ControlConfigurationsService, "isRecipeNameValid");
            return Api.controlConfigurationsService.isRecipeNameValid(name, excludeId, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
        };
        ControlConfigurationsService.createRecipe = function (name, content) {
            Logger.info(ControlConfigurationsService, "createRecipe");
            return Api.controlConfigurationsService.createRecipe(name, content, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
        };
        ControlConfigurationsService.updateRecipe = function (id, name, content) {
            Logger.info(ControlConfigurationsService, "updateRecipe");
            return Api.controlConfigurationsService.updateRecipe(id, name, content, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
        };
        // RecipeDefinition
        ControlConfigurationsService.getRecipeDefinitions = function () {
            Logger.info(ControlConfigurationsService, "getRecipeDefinitions");
            return Api.controlConfigurationsService.getRecipeDefinitions(SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
        };
        ControlConfigurationsService.getRecipeDefinitionById = function (id) {
            Logger.info(ControlConfigurationsService, "getRecipeDefinitionById");
            return Api.controlConfigurationsService.getRecipeDefinitionById(id, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
        };
        ControlConfigurationsService.getRecipeDefinitionByName = function (name) {
            Logger.info(ControlConfigurationsService, "getRecipeDefinitionByName");
            return Api.controlConfigurationsService.getRecipeDefinitionByName(name, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
        };
        ControlConfigurationsService.deleteRecipeDefinition = function (id) {
            Logger.info(ControlConfigurationsService, "deleteRecipeDefinition");
            return Api.controlConfigurationsService.deleteRecipeDefinition(id, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
        };
        ControlConfigurationsService.isRecipeDefinitionNameValid = function (name, excludeId) {
            Logger.info(ControlConfigurationsService, "isRecipeDefinitionNameValid");
            return Api.controlConfigurationsService.isRecipeDefinitionNameValid(name, excludeId, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
        };
        ControlConfigurationsService.createRecipeDefinition = function (name, content) {
            Logger.info(ControlConfigurationsService, "createRecipeDefinition");
            return Api.controlConfigurationsService.createRecipeDefinition(name, content, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
        };
        ControlConfigurationsService.updateRecipeDefinition = function (id, name, content) {
            Logger.info(ControlConfigurationsService, "updateRecipeDefinition");
            return Api.controlConfigurationsService.updateRecipeDefinition(id, name, content, SessionService.getSecurityToken(), ControlConfigurationsService.timeOut);
        };
        ControlConfigurationsService.timeOut = 10000;
        return ControlConfigurationsService;
    }());
    return ControlConfigurationsService;
});
//# sourceMappingURL=controlConfigurationsService.js.map