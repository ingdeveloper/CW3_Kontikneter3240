import ComponentBaseModel = require("../component-base.model");
import { IRecipeDefinitionItem, IRecipeItem, RecipeNamespaces } from "../models/recipe.model";
import RecipeService = require("../services/recipe.service");
import RecipeDefinitionService = require("../services/recipe-definition.service");
import RecipeJSONService = require("../services/recipe-json.service");
import SignalsService = require("../../services/signalsService");
import Logger = require("../../services/logger");

interface IWfRecipeManagementParams extends IComponentBaseParams {
    height: number;

    titleText: string;
    buttonBarCssClass: string;
    panelBarCssClass: string;
    showOnlyOwnConfigurations: boolean;
    format: string;
    operationButtonCssClass: string;

    recipeType: string;
    recipeDefinitionName: string;
    recipeName: string;

    //Visibility
    headerVisibility: boolean;
    settingsButtonVisibility: boolean;
    typeSelectionButtonVisibility: boolean;

    exportButtonVisibility: boolean;
    importButtonVisibility: boolean;

    headderAddButtonVisibility: boolean;
    headderConcatenateButtonVisibility: boolean;
    headderLoadCurrenValuesButtonVisibility: boolean;

    contentDeleteButtonVisibility: boolean;
    contentLoadCurrenValueDeleteButtonVisibility: boolean;

    searchVisibility: boolean;

    //signal browser
    maxSignalCount: number;
    maxSignalsForGroupAdd: number;
}

interface ISelectedItem<T> {
    selected: KnockoutObservable<boolean>,
    item: T;
}

class WfRecipeManagementComponent extends ComponentBaseModel<IWfRecipeManagementParams> {

    private showOnlyOwnConfigurations: boolean;
    public height: KnockoutObservable<number>;
    public panelBodyHeight: KnockoutComputed<number>;
    public headerVisibility: KnockoutObservable<boolean>;
    public settingsButtonVisibility: KnockoutObservable<boolean>;

    public headderAddButtonVisibility: KnockoutObservable<boolean>;
    public headderConcatenateButtonVisibility: KnockoutObservable<boolean>;
    public headderLoadCurrenValuesButtonVisibility: KnockoutObservable<boolean>;

    public contentDeleteButtonVisibility: KnockoutObservable<boolean>;
    public contentLoadCurrenValueDeleteButtonVisibility: KnockoutObservable<boolean>;

    public searchVisibility: KnockoutObservable<boolean>;

    public isOnlyOwnConfig: KnockoutObservable<boolean>;
    private operationButtonCssClass: string;

    public format: string;

    public titleText: KnockoutObservable<string>;
    public panelBarCssClass: string;
    public buttonBarCssClass: string;

    public configurations: KnockoutObservableArray<ControlConfigurationDTO>;
    public configurationItems: KnockoutComputed<ControlConfigurationDTO[]>;
    public cloneRecipeDefinitionItems: KnockoutComputed<RecipeManagerDTO[]>;
    public concatenateRecipeDefinitionItems: KnockoutComputed<RecipeManagerDTO[]>;

    public isSaveEnabled: KnockoutComputed<boolean>;

    //Recipe Definition
    public recipeDefinitionId = ko.observable<string>();
    public recipeDefinitionName: KnockoutObservable<string>;
    public recipeDefinitionsContent = [];
    public recipeDefinitions = ko.observableArray<IRecipeDefinitionItem>([]);

    //Recipe
    public recipeId = ko.observable<string>();
    public recipeName: KnockoutObservable<string>;
    public recipesContent = [];
    public recipes = ko.observableArray<IRecipeItem>([]);

    public newName: KnockoutObservable<string>;
    private nameValidationSubscription: KnockoutSubscription;
    private isNameValid = ko.observable(false);

    public cloneRecipeDefinitions = ko.observableArray<RecipeManagerDTO>([]);
    public selectedCloneRecipeDefinitionId = ko.observable<string>();

    public concatenateRecipeDefinitions = ko.observableArray<RecipeManagerDTO>([]);
    public selectedConcatenateRecipeDefinitionId = ko.observable<string>();

    public recipeType: KnockoutObservable<string>;
    public typeSelectionButtonVisibility: KnockoutObservable<boolean>;

    public exportButtonVisibility: KnockoutObservable<boolean>;
    public importButtonVisibility: KnockoutObservable<boolean>;

    public overwriteConfigurationOnImport = ko.observable(true);

    // search
    public recipeItems: KnockoutComputed<IRecipeItem[]>;
    public recipeDefinitionItems: KnockoutComputed<IRecipeDefinitionItem[]>;
    public recipePattern = ko.observable<string>("")
        .extend({ throttle: 250 });
    public recipeDefinitionPattern = ko.observable<string>("")
        .extend({ throttle: 250 });

