import ComponentBaseModel = require("../component-base.model");
import { IRecipeItem } from "../models/recipe.model";
import RecipeService = require("../services/recipe.service");
import SecuredService = require("../services/secured.service");
import SilverlightToolsService = require("../../services/silverlightToolsService");
import Logger = require("../../services/logger");

interface IWfRecipeParams extends IComponentBaseParams, IWriteSecureParams {
    showOnlyOwnConfigurations: boolean;
    recipeName: string;
    saveButtonVisibility: KnockoutObservable<boolean>;
    writeButtonVisibility: KnockoutObservable<boolean>;
    receipeButtonVisibility: KnockoutObservable<boolean>;
    refreshButtonVisibility: KnockoutObservable<boolean>;

    projectAuthorizationWrite: string;
    projectAuthorizationSave: string;
    projectAuthorizationSelection: string;
}

class WfRecipeComponent extends ComponentBaseModel<IWfRecipeParams> {

    private readonly recipeService = new RecipeService();
    private readonly recipes = ko.observableArray<RecipeManagerDTO>([]);
    public recipesItems: KnockoutComputed<RecipeManagerDTO[]>;
    public isOnlyOwnConfig: KnockoutObservable<boolean>;
    public selectedId: KnockoutObservable<string> = ko.observable(null);
    public isLoading: KnockoutObservable<boolean> = ko.observable(false);

    private recipeName: KnockoutObservable<string>;
    public saveButtonVisibility: KnockoutObservable<boolean>;
    public writeButtonVisibility: KnockoutObservable<boolean>;
    public receipeButtonVisibility: KnockoutObservable<boolean>;
    public refreshButtonVisibility: KnockoutObservable<boolean>;

    protected securedServiceWrite: SecuredService;
    protected securedServiceSave: SecuredService;
    protected securedServiceSelection: SecuredService;

    protected projectAuthorizationWrite: string;
    protected projectAuthorizationSave: string;
    protected projectAuthorizationSelection: string;

    protected hasAuthorizationWrite: KnockoutObservable<boolean>;
    protected hasAuthorizationSave: KnockoutObservable<boolean>;
    protected hasAuthorizationSelection: KnockoutObservable<boolean>;

    //write secure
    private showWriteSecure: KnockoutObservable<boolean>;
    private signalNames: KnockoutObservable<string[]>;
    private writeSecureValues: KnockoutObservable<any[]>;
    private writeSecure: boolean;

    private writableRecipeConfiguration: ControlConfigurationDTO = null;

    constructor(params: IWfRecipeParams) {
        super(params);
        this.initializeComputeds();
        this.initializeWriteSecure();
        this.populateItems();
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.isOnlyOwnConfig = ko.observable(ko.unwrap(this.settings.showOnlyOwnConfigurations) !== undefined ? ko.unwrap(this.settings.showOnlyOwnConfigurations) : false);

        this.recipeName = ko.observable(ko.unwrap(this.settings.recipeName) !== undefined ? ko.unwrap(this.settings.recipeName) : null);
        this.saveButtonVisibility = ko.observable(ko.unwrap(this.settings.saveButtonVisibility) !== undefined ? ko.unwrap(this.settings.saveButtonVisibility) : true);
        this.writeButtonVisibility = ko.observable(ko.unwrap(this.settings.writeButtonVisibility) !== undefined ? ko.unwrap(this.settings.writeButtonVisibility) : true);
        this.receipeButtonVisibility = ko.observable(ko.unwrap(this.settings.receipeButtonVisibility) !== undefined ? ko.unwrap(this.settings.receipeButtonVisibility) : true);
        this.refreshButtonVisibility = ko.observable(ko.unwrap(this.settings.refreshButtonVisibility) !== undefined ? ko.unwrap(this.settings.refreshButtonVisibility) : true);

        this.initializeAdditionalSecurity();
    }

    public async onRefreshAsync() {
        await this.populateItems();
    }

    private initializeWriteSecure() {
        this.writeSecure = ko.unwrap(this.settings.writeSecure) !== undefined ? ko.unwrap(this.settings.writeSecure) : false;
        this.writeSecureValues = ko.observable();
        this.signalNames = ko.observable();
        this.showWriteSecure = ko.observable(false);
    }

    private initializeAdditionalSecurity() {

        this.projectAuthorizationWrite = (ko.unwrap(this.settings.projectAuthorizationWrite) || "").stringPlaceholderResolver(this.objectID);
        this.projectAuthorizationSave = (ko.unwrap(this.settings.projectAuthorizationSave) || "").stringPlaceholderResolver(this.objectID);
        this.projectAuthorizationSelection = (ko.unwrap(this.settings.projectAuthorizationSelection) || "").stringPlaceholderResolver(this.objectID);

        this.securedServiceWrite = new SecuredService(this.projectAuthorizationWrite);
        this.hasAuthorizationWrite = this.securedServiceWrite.hasAuthorization;

        this.securedServiceSave = new SecuredService(this.projectAuthorizationSave);
        this.hasAuthorizationSave = this.securedServiceSave.hasAuthorization;

        this.securedServiceSelection = new SecuredService(this.projectAuthorizationSelection);
        this.hasAuthorizationSelection = this.securedServiceSelection.hasAuthorization;
    }

    private writeInputValueSecure(values: any[], signalNames: string[]) {
        this.writeSecureValues(values);
        this.signalNames(signalNames);
        this.showWriteSecure(true);
    }


