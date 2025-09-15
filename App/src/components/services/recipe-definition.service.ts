import ControlConfigurationsService = require("../../services/controlConfigurationsService");

class RecipeDefinitionService {

    public async validateName(name: string, id: Guid = null) {
        return await ControlConfigurationsService.isRecipeDefinitionNameValid(name, id);
    }

    public async getByName(name: string) {
        return await ControlConfigurationsService.getRecipeDefinitionByName(name);
    }

    public async getById(id: Guid) {
        return await ControlConfigurationsService.getRecipeDefinitionById(id);
    }

    public async list() {
        return await ControlConfigurationsService.getRecipeDefinitions();
    }

    public async create(name: string, configuration: string) {
        return await ControlConfigurationsService.createRecipeDefinition(name, configuration);
    }

    public async update(id: string, name: string, configuration: string) {
        return await ControlConfigurationsService.updateRecipeDefinition(id, name, configuration);
    }

    public async delete(id: string) {
        return await ControlConfigurationsService.deleteRecipeDefinition(id);
    }

}

export = RecipeDefinitionService;