    // dialogs
    private showAddEdit: KnockoutObservable<boolean>;
    private isAddMode: KnockoutObservable<boolean>;
    private showDelete: KnockoutObservable<boolean>;
    private addEditNameTitle: KnockoutComputed<string>;
    private deleteTitle: KnockoutComputed<string>;
    private deleteContent: KnockoutComputed<string>;
    private isExportButtonEnable: KnockoutComputed<boolean>;
    private showLoad: KnockoutObservable<boolean>;
    private loadTitle: KnockoutComputed<string>;
    private showSignalBrowser: KnockoutObservable<boolean>;
    private showImport: KnockoutObservable<boolean>;
    private showConcatenateRecipeDefinitions: KnockoutObservable<boolean>;

    // fileinput
    public selectedFiles = ko.observableArray<string>([]);

    //copyButton
    public isCopyButtonEnabled = ko.pureComputed(() => {
        return this.selectedCloneRecipeDefinitionId() != null;
    })

    // services
    private readonly recipeService = new RecipeService();
    private readonly recipeDefinitionService = new RecipeDefinitionService();
    private readonly recipeJSONService = new RecipeJSONService();

    //SignalBrowser
    private items: KnockoutObservableArray<string>;
    private hasData: KnockoutComputed<boolean>;
    public maxSignalCount: number;
    public maxSignalsForGroupAdd: number;
    private readonly groupItems = ko.observableArray<NameDTO>([]);
    private readonly selectedGroupId = ko.observable<string>(null);
    public readonly signalItems = ko.observableArray<ISelectedItem<NameDTO>>([]);
    public readonly pattern = ko.observable("");
    public readonly delayedPattern = ko.computed(this.pattern).extend({ throttle: 500 });
    public readonly hasMoreSignals = ko.observable(false);
    public readonly isLoading = ko.observable(false);

    private readonly emtyGuid = "00000000-0000-0000-0000-000000000000";