    private async populateItems() {
        try {
            this.isLoading(true);
            const items = await this.recipeService.list();
            this.recipes(items);
            this.selectedId(null);
            if (this.recipeName) {
                const item = _.find(this.recipes(), x => x.Name === this.recipeName());
                if (!item) {
                    this.isLoading(false);
                    return;
                }
                this.selectedId(item.ID);
            }

        } catch (error) {
            this.connector.handleError(WfRecipeComponent)(error);
        }
        finally {
            this.isLoading(false);
        }
    }

    private initializeComputeds() {
        this.recipesItems = ko.computed(() => {
            if (this.isOnlyOwnConfig())
                return this.recipes().filter((data) => {
                    return data.Owner === this.connector.currentLoggedInUser();
                });

            return this.recipes();
        });
    }


    private async getRecipeConfigurationAsync() {
        let recipeConfiguration: ControlConfigurationDTO = null;

        const id = this.selectedId();
        if (!id) {
            Logger.warnToast(this.connector.translate("I4SCADA_No_recipe_selected")());
            return;
        }
        recipeConfiguration = await this.recipeService.getById(id);
        if (!recipeConfiguration) {
            Logger.warnToast(this.connector.translate("I4SCADA_Selected_recipe_not_defined")());
            return;
        }

        return recipeConfiguration;
    }


    public async onWriterRcipeAsync() {
        this.isLoading(true);
        this.writableRecipeConfiguration = null;
        let recipeConfiguration = this.writableRecipeConfiguration = await this.getRecipeConfigurationAsync();

        let recipes: IRecipeItem[] = null;
        try {
            recipes = JSON.parse(recipeConfiguration.Content);
        } catch (error) {
            Logger.handleError(WfRecipeComponent)(this.connector.translate("I4SCADA_Could_not_parse_configuration")());
        }

        if (!recipes && recipes.length <= 0) {
            Logger.warnToast(this.connector.translate("I4SCADA_Selected_recipe_not_defined")());
            this.isLoading(false);
            return;
        }

        var values: SignalValue = {};

        for (let item of recipes) {
            values[item.aliasName] = item.value;
        }

        if (this.writeSecure) {
            const signalNames = [];
            const signalsValues = [];

            for (let item of recipes) {
                signalNames.push(item.aliasName);
                signalsValues.push(item.value);
            }
            Logger.infoToast(this.connector.translate("I4SCADA_Writing_recipe_0")().format(recipeConfiguration.Name));
            this.writeInputValueSecure(signalNames, signalsValues);
        }
        else {
            try {
                Logger.infoToast(this.connector.translate("I4SCADA_Writing_recipe_0")().format(recipeConfiguration.Name));
                const result = await this.connector.writeSignals(values);
                if (!result.successful) {
                    this.connector.error("Signal write", result.errorMessage);
                } else {
                    this.onWritesuccessCalback();
                }
            } catch (error) {
                this.connector.handleError(WfRecipeComponent)(error)
            }
        }
        this.isLoading(false);
    }

    private async logUserActivity(id: Guid, name: string) {
        const logResult = await SilverlightToolsService.logUserActivity({
            ActionText: "I4SCADA_RecipeWritten",
            AffectedEntityID: id,
            AffectedEntityName: name,
            AffectedEntityType: 1
        });

        if (logResult != true) {
            this.connector.warn("Signal write", "Could not log user activity");
        }
    }

    public async onSetRcipeAsync() {
        this.isLoading(true);
        let recipeConfiguration = await this.getRecipeConfigurationAsync();

        let recipes: IRecipeItem[] = null;
        try {
            recipes = JSON.parse(recipeConfiguration.Content);
        } catch (error) {
            Logger.handleError(WfRecipeComponent)(this.connector.translate("I4SCADA_Could_not_parse_configuration")());
        }

        if (!recipes && recipes.length <= 0) {
            Logger.warnToast(this.connector.translate("I4SCADA_Selected_recipe_not_defined")());
            this.isLoading(false);
            return;
        }

        const signalNames = recipes.map(item => item.aliasName);
        try {
            const signalValues = await this.connector.readSignals(signalNames);
            const newRecipe: IRecipeItem[] = [];

            for (let i = 0; i < recipes.length; i++) {
                const item = recipes[i];
                const value = signalValues[i];
                newRecipe.push({
                    aliasName: item.aliasName,
                    description: item.description,
                    value: value.Result === 0 ? value.Value : item.value
                })

                if (value.Result !== 0) {
                    Logger.warnToast(this.connector.translate("I4SCADA_Recipe_signal_read_for_0_failed_1}")().format(item.aliasName, value.Result));
                }
            }
            try {
                await this.recipeService.update(recipeConfiguration.ID, recipeConfiguration.Name, JSON.stringify(newRecipe));
                Logger.successToast(this.connector.translate("I4SCADA_Recipe_updated")());
            } catch (error) {
                Logger.handleError(WfRecipeComponent)(this.connector.translate("I4SCADA_Could_not_update_configuration")());
            }
        }
        catch (error) {
            Logger.handleError(WfRecipeComponent)(this.connector.translate(error)());
        }

        this.isLoading(false);
    }

    private onWritesuccessCalback = async () => {
        await this.logUserActivity(this.writableRecipeConfiguration.ID, this.writableRecipeConfiguration.Name);
        Logger.successToast(this.connector.translate("I4SCADA_Recipe_written")());
    }

}

export = WfRecipeComponent;