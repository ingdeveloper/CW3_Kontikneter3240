import ControlConfigurationsService = require("../../services/controlConfigurationsService");

class RecipeService {

    public async validateName(name: string, id: Guid = null) {
        return await ControlConfigurationsService.isRecipeNameValid(name, id);
    }

    public async getByName(name: string) {
        return await ControlConfigurationsService.getRecipeByName(name);
    }

    public async getById(id: Guid) {
        return await ControlConfigurationsService.getRecipeById(id);
    }

    public async list() {
        return await ControlConfigurationsService.getRecipes();
    }

    public async create(name: string, configuration: string) {
        return await ControlConfigurationsService.createRecipe(name, configuration);
    }

    public async update(id: string, name: string, configuration: string) {
        return await ControlConfigurationsService.updateRecipe(id, name, configuration);
    }

    public async delete(id: string) {
        return await ControlConfigurationsService.deleteRecipe(id);
    }

}

export = RecipeService;