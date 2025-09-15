
export interface IRecipeDefinitionItem {
    description: string;
    aliasName: string;
}

export interface IRecipeItem extends IRecipeDefinitionItem {
    value: any;
}


export interface IRecipeDefinition extends IRecipeBase<IRecipeItem> {

}

export interface IRecipe extends IRecipeBase<IRecipeDefinitionItem> {

}

export interface IRecipeBase<T extends IRecipeDefinitionItem> {
    name: string;
    signals: T[];
}

export class RecipeNamespaces {
    public static readonly RecipeDefinition = "RecipeDefinition";
    public static readonly Recipe = "Recipe";
}