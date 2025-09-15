var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./httpApi"], function (require, exports, HttpApi) {
    "use strict";
    var ControlConfigurationsServiceApi = /** @class */ (function (_super) {
        __extends(ControlConfigurationsServiceApi, _super);
        function ControlConfigurationsServiceApi() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.getControlConfigurationByName = function (name, configurationNamespace, type) { return _this.post("ConfigurationsService", "GetControlConfigurationByName", {
                name: name,
                configurationNamespace: configurationNamespace,
                type: type
            }); };
            _this.getControlConfigurationThatStartWithName = function (name, configurationNamespace, type) { return _this.post("ConfigurationsService", "GetControlConfigurationThatStartWithName", {
                name: name,
                configurationNamespace: configurationNamespace,
                type: type
            }); };
            _this.getControlConfigurationsByNamespace = function (configurationNamespace, type) { return _this.post("ConfigurationsService", "GetControlConfigurationsByNamespace", {
                configurationNamespace: configurationNamespace,
                type: type
            }); };
            _this.insertControlConfiguration = function (configuration) { return _this.post("ConfigurationsService", "InsertControlConfiguration", {
                configuration: configuration
            }); };
            _this.updateControlConfiguration = function (configuration) { return _this.post("ConfigurationsService", "UpdateControlConfiguration", {
                configuration: configuration
            }); };
            _this.deleteControlConfiguration = function (id) { return _this.post("ConfigurationsService", "DeleteControlConfiguration", {
                id: id
            }); };
            _this.getControlConfigurationById = function (id) { return _this.post("ConfigurationsService", "GetControlConfigurationById", {
                id: id
            }); };
            _this.getControlConfigurationNameCount = function (name, configurationNamespace, type, excludeId) { return _this.post("ConfigurationsService", "GetControlConfigurationNameCount", {
                name: name,
                configurationNamespace: configurationNamespace,
                type: type,
                excludeId: excludeId
            }); };
            // Recipe
            _this.getRecipes = function (securityToken, millisecondsTimeOut) { return _this.post("ConfigurationsService", "GetRecipes", {
                securityToken: securityToken,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.getRecipeById = function (id, securityToken, millisecondsTimeOut) { return _this.post("ConfigurationsService", "GetRecipeById", {
                id: id,
                securityToken: securityToken,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.getRecipeByName = function (name, securityToken, millisecondsTimeOut) { return _this.post("ConfigurationsService", "GetRecipeByName", {
                name: name,
                securityToken: securityToken,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.deleteRecipe = function (id, securityToken, millisecondsTimeOut) { return _this.post("ConfigurationsService", "DeleteRecipe", {
                id: id,
                securityToken: securityToken,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.isRecipeNameValid = function (name, excludeId, securityToken, millisecondsTimeOut) { return _this.post("ConfigurationsService", "IsRecipeNameValid", {
                name: name,
                excludeId: excludeId,
                securityToken: securityToken,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.createRecipe = function (name, content, securityToken, millisecondsTimeOut) { return _this.post("ConfigurationsService", "CreateRecipe", {
                name: name,
                content: content,
                securityToken: securityToken,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.updateRecipe = function (id, name, content, securityToken, millisecondsTimeOut) { return _this.post("ConfigurationsService", "UpdateRecipe", {
                id: id,
                name: name,
                content: content,
                securityToken: securityToken,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            // RecipeDefinition
            _this.getRecipeDefinitions = function (securityToken, millisecondsTimeOut) { return _this.post("ConfigurationsService", "GetRecipeDefinitions", {
                securityToken: securityToken,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.getRecipeDefinitionById = function (id, securityToken, millisecondsTimeOut) { return _this.post("ConfigurationsService", "GetRecipeDefinitionById", {
                id: id,
                securityToken: securityToken,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.getRecipeDefinitionByName = function (name, securityToken, millisecondsTimeOut) { return _this.post("ConfigurationsService", "GetRecipeDefinitionByName", {
                name: name,
                securityToken: securityToken,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.deleteRecipeDefinition = function (id, securityToken, millisecondsTimeOut) { return _this.post("ConfigurationsService", "DeleteRecipeDefinition", {
                id: id,
                securityToken: securityToken,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.isRecipeDefinitionNameValid = function (name, excludeId, securityToken, millisecondsTimeOut) { return _this.post("ConfigurationsService", "IsRecipeDefinitionNameValid", {
                name: name,
                excludeId: excludeId,
                securityToken: securityToken,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.createRecipeDefinition = function (name, content, securityToken, millisecondsTimeOut) { return _this.post("ConfigurationsService", "CreateRecipeDefinition", {
                name: name,
                content: content,
                securityToken: securityToken,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            _this.updateRecipeDefinition = function (id, name, content, securityToken, millisecondsTimeOut) { return _this.post("ConfigurationsService", "UpdateRecipeDefinition", {
                id: id,
                name: name,
                content: content,
                securityToken: securityToken,
                millisecondsTimeOut: millisecondsTimeOut
            }); };
            return _this;
        }
        return ControlConfigurationsServiceApi;
    }(HttpApi));
    return ControlConfigurationsServiceApi;
});
//# sourceMappingURL=controlConfigurationsServiceApi.js.map