import HttpApi = require("./httpApi");

class ControlConfigurationsServiceApi extends HttpApi {

    public getControlConfigurationByName = (name: string, configurationNamespace: string, type: number) => this.post<ControlConfigurationDTO>("ConfigurationsService", "GetControlConfigurationByName", {
        name: name,
        configurationNamespace: configurationNamespace,
        type: type
    });

    public getControlConfigurationThatStartWithName = (name: string, configurationNamespace: string, type: number) => this.post<ControlConfigurationDTO[]>("ConfigurationsService", "GetControlConfigurationThatStartWithName", {
        name: name,
        configurationNamespace: configurationNamespace,
        type: type
    });

    public getControlConfigurationsByNamespace = (configurationNamespace: string, type: number) => this.post<ControlConfigurationDTO[]>("ConfigurationsService", "GetControlConfigurationsByNamespace", {
        configurationNamespace: configurationNamespace,
        type: type
    });

    public insertControlConfiguration = (configuration: ControlConfigurationDTO) => this.post<void>("ConfigurationsService", "InsertControlConfiguration", {
        configuration: configuration
    });

    public updateControlConfiguration = (configuration: ControlConfigurationDTO) => this.post<void>("ConfigurationsService", "UpdateControlConfiguration", {
        configuration: configuration
    });

    public deleteControlConfiguration = (id: string) => this.post<void>("ConfigurationsService", "DeleteControlConfiguration", {
        id: id
    });

    public getControlConfigurationById = (id: string) => this.post<ControlConfigurationDTO>("ConfigurationsService", "GetControlConfigurationById", {
        id: id
    });

    public getControlConfigurationNameCount = (name: string, configurationNamespace: string, type: number, excludeId: string) => this.post<number>("ConfigurationsService", "GetControlConfigurationNameCount", {
        name: name,
        configurationNamespace: configurationNamespace,
        type: type,
        excludeId: excludeId
    });

    // Recipe
    public getRecipes = (securityToken: string, millisecondsTimeOut: number) => this.post<RecipeManagerDTO[]>("ConfigurationsService", "GetRecipes", {
        securityToken: securityToken,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public getRecipeById = (id: Guid, securityToken: string, millisecondsTimeOut: number) => this.post<ControlConfigurationDTO>("ConfigurationsService", "GetRecipeById", {
        id: id,
        securityToken: securityToken,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public getRecipeByName = (name: string, securityToken: string, millisecondsTimeOut: number) => this.post<ControlConfigurationDTO>("ConfigurationsService", "GetRecipeByName", {
        name: name,
        securityToken: securityToken,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public deleteRecipe = (id: Guid, securityToken: string, millisecondsTimeOut: number) => this.post<void>("ConfigurationsService", "DeleteRecipe", {
        id: id,
        securityToken: securityToken,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public isRecipeNameValid = (name: string, excludeId: Guid, securityToken: string, millisecondsTimeOut: number) => this.post<boolean>("ConfigurationsService", "IsRecipeNameValid", {
        name: name,
        excludeId: excludeId,
        securityToken: securityToken,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public createRecipe = (name: string, content: string, securityToken: string, millisecondsTimeOut: number) => this.post<ControlConfigurationDTO>("ConfigurationsService", "CreateRecipe", {
        name: name,
        content: content,
        securityToken: securityToken,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public updateRecipe = (id: Guid, name: string, content: string, securityToken: string, millisecondsTimeOut: number) => this.post<ControlConfigurationDTO>("ConfigurationsService", "UpdateRecipe", {
        id: id,
        name: name,
        content: content,
        securityToken: securityToken,
        millisecondsTimeOut: millisecondsTimeOut
    });

    // RecipeDefinition
    public getRecipeDefinitions = (securityToken: string, millisecondsTimeOut: number) => this.post<RecipeManagerDTO[]>("ConfigurationsService", "GetRecipeDefinitions", {
        securityToken: securityToken,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public getRecipeDefinitionById = (id: Guid, securityToken: string, millisecondsTimeOut: number) => this.post<ControlConfigurationDTO>("ConfigurationsService", "GetRecipeDefinitionById", {
        id: id,
        securityToken: securityToken,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public getRecipeDefinitionByName = (name: string, securityToken: string, millisecondsTimeOut: number) => this.post<ControlConfigurationDTO>("ConfigurationsService", "GetRecipeDefinitionByName", {
        name: name,
        securityToken: securityToken,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public deleteRecipeDefinition = (id: Guid, securityToken: string, millisecondsTimeOut: number) => this.post<void>("ConfigurationsService", "DeleteRecipeDefinition", {
        id: id,
        securityToken: securityToken,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public isRecipeDefinitionNameValid = (name: string, excludeId: Guid, securityToken: string, millisecondsTimeOut: number) => this.post<boolean>("ConfigurationsService", "IsRecipeDefinitionNameValid", {
        name: name,
        excludeId: excludeId,
        securityToken: securityToken,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public createRecipeDefinition = (name: string, content: string, securityToken: string, millisecondsTimeOut: number) => this.post<ControlConfigurationDTO>("ConfigurationsService", "CreateRecipeDefinition", {
        name: name,
        content: content,
        securityToken: securityToken,
        millisecondsTimeOut: millisecondsTimeOut
    });

    public updateRecipeDefinition = (id: Guid, name: string, content: string, securityToken: string, millisecondsTimeOut: number) => this.post<ControlConfigurationDTO>("ConfigurationsService", "UpdateRecipeDefinition", {
        id: id,
        name: name,
        content: content,
        securityToken: securityToken,
        millisecondsTimeOut: millisecondsTimeOut
    });


}

export = ControlConfigurationsServiceApi;