    constructor(params: IWfRecipeManagementParams) {
        super(params);
        this.initializeComputeds();
        this.populateItems();
        this.onRefresh();
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.recipeDefinitionName = ko.observable(this.settings.recipeDefinitionName || null);
        this.recipeName = ko.observable(this.settings.recipeName || null);

        this.showOnlyOwnConfigurations = this.settings.showOnlyOwnConfigurations !== undefined ? this.settings.showOnlyOwnConfigurations : false;
        this.headerVisibility = ko.observable(ko.unwrap(this.settings.headerVisibility) !== undefined ? ko.unwrap(this.settings.headerVisibility) : true);
        this.settingsButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsButtonVisibility) : true);

        this.headderAddButtonVisibility = ko.observable(ko.unwrap(this.settings.headderAddButtonVisibility) !== undefined ? ko.unwrap(this.settings.headderAddButtonVisibility) : true);
        this.headderConcatenateButtonVisibility = ko.observable(ko.unwrap(this.settings.headderConcatenateButtonVisibility) !== undefined ? ko.unwrap(this.settings.headderConcatenateButtonVisibility) : true);
        this.headderLoadCurrenValuesButtonVisibility = ko.observable(ko.unwrap(this.settings.headderLoadCurrenValuesButtonVisibility) !== undefined ? ko.unwrap(this.settings.headderLoadCurrenValuesButtonVisibility) : true);

        this.contentDeleteButtonVisibility = ko.observable(ko.unwrap(this.settings.contentDeleteButtonVisibility) !== undefined ? ko.unwrap(this.settings.contentDeleteButtonVisibility) : true);
        this.contentLoadCurrenValueDeleteButtonVisibility = ko.observable(ko.unwrap(this.settings.contentLoadCurrenValueDeleteButtonVisibility) !== undefined ? ko.unwrap(this.settings.contentLoadCurrenValueDeleteButtonVisibility) : true);

        this.searchVisibility = ko.observable(ko.unwrap(this.settings.searchVisibility) !== undefined ? ko.unwrap(this.settings.searchVisibility) : true);

        this.height = ko.observable(ko.unwrap(this.settings.height) || null);
        this.isOnlyOwnConfig = ko.observable(this.showOnlyOwnConfigurations);
        this.operationButtonCssClass = ko.unwrap(this.settings.operationButtonCssClass) || "btn btn-primary";

        this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[000]";

        this.titleText = ko.observable(ko.unwrap(this.settings.titleText) || "WEBfactory Recipe Management Component");
        this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
        this.panelBarCssClass = ko.unwrap(this.settings.panelBarCssClass) || "panel panel-default";
        this.panelBarCssClass = ko.unwrap(this.settings.panelBarCssClass) || "panel panel-default";

        this.recipeType = ko.observable(ko.unwrap(this.settings.recipeType) || RecipeNamespaces.RecipeDefinition);
        this.typeSelectionButtonVisibility = ko.observable(ko.unwrap(this.settings.typeSelectionButtonVisibility) !== undefined ? ko.unwrap(this.settings.typeSelectionButtonVisibility) : true);

        this.exportButtonVisibility = ko.observable(ko.unwrap(this.settings.exportButtonVisibility) !== undefined ? ko.unwrap(this.settings.exportButtonVisibility) : true);
        this.importButtonVisibility = ko.observable(ko.unwrap(this.settings.importButtonVisibility) !== undefined ? ko.unwrap(this.settings.importButtonVisibility) : true);

        // dialogs
        this.showAddEdit = ko.observable(false);
        this.showLoad = ko.observable(false);
        this.showDelete = ko.observable(false);
        this.isAddMode = ko.observable(true);
        this.showSignalBrowser = ko.observable(false);
        this.showImport = ko.observable(false);
        this.showConcatenateRecipeDefinitions = ko.observable(false);
        this.configurations = ko.observableArray([]);

        //signal browser
        this.items = ko.observableArray<string>();
        this.maxSignalCount = ko.unwrap(this.settings.maxSignalCount) !== undefined ? ko.unwrap(this.settings.maxSignalCount) : 50;
        this.maxSignalsForGroupAdd = ko.unwrap(this.settings.maxSignalsForGroupAdd) !== undefined ? ko.unwrap(this.settings.maxSignalsForGroupAdd) : 500;
    }

    private initializeComputeds() {

        this.panelBodyHeight = ko.pureComputed(() => {
            if (!this.height()) {
                return null;
            }
            if (this.headerVisibility()) {
                return this.height() - 104;
            }
            return this.height() - 62;
        });

        this.addEditNameTitle = ko.computed(() => {
            if (this.recipeType() === RecipeNamespaces.RecipeDefinition) {
                return this.isAddMode() ? this.connector.translate('I4SCADA_Add_recipe_definition')() : this.connector.translate('I4SCADA_Edit_recipe_definition_name')();
            } else {
                return this.isAddMode() ? this.connector.translate('I4SCADA_Add_recipe')() : this.connector.translate('I4SCADA_Edit_recipe_name')();
            }
        });

        this.deleteTitle = ko.computed(() => {
            if (this.recipeType() === RecipeNamespaces.RecipeDefinition) {
                return this.connector.translate('I4SCADA_Delete_recipe_definition')();
            } else {
                return this.connector.translate('I4SCADA_Delete_recipe')();
            }
        });

        this.loadTitle = ko.computed(() => {
            if (this.recipeType() === RecipeNamespaces.RecipeDefinition) {
                return this.connector.translate('I4SCADA_Load_recipe_definition')();
            } else {
                return this.connector.translate('I4SCADA_Load_recipe')();
            }
        });

        this.deleteContent = ko.computed(() => {
            if (this.recipeType() === RecipeNamespaces.RecipeDefinition) {
                return this.connector.translate('I4SCADA_Are_you_sure_you_want_to_delete_this_recipe_definition')();
            } else {
                return this.connector.translate('I4SCADA_Are_you_sure_you_want_to_delete_this_recipe')();
            }
        });

        this.isExportButtonEnable = ko.computed(() => {
            if (this.recipeType() === RecipeNamespaces.RecipeDefinition) {
                return !!this.recipeDefinitionName();
            } else {
                return !!this.recipeName();
            }
        });

        this.newName = ko.observable<string>()
            .extend({ throttle: 250 });

        this.nameValidationSubscription = this.newName.subscribe(async (name) => {
            try {
                if (this.recipeType() === RecipeNamespaces.RecipeDefinition) {
                    let excludeId = this.isAddMode() === true ? "00000000-0000-0000-0000-000000000000" : this.recipeDefinitionId();
                    this.isNameValid(await this.recipeDefinitionService.validateName(name || "", excludeId || "00000000-0000-0000-0000-000000000000"));
                } else {
                    let excludeId = this.isAddMode() === true ? "00000000-0000-0000-0000-000000000000" : this.recipeId();
                    this.isNameValid(await this.recipeService.validateName(name || "", excludeId || "00000000-0000-0000-0000-000000000000"));
                }
            } catch (error) {
                this.connector.handleError(WfRecipeManagementComponent)(error);
            }

        });

        this.configurationItems = ko.computed(() => {
            if (this.isOnlyOwnConfig())
                return this.configurations().filter((data) => {
                    return data.Owner === this.connector.currentLoggedInUser();
                });

            _.each(this.configurations(),
                configuration => {
                    (configuration as any).canRemoveItem = ko.pureComputed<boolean>(() => {
                        const entityId = this.recipeType() === RecipeNamespaces.RecipeDefinition
                                             ? this.recipeDefinitionId()
                                             : this.recipeId();

                        return configuration.ID !== entityId;
                    });
                });

            return this.configurations();
        });

        this.cloneRecipeDefinitionItems = ko.computed(() => {
            if (this.isOnlyOwnConfig())
                return this.cloneRecipeDefinitions().filter((data) => {
                    return data.Owner === this.connector.currentLoggedInUser();
                });

            return this.cloneRecipeDefinitions();
        });

        this.concatenateRecipeDefinitionItems = ko.computed(() => {
            if (this.isOnlyOwnConfig())
                return this.concatenateRecipeDefinitions().filter((data) => {
                    return data.Owner === this.connector.currentLoggedInUser();
                });

            return this.concatenateRecipeDefinitions();
        });

        this.isSaveEnabled = ko.computed(() => {
            if (this.recipeType() === RecipeNamespaces.RecipeDefinition) {
                return !!this.recipeDefinitionId();
            } else {
                return !!this.recipeId();
            }
        });

        this.recipeItems = ko.computed(() => {
            const pattern = ko.unwrap(this.recipePattern).toLowerCase();
            return this.recipes().filter((i) => {
                return (i.aliasName || "").toLowerCase().indexOf(pattern) >= 0 ||
                    (i.description || "").toLowerCase().indexOf(pattern) >= 0;
            });
        });

        this.recipeDefinitionItems = ko.computed(() => {
            const pattern = ko.unwrap(this.recipeDefinitionPattern).toLowerCase();
            return this.recipeDefinitions().filter((i) => {
                return (i.aliasName || "").toLowerCase().indexOf(pattern) >= 0 ||
                    (i.description || "").toLowerCase().indexOf(pattern) >= 0;
            });
        });

        //signal browser

        this.delayedPattern.subscribe(this.getSignalNamesAsync);
        this.selectedGroupId.subscribe(this.getSignalNamesAsync);
    }

    public async onRemoveConfig(data: ControlConfigurationDTO) {
        const id = data.ID;
        const entityId = this.recipeType() === RecipeNamespaces.RecipeDefinition
                             ? this.recipeDefinitionId()
                             : this.recipeId();

        if (entityId !== id) {
            let configurations = [];
            try {
                if (this.recipeType() === RecipeNamespaces.RecipeDefinition) {
                    await this.recipeDefinitionService.delete(id);
                    configurations = await this.recipeDefinitionService.list();

                } else {
                    await this.recipeService.delete(id);
                    configurations = await this.recipeService.list();
                }
            } catch (error) {
                this.connector.handleError(WfRecipeManagementComponent)(error);
            }

            this.configurations(configurations);
        }
    }

    public async onLoadConfig(data: ControlConfigurationDTO) {
        try {
            if (this.recipeType() === RecipeNamespaces.RecipeDefinition) {
                await this.getRecipeDefinitioAsync(data.ID);
            } else {
                await this.getRecipeAsync(data.ID);
            }
        } catch (error) {
            this.connector.handleError(WfRecipeManagementComponent)(error);
        }
    }

    public async getRecipeDefinitioAsync(id: Guid) {
        try {
            const data = await this.recipeDefinitionService.getById(id);
            if (data) {
                this.recipeDefinitionId(data.ID);
                this.recipeDefinitionName(data.Name);
                this.recipeDefinitions(JSON.parse(data.Content));
                this.recipeDefinitionsContent = JSON.parse(data.Content);
            } else {
                this.recipeDefinitionId(null);
                this.recipeDefinitionName(null);
                this.recipeDefinitions([]);
                this.recipeDefinitionsContent = [];
            }
        } catch (error) {
            this.recipeDefinitionId(null);
            this.recipeDefinitionName(null);
            this.recipeDefinitions([]);
            this.recipeDefinitionsContent = [];
            this.connector.handleError(WfRecipeManagementComponent)(error);
        }
    }

    public async cloneRecipeDefinitioAsync(id: Guid) {
        try {
            const data = await this.recipeDefinitionService.getById(id);

            this.recipes((JSON.parse(data.Content) as IRecipeDefinitionItem[]).map(item => {
                return {
                    aliasName: item.aliasName,
                    description: item.description,
                    value: 0
                } as IRecipeItem
            }));

            this.recipesContent = (JSON.parse(data.Content) as IRecipeDefinitionItem[]).map(item => {
                return {
                    aliasName: item.aliasName,
                    description: item.description,
                    value: 0
                } as IRecipeItem
            });

        } catch (error) {
            this.recipes([]);
            this.recipesContent = [];
            this.connector.handleError(WfRecipeManagementComponent)(error);
        }
    }

    public async getRecipeAsync(id: Guid) {
        try {
            const data = await this.recipeService.getById(id);
            if (data) {
                this.recipeId(data.ID);
                this.recipeName(data.Name);
                this.recipes(JSON.parse(data.Content));
                this.recipesContent = JSON.parse(data.Content);
            }
            else {
                this.recipeId(null);
                this.recipeName(null);
                this.recipes([]);
                this.recipesContent = [];
            }
        } catch (error) {
            this.recipeId(null);
            this.recipeName(null);
            this.recipes([]);
            this.recipesContent = [];
            this.connector.handleError(WfRecipeManagementComponent)(error);
        }
    }

    public async createRecipeDefinitioAsync() {
        try {
            const name = this.recipeDefinitionName();
            const config = JSON.stringify(this.recipeDefinitions());
            const data = await this.recipeDefinitionService.create(name, config);
            this.recipeDefinitionId(data.ID);
            this.recipeDefinitionName(data.Name);
            this.recipeDefinitions(JSON.parse(data.Content));
            this.recipeDefinitionsContent = JSON.parse(data.Content);
        } catch (error) {
            this.connector.handleError(WfRecipeManagementComponent)(error);
        }
    }

    public async createRecipeAsync() {
        try {
            const name = this.recipeName();
            const config = JSON.stringify(this.recipes());
            const data = await this.recipeService.create(name, config);
            this.recipeId(data.ID);
            this.recipeName(data.Name);
            this.recipes(JSON.parse(data.Content));
            this.recipesContent = JSON.parse(data.Content);
        } catch (error) {
            this.connector.handleError(WfRecipeManagementComponent)(error);
        }
    }

    public async updateRecipeDefinitioAsync() {
        try {
            const id = this.recipeDefinitionId();
            const name = this.recipeDefinitionName();
            const config = JSON.stringify(this.recipeDefinitions());
            const data = await this.recipeDefinitionService.update(id, name, config);
            this.recipeDefinitionId(data.ID);
            this.recipeDefinitionName(data.Name);
            this.recipeDefinitions(JSON.parse(data.Content));
            this.recipeDefinitionsContent = JSON.parse(data.Content);
        } catch (error) {
            this.connector.handleError(WfRecipeManagementComponent)(error);
        }
    }

    public async updateRecipeAsync() {
        try {
            const id = this.recipeId();
            const name = this.recipeName();
            const config = JSON.stringify(this.recipes());
            const data = await this.recipeService.update(id, name, config);
            this.recipeId(data.ID);
            this.recipeName(data.Name);
            this.recipes(JSON.parse(data.Content));
            this.recipesContent = JSON.parse(data.Content);
        } catch (error) {
            this.connector.handleError(WfRecipeManagementComponent)(error);
        }
    }


    public onDeleteRecipeDefinitionItem(data: IRecipeDefinitionItem) {
        this.recipeDefinitions.remove(data);
    }

    public onDeleteRecipeItem(data: IRecipeItem) {
        this.recipes.remove(data);
    }

    public showEditDialog() {
        this.isAddMode(false);
        if (this.recipeType() === RecipeNamespaces.RecipeDefinition) {
            this.newName(this.recipeDefinitionName());
        } else {
            this.newName(this.recipeName());
        }
        this.showAddEdit(true);
    }

    public async showAddDialog() {
        this.newName(null);
        this.isAddMode(true);
        try {
            if (this.recipeType() !== RecipeNamespaces.RecipeDefinition) {
                const configurations = await this.recipeDefinitionService.list();
                this.cloneRecipeDefinitions(configurations);
                this.selectedCloneRecipeDefinitionId(null);
            }
            this.showAddEdit(true);
        } catch (error) {
            this.connector.handleError(WfRecipeManagementComponent)(error);
        }
    }

    public async showLoadDialog() {

        let configurations = [];
        try {
            if (this.recipeType() === RecipeNamespaces.RecipeDefinition) {
                configurations = await this.recipeDefinitionService.list();
            } else {
                configurations = await this.recipeService.list();
            }

            this.configurations(configurations);
            this.showLoad(true);
        } catch (error) {
            this.connector.handleError(WfRecipeManagementComponent)(error);
        }
    }


    public showSignalBrowserDialog() {
        const selectedItems = this.items;
        if (this.recipeType() === RecipeNamespaces.RecipeDefinition) {
            selectedItems(this.recipeDefinitions().map(item => item.aliasName));
        } else {
            selectedItems(this.recipes().map(item => item.aliasName));
        }
        for (const signalItem of this.signalItems()) {
            const item = _.find(selectedItems(), x => x === signalItem.item.Name);
            signalItem.selected(!!item);
        }
        this.showSignalBrowser(true);
    }

    public async showConcatenateRecipeDefinitionsDialog() {
        try {
            const configurations = await this.recipeDefinitionService.list();
            this.concatenateRecipeDefinitions(configurations);
            this.selectedConcatenateRecipeDefinitionId(null);
            this.showConcatenateRecipeDefinitions(true);
        } catch (error) {
            this.connector.handleError(WfRecipeManagementComponent)(error);
        }
    }

    public closeConcatenateRecipeDefinitionsDialog() {
        this.showConcatenateRecipeDefinitions(false);
    }

    public async applyConcatenateRecipeDefinitionsDialog() {
        try {
            this.showConcatenateRecipeDefinitions(false);

            const id = this.selectedConcatenateRecipeDefinitionId();
            if (id) {
                const recipeDefinition = await this.recipeDefinitionService.getById(id);
                const recipeDefinitions = JSON.parse(recipeDefinition.Content) as IRecipeDefinitionItem[];

                this.recipes.valueWillMutate();
                for (let item of recipeDefinitions) {
                    const hasItem = _.find(this.recipes(), x => x.aliasName === item.aliasName);
                    if (!hasItem) {
                        this.recipes.push({
                            aliasName: item.aliasName,
                            description: item.description,
                            value: 0
                        })
                    }
                }
                this.recipes.valueHasMutated();
            }

        } catch (error) {
            this.connector.handleError(WfRecipeManagementComponent)(error);
        }
    }

    public addSelectedItems<T extends IRecipeDefinitionItem>(selectedItems: KnockoutObservableArray<string>, recipes: KnockoutObservableArray<T>, mapItem: (item: string) => T) {
        const toAdd = [];
        for (const item of selectedItems()) {
            const searchedItem = _.find(recipes(), x => x.aliasName === item);
            if (!searchedItem) {
                toAdd.push(mapItem(item));
            }
        }
        recipes.valueWillMutate();
        for (const item of toAdd) {
            recipes().push(item);
        }
        recipes.valueHasMutated();
    }

    public removeSelectedItems<T extends IRecipeDefinitionItem>(selectedItems: KnockoutObservableArray<string>, recipes: KnockoutObservableArray<T>) {
        const toRemove = [];
        for (const item of recipes()) {
            const searchedItem = _.find(selectedItems(), x => x === item.aliasName);
            if (!searchedItem) {
                toRemove.push(item);
            }
        }
        recipes.valueWillMutate();
        for (const item of toRemove) {
            recipes.remove(item);
        }
        recipes.valueHasMutated();
    }

    public applySignalBrowserDialog() {
        if (this.recipeType() === RecipeNamespaces.RecipeDefinition) {
            this.addSelectedItems(this.items, this.recipeDefinitions, (item) => { return { aliasName: item, description: item } });
            this.removeSelectedItems(this.items, this.recipeDefinitions);
        } else {
            this.addSelectedItems(this.items, this.recipes, (item) => { return { aliasName: item, description: item, value: 0 } });
            this.removeSelectedItems(this.items, this.recipes);
        }
        this.closeSignalBrowserDialog();
    }

    public onCopySelectedName() {
        if (this.selectedCloneRecipeDefinitionId() != null) {
            this.newName(_.find(this.cloneRecipeDefinitionItems(), item => item.ID === this.selectedCloneRecipeDefinitionId()).Name);
        }
    }

    public async applyAddEditDialog() {
        const name = this.newName();

        if (name == null || name.replace(/ /g, "").length <= 0) {
            return;
        }

        if (this.recipeType() === RecipeNamespaces.RecipeDefinition) {
            this.recipeDefinitionName(name);
            if (this.isAddMode()) {
                this.recipeDefinitionsContent = [];
                this.recipeDefinitions([]);
                await this.createRecipeDefinitioAsync();
            } else {
                await this.updateRecipeDefinitioAsync();
            }
        } else {
            this.recipeName(name);
            if (this.isAddMode()) {
                this.recipesContent = [];
                this.recipes([]);

                if (this.selectedCloneRecipeDefinitionId()) {
                    await this.cloneRecipeDefinitioAsync(this.selectedCloneRecipeDefinitionId());
                }
                await this.createRecipeAsync();
            } else {
                await this.updateRecipeAsync();
            }
        }

        this.closeAddEditDialog();
    }

    public async applyDeleteDialog() {
        try {
            if (this.recipeType() === RecipeNamespaces.RecipeDefinition) {
                const id = this.recipeDefinitionId();
                await this.recipeDefinitionService.delete(id);
                this.recipeDefinitionId(null);
                this.recipeDefinitionsContent = [];
                this.recipeDefinitions([]);
                this.recipeDefinitionName(null);
            } else {
                const id = this.recipeId();
                await this.recipeService.delete(id);
                this.recipeId(null);
                this.recipesContent = [];
                this.recipes([]);
                this.recipeName(null);
            }
            this.closeDeleteDialog();
        } catch (error) {
            this.connector.handleError(WfRecipeManagementComponent)(error);
        }
    }

    public closeAddEditDialog() {
        this.newName("");
        this.showAddEdit(false);
    }

    public showDeleteDialog() {
        this.showDelete(true);
    }

    public closeDeleteDialog() {
        this.showDelete(false);
    }

    public closeLoadDialog() {
        this.showLoad(false);
    }

    public closeSignalBrowserDialog() {
        this.showSignalBrowser(false);
    }

    public async onSave() {
        if (this.recipeType() === RecipeNamespaces.RecipeDefinition) {
            await this.updateRecipeDefinitioAsync();
        } else {
            await this.updateRecipeAsync();
        }
    }

    public onResetDescriptionRecipeDefinition(data: IRecipeDefinitionItem) {
        const item = _.find(this.recipeDefinitionsContent, item => item.aliasName === data.aliasName);
        this.recipeDefinitions.replace(data, item);
    }

    public onResetDescriptionRecipe(data: IRecipeItem) {
        const item = _.find(this.recipesContent, item => item.aliasName === data.aliasName);
        this.recipes.replace(data, {
            aliasName: data.aliasName,
            description: item.description,
            value: data.value
        });
    }

    public onResetValueRecipe(data: IRecipeItem) {
        const item = _.find(this.recipesContent, item => item.aliasName === data.aliasName);
        this.recipes.replace(data, {
            aliasName: data.aliasName,
            description: data.description,
            value: item.value
        });
    }

    public async onRefresh() {
        try {
            if (this.recipeType() === RecipeNamespaces.RecipeDefinition) {
                if (this.recipeDefinitionId()) {
                    await this.getRecipeDefinitioAsync(this.recipeDefinitionId());
                }
            } else {
                if (this.recipeId()) {
                    await this.getRecipeAsync(this.recipeId());
                }
            }
        } catch (error) {
            this.connector.handleError(WfRecipeManagementComponent)(error);
        }
    }

    public async onLoadCurrentValue(data: IRecipeItem) {

        const signalValue = await this.connector.readSignals([data.aliasName]);

        if (!signalValue && signalValue.length <= 0)
            return;

        if (signalValue[0].Result !== 0) {
            Logger.warnToast(this.connector.translate("I4SCADA_Recipe_signal_read_for_0_failed_1")().format(data.aliasName, signalValue[0].Result));
        }

        this.recipes.replace(data, {
            aliasName: data.aliasName,
            description: data.description,
            value: signalValue[0].Value
        });
    }

    public async onLoadCurrentValues() {
        const signalNames = this.recipes().map(item => item.aliasName);
        try {
            const signalValues = await this.connector.readSignals(signalNames);
            for (let i = 0; i < this.recipes().length; i++) {
                const item = this.recipes()[i];
                const value = signalValues[i];

                this.recipes.replace(item, {
                    aliasName: item.aliasName,
                    description: item.description,
                    value: value.Result === 0 ? value.Value : item.value
                });

                if (value.Result !== 0) {
                    Logger.warnToast(this.connector.translate("I4SCADA_Recipe_signal_read_for_0_failed_1")().format(item.aliasName, value.Result));
                }
            }
        }
        catch (error) {
            Logger.handleError(WfRecipeManagementComponent)(this.connector.translate(error)());
        }
    }

    //signal browser
    public async populateItems() {
        await this.getGroupNamesAsync();
    }

    private async getGroupNamesAsync() {
        try {
            const filter = {
                ServerNames: [],
                GroupNames: []
            } as GetGroupNamesFilterDTO;
            this.isLoading(true);
            const groupItems = await SignalsService.getGroupNames(filter, 0, 500);
            this.groupItems(groupItems);

            this.groupItems.unshift({ Name: "*", ID: this.emtyGuid });
            this.selectedGroupId(this.emtyGuid);
            this.selectedGroupId.notifySubscribers();

        } catch (error) {
            this.connector.handleError(WfRecipeManagementComponent)(error);
        } finally {
            this.isLoading(false);
        }
    }

    private getSignalNamesAsync = async () => {

        const pattern = `*${this.pattern()}*`;

        const filter = {
            ServerNames: [],
            AliasNames: [],
            Pattern: pattern,
            GroupIds: (this.selectedGroupId() && this.selectedGroupId() != this.emtyGuid) ? [this.selectedGroupId()] : []
        } as GetSignalNamesFilterDTO;

        try {
            this.isLoading(true);
            const signalItems = await SignalsService.getSignalNames(filter, 0, this.maxSignalCount + 1);

            this.hasMoreSignals(signalItems.length >= this.maxSignalCount + 1);
            if (signalItems.length >= this.maxSignalCount) {
                signalItems.pop();
            }

            this.signalItems(signalItems.map((signal) => {
                return {
                    item: signal,
                    selected: ko.observable(this.isSignalSelected(signal))
                }
            }));
        } catch (error) {
            this.connector.error(WfRecipeManagementComponent, error);
        } finally {
            this.isLoading(false);
        }
    }

    private async addGroup() {
        try {
            const filter = {
                GroupIds: (this.selectedGroupId() && this.selectedGroupId() != this.emtyGuid) ? [this.selectedGroupId()] : [],
                AliasNames: [],
                ServerNames: []
            } as GetSignalNamesFilterDTO;

            this.isLoading(true);
            const signals = await SignalsService.getSignalNames(filter, 0, this.maxSignalsForGroupAdd);

            this.items.valueWillMutate();
            for (let signal of signals) {
                const signalItem = _.find(this.signalItems(), x => x.item.Name === signal.Name);

                if (signalItem) {
                    signalItem.selected(true);
                }

                if (_.find(this.items(), x => x === signal.Name)) {
                    continue;
                }

                this.items.push(signal.Name);
            }
            this.items.valueHasMutated();

        } catch (error) {
            this.connector.handleError(WfRecipeManagementComponent)(error);
        } finally {
            this.isLoading(false);
        }
    }

    public onSignalClicked = (item: ISelectedItem<NameDTO>) => {
        const isSelected = item.selected();
        if (isSelected) {
            this.removeItem(item.item.Name);
            item.selected(false);
        } else {
            this.addItem(item.item.Name);
            item.selected(true);
        }
    }

    private isSignalSelected(item: NameDTO) {
        const signal = _.find(this.items(), x => x === item.Name);
        return !!signal;
    }

    private removeItem(signalName: string) {
        const item = _.find(this.items(), signal => signal === signalName)
        if (item) {
            this.items.remove(item);
        }
    }

    private addItem(signalName: string) {
        if (_.find(this.items(), signal => signal === signalName)) {
            return;
        }
        this.items.push(signalName);
    }

    public showExportDialog() {
        let content;
        let name: string = "export";

        if (this.recipeType() === RecipeNamespaces.RecipeDefinition) {
            name = this.recipeDefinitionName();
            content = {
                name: name,
                type: RecipeNamespaces.RecipeDefinition,
                data: this.recipeDefinitionsContent
            }
        } else {
            name = this.recipeName();
            content = {
                name: name,
                type: RecipeNamespaces.Recipe,
                data: this.recipesContent,
            }
        }
        try {
            this.recipeJSONService.download(JSON.stringify(content), name);
        } catch (error) {
            this.connector.handleError(WfRecipeManagementComponent)(error);
        }
    }

    public showImportDialog() {
        this.showImport(true);
    }

    public closeImportDialog() {
        this.showImport(false);
    }

    public async applyImportDialog() {

        const inputElementId = `input-${ko.unwrap(this.id)}`

        if (!inputElementId) {
            return;
        }

        try {
            const configurations = await this.recipeJSONService.load(inputElementId);
            this.selectedFiles([]);
            for (let configuration of configurations) {
                const parsedConfiguration = JSON.parse(configuration);
                await this.processImport(parsedConfiguration);
            }
            this.closeImportDialog();

        } catch (error) {
            this.connector.handleError(WfRecipeManagementComponent)(error);
        }

    }

    public async processImport(parsedConfiguration: any) {
        if (!parsedConfiguration) {
            Logger.warnToast(this.connector.translate("I4SCADA_Configuration_is_empty")());
            return;
        }
        if (!parsedConfiguration.name) {
            Logger.warnToast(this.connector.translate("I4SCADA_No_configuration_name_is_set")());
            return;
        }
        if (!parsedConfiguration.data && parsedConfiguration.data <= 0) {
            Logger.warnToast(this.connector.translate("I4SCADA_Configuration_data_is_empty")());
            return;
        }
        if (!parsedConfiguration.type) {
            Logger.warnToast(this.connector.translate("I4SCADA_No_configuration_type_is_set")());
            return;
        }

        if (this.recipeType() === RecipeNamespaces.RecipeDefinition) {
            const hasConfiguration = await this.recipeDefinitionService.getByName(parsedConfiguration.name);
            if (parsedConfiguration.type !== RecipeNamespaces.RecipeDefinition) {
                Logger.warnToast(this.connector.translate("I4SCADA_Configuration_type_is_not_valid")());
                return;
            }
            if (!hasConfiguration) {
                await this.recipeDefinitionService.create(parsedConfiguration.name, JSON.stringify(parsedConfiguration.data));
            } else if (this.overwriteConfigurationOnImport()) {
                await this.recipeDefinitionService.update(hasConfiguration.ID, parsedConfiguration.name, JSON.stringify(parsedConfiguration.data));
            } else {
                Logger.warnToast(this.connector.translate("I4SCADA_A_configuration_already_exsists")());
                return;
            }
        } else {
            const hasConfiguration = await this.recipeService.getByName(parsedConfiguration.name);
            if (parsedConfiguration.type !== RecipeNamespaces.Recipe) {
                Logger.warnToast(this.connector.translate("I4SCADA_Configuration_type_is_not_valid")());
                return;
            }
            if (!hasConfiguration) {
                await this.recipeService.create(parsedConfiguration.name, JSON.stringify(parsedConfiguration.data));
            } else if (this.overwriteConfigurationOnImport()) {
                await this.recipeService.update(hasConfiguration.ID, parsedConfiguration.name, JSON.stringify(parsedConfiguration.data));
            } else {
                Logger.warnToast(this.connector.translate("I4SCADA_A_configuration_already_exsists")());
                return;
            }
        }
    }

    public onFile() {
        document.getElementById("input-" + ko.unwrap(this.id)).click();
    }

    public onChangeFile(obj: WfRecipeManagementComponent, event) {
        this.selectedFiles([]);
        if (event.target.files) {
            const files = _.map(event.target.files, file => (<any>file).name);
            this.selectedFiles(files);
        }
    }

    public async dispose() {
        this.nameValidationSubscription.dispose();
        await super.dispose();

        //clear dialogs
        const dialogAddEdit = document.getElementById('modal-add-edit-recipe-name-' + ko.unwrap(this.id));
        const dialogConcatenateRecipe = document.getElementById('modal-concatenate-recipe-definitions-' + ko.unwrap(this.id));
        const dialogDeleteRecipe = document.getElementById('modal-delete-recipe-' + ko.unwrap(this.id));
        const dialogLoadRecipe = document.getElementById('modal-load-recipe-' + ko.unwrap(this.id));
        const dialogRecipeSignal = document.getElementById('modal-recipe-signal-browser-' + ko.unwrap(this.id));
        const dialogImport = document.getElementById('modal-recipe-import-' + ko.unwrap(this.id));

        ko.cleanNode(dialogAddEdit);
        ko.cleanNode(dialogConcatenateRecipe);
        ko.cleanNode(dialogDeleteRecipe);
        ko.cleanNode(dialogLoadRecipe);
        ko.cleanNode(dialogRecipeSignal);
        ko.cleanNode(dialogImport);

        dialogAddEdit.remove();
        dialogConcatenateRecipe.remove();
        dialogDeleteRecipe.remove();
        dialogLoadRecipe.remove();
        dialogRecipeSignal.remove();
        dialogImport.remove();
    }
}

export = WfRecipeManagementComponent;