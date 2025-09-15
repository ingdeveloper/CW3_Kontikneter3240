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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
define(["require", "exports", "../component-base.model", "../models/recipe.model", "../services/recipe.service", "../services/recipe-definition.service", "../services/recipe-json.service", "../../services/signalsService", "../../services/logger"], function (require, exports, ComponentBaseModel, recipe_model_1, RecipeService, RecipeDefinitionService, RecipeJSONService, SignalsService, Logger) {
    "use strict";
    var WfRecipeManagementComponent = /** @class */ (function (_super) {
        __extends(WfRecipeManagementComponent, _super);
        function WfRecipeManagementComponent(params) {
            var _this = _super.call(this, params) || this;
            //Recipe Definition
            _this.recipeDefinitionId = ko.observable();
            _this.recipeDefinitionsContent = [];
            _this.recipeDefinitions = ko.observableArray([]);
            //Recipe
            _this.recipeId = ko.observable();
            _this.recipesContent = [];
            _this.recipes = ko.observableArray([]);
            _this.isNameValid = ko.observable(false);
            _this.cloneRecipeDefinitions = ko.observableArray([]);
            _this.selectedCloneRecipeDefinitionId = ko.observable();
            _this.concatenateRecipeDefinitions = ko.observableArray([]);
            _this.selectedConcatenateRecipeDefinitionId = ko.observable();
            _this.overwriteConfigurationOnImport = ko.observable(true);
            _this.recipePattern = ko.observable("")
                .extend({ throttle: 250 });
            _this.recipeDefinitionPattern = ko.observable("")
                .extend({ throttle: 250 });
            // fileinput
            _this.selectedFiles = ko.observableArray([]);
            //copyButton
            _this.isCopyButtonEnabled = ko.pureComputed(function () {
                return _this.selectedCloneRecipeDefinitionId() != null;
            });
            // services
            _this.recipeService = new RecipeService();
            _this.recipeDefinitionService = new RecipeDefinitionService();
            _this.recipeJSONService = new RecipeJSONService();
            _this.groupItems = ko.observableArray([]);
            _this.selectedGroupId = ko.observable(null);
            _this.signalItems = ko.observableArray([]);
            _this.pattern = ko.observable("");
            _this.delayedPattern = ko.computed(_this.pattern).extend({ throttle: 500 });
            _this.hasMoreSignals = ko.observable(false);
            _this.isLoading = ko.observable(false);
            _this.emtyGuid = "00000000-0000-0000-0000-000000000000";
            _this.getSignalNamesAsync = function () { return __awaiter(_this, void 0, void 0, function () {
                var pattern, filter, signalItems, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            pattern = "*" + this.pattern() + "*";
                            filter = {
                                ServerNames: [],
                                AliasNames: [],
                                Pattern: pattern,
                                GroupIds: (this.selectedGroupId() && this.selectedGroupId() != this.emtyGuid) ? [this.selectedGroupId()] : []
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            this.isLoading(true);
                            return [4 /*yield*/, SignalsService.getSignalNames(filter, 0, this.maxSignalCount + 1)];
                        case 2:
                            signalItems = _a.sent();
                            this.hasMoreSignals(signalItems.length >= this.maxSignalCount + 1);
                            if (signalItems.length >= this.maxSignalCount) {
                                signalItems.pop();
                            }
                            this.signalItems(signalItems.map(function (signal) {
                                return {
                                    item: signal,
                                    selected: ko.observable(_this.isSignalSelected(signal))
                                };
                            }));
                            return [3 /*break*/, 5];
                        case 3:
                            error_1 = _a.sent();
                            this.connector.error(WfRecipeManagementComponent, error_1);
                            return [3 /*break*/, 5];
                        case 4:
                            this.isLoading(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            }); };
            _this.onSignalClicked = function (item) {
                var isSelected = item.selected();
                if (isSelected) {
                    _this.removeItem(item.item.Name);
                    item.selected(false);
                }
                else {
                    _this.addItem(item.item.Name);
                    item.selected(true);
                }
            };
            _this.initializeComputeds();
            _this.populateItems();
            _this.onRefresh();
            return _this;
        }
        WfRecipeManagementComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
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
            this.recipeType = ko.observable(ko.unwrap(this.settings.recipeType) || recipe_model_1.RecipeNamespaces.RecipeDefinition);
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
            this.items = ko.observableArray();
            this.maxSignalCount = ko.unwrap(this.settings.maxSignalCount) !== undefined ? ko.unwrap(this.settings.maxSignalCount) : 50;
            this.maxSignalsForGroupAdd = ko.unwrap(this.settings.maxSignalsForGroupAdd) !== undefined ? ko.unwrap(this.settings.maxSignalsForGroupAdd) : 500;
        };
        WfRecipeManagementComponent.prototype.initializeComputeds = function () {
            var _this = this;
            this.panelBodyHeight = ko.pureComputed(function () {
                if (!_this.height()) {
                    return null;
                }
                if (_this.headerVisibility()) {
                    return _this.height() - 104;
                }
                return _this.height() - 62;
            });
            this.addEditNameTitle = ko.computed(function () {
                if (_this.recipeType() === recipe_model_1.RecipeNamespaces.RecipeDefinition) {
                    return _this.isAddMode() ? _this.connector.translate('I4SCADA_Add_recipe_definition')() : _this.connector.translate('I4SCADA_Edit_recipe_definition_name')();
                }
                else {
                    return _this.isAddMode() ? _this.connector.translate('I4SCADA_Add_recipe')() : _this.connector.translate('I4SCADA_Edit_recipe_name')();
                }
            });
            this.deleteTitle = ko.computed(function () {
                if (_this.recipeType() === recipe_model_1.RecipeNamespaces.RecipeDefinition) {
                    return _this.connector.translate('I4SCADA_Delete_recipe_definition')();
                }
                else {
                    return _this.connector.translate('I4SCADA_Delete_recipe')();
                }
            });
            this.loadTitle = ko.computed(function () {
                if (_this.recipeType() === recipe_model_1.RecipeNamespaces.RecipeDefinition) {
                    return _this.connector.translate('I4SCADA_Load_recipe_definition')();
                }
                else {
                    return _this.connector.translate('I4SCADA_Load_recipe')();
                }
            });
            this.deleteContent = ko.computed(function () {
                if (_this.recipeType() === recipe_model_1.RecipeNamespaces.RecipeDefinition) {
                    return _this.connector.translate('I4SCADA_Are_you_sure_you_want_to_delete_this_recipe_definition')();
                }
                else {
                    return _this.connector.translate('I4SCADA_Are_you_sure_you_want_to_delete_this_recipe')();
                }
            });
            this.isExportButtonEnable = ko.computed(function () {
                if (_this.recipeType() === recipe_model_1.RecipeNamespaces.RecipeDefinition) {
                    return !!_this.recipeDefinitionName();
                }
                else {
                    return !!_this.recipeName();
                }
            });
            this.newName = ko.observable()
                .extend({ throttle: 250 });
            this.nameValidationSubscription = this.newName.subscribe(function (name) { return __awaiter(_this, void 0, void 0, function () {
                var excludeId, _a, excludeId, _b, error_2;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 5, , 6]);
                            if (!(this.recipeType() === recipe_model_1.RecipeNamespaces.RecipeDefinition)) return [3 /*break*/, 2];
                            excludeId = this.isAddMode() === true ? "00000000-0000-0000-0000-000000000000" : this.recipeDefinitionId();
                            _a = this.isNameValid;
                            return [4 /*yield*/, this.recipeDefinitionService.validateName(name || "", excludeId || "00000000-0000-0000-0000-000000000000")];
                        case 1:
                            _a.apply(this, [_c.sent()]);
                            return [3 /*break*/, 4];
                        case 2:
                            excludeId = this.isAddMode() === true ? "00000000-0000-0000-0000-000000000000" : this.recipeId();
                            _b = this.isNameValid;
                            return [4 /*yield*/, this.recipeService.validateName(name || "", excludeId || "00000000-0000-0000-0000-000000000000")];
                        case 3:
                            _b.apply(this, [_c.sent()]);
                            _c.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_2 = _c.sent();
                            this.connector.handleError(WfRecipeManagementComponent)(error_2);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            }); });
            this.configurationItems = ko.computed(function () {
                if (_this.isOnlyOwnConfig())
                    return _this.configurations().filter(function (data) {
                        return data.Owner === _this.connector.currentLoggedInUser();
                    });
                _.each(_this.configurations(), function (configuration) {
                    configuration.canRemoveItem = ko.pureComputed(function () {
                        var entityId = _this.recipeType() === recipe_model_1.RecipeNamespaces.RecipeDefinition
                            ? _this.recipeDefinitionId()
                            : _this.recipeId();
                        return configuration.ID !== entityId;
                    });
                });
                return _this.configurations();
            });
            this.cloneRecipeDefinitionItems = ko.computed(function () {
                if (_this.isOnlyOwnConfig())
                    return _this.cloneRecipeDefinitions().filter(function (data) {
                        return data.Owner === _this.connector.currentLoggedInUser();
                    });
                return _this.cloneRecipeDefinitions();
            });
            this.concatenateRecipeDefinitionItems = ko.computed(function () {
                if (_this.isOnlyOwnConfig())
                    return _this.concatenateRecipeDefinitions().filter(function (data) {
                        return data.Owner === _this.connector.currentLoggedInUser();
                    });
                return _this.concatenateRecipeDefinitions();
            });
            this.isSaveEnabled = ko.computed(function () {
                if (_this.recipeType() === recipe_model_1.RecipeNamespaces.RecipeDefinition) {
                    return !!_this.recipeDefinitionId();
                }
                else {
                    return !!_this.recipeId();
                }
            });
            this.recipeItems = ko.computed(function () {
                var pattern = ko.unwrap(_this.recipePattern).toLowerCase();
                return _this.recipes().filter(function (i) {
                    return (i.aliasName || "").toLowerCase().indexOf(pattern) >= 0 ||
                        (i.description || "").toLowerCase().indexOf(pattern) >= 0;
                });
            });
            this.recipeDefinitionItems = ko.computed(function () {
                var pattern = ko.unwrap(_this.recipeDefinitionPattern).toLowerCase();
                return _this.recipeDefinitions().filter(function (i) {
                    return (i.aliasName || "").toLowerCase().indexOf(pattern) >= 0 ||
                        (i.description || "").toLowerCase().indexOf(pattern) >= 0;
                });
            });
            //signal browser
            this.delayedPattern.subscribe(this.getSignalNamesAsync);
            this.selectedGroupId.subscribe(this.getSignalNamesAsync);
        };
        WfRecipeManagementComponent.prototype.onRemoveConfig = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var id, entityId, configurations, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            id = data.ID;
                            entityId = this.recipeType() === recipe_model_1.RecipeNamespaces.RecipeDefinition
                                ? this.recipeDefinitionId()
                                : this.recipeId();
                            if (!(entityId !== id)) return [3 /*break*/, 10];
                            configurations = [];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 8, , 9]);
                            if (!(this.recipeType() === recipe_model_1.RecipeNamespaces.RecipeDefinition)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.recipeDefinitionService.delete(id)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.recipeDefinitionService.list()];
                        case 3:
                            configurations = _a.sent();
                            return [3 /*break*/, 7];
                        case 4: return [4 /*yield*/, this.recipeService.delete(id)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, this.recipeService.list()];
                        case 6:
                            configurations = _a.sent();
                            _a.label = 7;
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            error_3 = _a.sent();
                            this.connector.handleError(WfRecipeManagementComponent)(error_3);
                            return [3 /*break*/, 9];
                        case 9:
                            this.configurations(configurations);
                            _a.label = 10;
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.onLoadConfig = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            if (!(this.recipeType() === recipe_model_1.RecipeNamespaces.RecipeDefinition)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getRecipeDefinitioAsync(data.ID)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.getRecipeAsync(data.ID)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_4 = _a.sent();
                            this.connector.handleError(WfRecipeManagementComponent)(error_4);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.getRecipeDefinitioAsync = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var data, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.recipeDefinitionService.getById(id)];
                        case 1:
                            data = _a.sent();
                            if (data) {
                                this.recipeDefinitionId(data.ID);
                                this.recipeDefinitionName(data.Name);
                                this.recipeDefinitions(JSON.parse(data.Content));
                                this.recipeDefinitionsContent = JSON.parse(data.Content);
                            }
                            else {
                                this.recipeDefinitionId(null);
                                this.recipeDefinitionName(null);
                                this.recipeDefinitions([]);
                                this.recipeDefinitionsContent = [];
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_5 = _a.sent();
                            this.recipeDefinitionId(null);
                            this.recipeDefinitionName(null);
                            this.recipeDefinitions([]);
                            this.recipeDefinitionsContent = [];
                            this.connector.handleError(WfRecipeManagementComponent)(error_5);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.cloneRecipeDefinitioAsync = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var data, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.recipeDefinitionService.getById(id)];
                        case 1:
                            data = _a.sent();
                            this.recipes(JSON.parse(data.Content).map(function (item) {
                                return {
                                    aliasName: item.aliasName,
                                    description: item.description,
                                    value: 0
                                };
                            }));
                            this.recipesContent = JSON.parse(data.Content).map(function (item) {
                                return {
                                    aliasName: item.aliasName,
                                    description: item.description,
                                    value: 0
                                };
                            });
                            return [3 /*break*/, 3];
                        case 2:
                            error_6 = _a.sent();
                            this.recipes([]);
                            this.recipesContent = [];
                            this.connector.handleError(WfRecipeManagementComponent)(error_6);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.getRecipeAsync = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var data, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.recipeService.getById(id)];
                        case 1:
                            data = _a.sent();
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
                            return [3 /*break*/, 3];
                        case 2:
                            error_7 = _a.sent();
                            this.recipeId(null);
                            this.recipeName(null);
                            this.recipes([]);
                            this.recipesContent = [];
                            this.connector.handleError(WfRecipeManagementComponent)(error_7);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.createRecipeDefinitioAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var name_1, config, data, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            name_1 = this.recipeDefinitionName();
                            config = JSON.stringify(this.recipeDefinitions());
                            return [4 /*yield*/, this.recipeDefinitionService.create(name_1, config)];
                        case 1:
                            data = _a.sent();
                            this.recipeDefinitionId(data.ID);
                            this.recipeDefinitionName(data.Name);
                            this.recipeDefinitions(JSON.parse(data.Content));
                            this.recipeDefinitionsContent = JSON.parse(data.Content);
                            return [3 /*break*/, 3];
                        case 2:
                            error_8 = _a.sent();
                            this.connector.handleError(WfRecipeManagementComponent)(error_8);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.createRecipeAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var name_2, config, data, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            name_2 = this.recipeName();
                            config = JSON.stringify(this.recipes());
                            return [4 /*yield*/, this.recipeService.create(name_2, config)];
                        case 1:
                            data = _a.sent();
                            this.recipeId(data.ID);
                            this.recipeName(data.Name);
                            this.recipes(JSON.parse(data.Content));
                            this.recipesContent = JSON.parse(data.Content);
                            return [3 /*break*/, 3];
                        case 2:
                            error_9 = _a.sent();
                            this.connector.handleError(WfRecipeManagementComponent)(error_9);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.updateRecipeDefinitioAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var id, name_3, config, data, error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            id = this.recipeDefinitionId();
                            name_3 = this.recipeDefinitionName();
                            config = JSON.stringify(this.recipeDefinitions());
                            return [4 /*yield*/, this.recipeDefinitionService.update(id, name_3, config)];
                        case 1:
                            data = _a.sent();
                            this.recipeDefinitionId(data.ID);
                            this.recipeDefinitionName(data.Name);
                            this.recipeDefinitions(JSON.parse(data.Content));
                            this.recipeDefinitionsContent = JSON.parse(data.Content);
                            return [3 /*break*/, 3];
                        case 2:
                            error_10 = _a.sent();
                            this.connector.handleError(WfRecipeManagementComponent)(error_10);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.updateRecipeAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var id, name_4, config, data, error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            id = this.recipeId();
                            name_4 = this.recipeName();
                            config = JSON.stringify(this.recipes());
                            return [4 /*yield*/, this.recipeService.update(id, name_4, config)];
                        case 1:
                            data = _a.sent();
                            this.recipeId(data.ID);
                            this.recipeName(data.Name);
                            this.recipes(JSON.parse(data.Content));
                            this.recipesContent = JSON.parse(data.Content);
                            return [3 /*break*/, 3];
                        case 2:
                            error_11 = _a.sent();
                            this.connector.handleError(WfRecipeManagementComponent)(error_11);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.onDeleteRecipeDefinitionItem = function (data) {
            this.recipeDefinitions.remove(data);
        };
        WfRecipeManagementComponent.prototype.onDeleteRecipeItem = function (data) {
            this.recipes.remove(data);
        };
        WfRecipeManagementComponent.prototype.showEditDialog = function () {
            this.isAddMode(false);
            if (this.recipeType() === recipe_model_1.RecipeNamespaces.RecipeDefinition) {
                this.newName(this.recipeDefinitionName());
            }
            else {
                this.newName(this.recipeName());
            }
            this.showAddEdit(true);
        };
        WfRecipeManagementComponent.prototype.showAddDialog = function () {
            return __awaiter(this, void 0, void 0, function () {
                var configurations, error_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.newName(null);
                            this.isAddMode(true);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            if (!(this.recipeType() !== recipe_model_1.RecipeNamespaces.RecipeDefinition)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.recipeDefinitionService.list()];
                        case 2:
                            configurations = _a.sent();
                            this.cloneRecipeDefinitions(configurations);
                            this.selectedCloneRecipeDefinitionId(null);
                            _a.label = 3;
                        case 3:
                            this.showAddEdit(true);
                            return [3 /*break*/, 5];
                        case 4:
                            error_12 = _a.sent();
                            this.connector.handleError(WfRecipeManagementComponent)(error_12);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.showLoadDialog = function () {
            return __awaiter(this, void 0, void 0, function () {
                var configurations, error_13;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            configurations = [];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            if (!(this.recipeType() === recipe_model_1.RecipeNamespaces.RecipeDefinition)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.recipeDefinitionService.list()];
                        case 2:
                            configurations = _a.sent();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, this.recipeService.list()];
                        case 4:
                            configurations = _a.sent();
                            _a.label = 5;
                        case 5:
                            this.configurations(configurations);
                            this.showLoad(true);
                            return [3 /*break*/, 7];
                        case 6:
                            error_13 = _a.sent();
                            this.connector.handleError(WfRecipeManagementComponent)(error_13);
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.showSignalBrowserDialog = function () {
            var e_1, _a;
            var selectedItems = this.items;
            if (this.recipeType() === recipe_model_1.RecipeNamespaces.RecipeDefinition) {
                selectedItems(this.recipeDefinitions().map(function (item) { return item.aliasName; }));
            }
            else {
                selectedItems(this.recipes().map(function (item) { return item.aliasName; }));
            }
            var _loop_1 = function (signalItem) {
                var item = _.find(selectedItems(), function (x) { return x === signalItem.item.Name; });
                signalItem.selected(!!item);
            };
            try {
                for (var _b = __values(this.signalItems()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var signalItem = _c.value;
                    _loop_1(signalItem);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.showSignalBrowser(true);
        };
        WfRecipeManagementComponent.prototype.showConcatenateRecipeDefinitionsDialog = function () {
            return __awaiter(this, void 0, void 0, function () {
                var configurations, error_14;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.recipeDefinitionService.list()];
                        case 1:
                            configurations = _a.sent();
                            this.concatenateRecipeDefinitions(configurations);
                            this.selectedConcatenateRecipeDefinitionId(null);
                            this.showConcatenateRecipeDefinitions(true);
                            return [3 /*break*/, 3];
                        case 2:
                            error_14 = _a.sent();
                            this.connector.handleError(WfRecipeManagementComponent)(error_14);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.closeConcatenateRecipeDefinitionsDialog = function () {
            this.showConcatenateRecipeDefinitions(false);
        };
        WfRecipeManagementComponent.prototype.applyConcatenateRecipeDefinitionsDialog = function () {
            return __awaiter(this, void 0, void 0, function () {
                var id, recipeDefinition, recipeDefinitions, _loop_2, this_1, recipeDefinitions_1, recipeDefinitions_1_1, item, error_15;
                var e_2, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            this.showConcatenateRecipeDefinitions(false);
                            id = this.selectedConcatenateRecipeDefinitionId();
                            if (!id) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.recipeDefinitionService.getById(id)];
                        case 1:
                            recipeDefinition = _b.sent();
                            recipeDefinitions = JSON.parse(recipeDefinition.Content);
                            this.recipes.valueWillMutate();
                            _loop_2 = function (item) {
                                var hasItem = _.find(this_1.recipes(), function (x) { return x.aliasName === item.aliasName; });
                                if (!hasItem) {
                                    this_1.recipes.push({
                                        aliasName: item.aliasName,
                                        description: item.description,
                                        value: 0
                                    });
                                }
                            };
                            this_1 = this;
                            try {
                                for (recipeDefinitions_1 = __values(recipeDefinitions), recipeDefinitions_1_1 = recipeDefinitions_1.next(); !recipeDefinitions_1_1.done; recipeDefinitions_1_1 = recipeDefinitions_1.next()) {
                                    item = recipeDefinitions_1_1.value;
                                    _loop_2(item);
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (recipeDefinitions_1_1 && !recipeDefinitions_1_1.done && (_a = recipeDefinitions_1.return)) _a.call(recipeDefinitions_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            this.recipes.valueHasMutated();
                            _b.label = 2;
                        case 2: return [3 /*break*/, 4];
                        case 3:
                            error_15 = _b.sent();
                            this.connector.handleError(WfRecipeManagementComponent)(error_15);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.addSelectedItems = function (selectedItems, recipes, mapItem) {
            var e_3, _a, e_4, _b;
            var toAdd = [];
            var _loop_3 = function (item) {
                var searchedItem = _.find(recipes(), function (x) { return x.aliasName === item; });
                if (!searchedItem) {
                    toAdd.push(mapItem(item));
                }
            };
            try {
                for (var _c = __values(selectedItems()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var item = _d.value;
                    _loop_3(item);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_3) throw e_3.error; }
            }
            recipes.valueWillMutate();
            try {
                for (var toAdd_1 = __values(toAdd), toAdd_1_1 = toAdd_1.next(); !toAdd_1_1.done; toAdd_1_1 = toAdd_1.next()) {
                    var item = toAdd_1_1.value;
                    recipes().push(item);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (toAdd_1_1 && !toAdd_1_1.done && (_b = toAdd_1.return)) _b.call(toAdd_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
            recipes.valueHasMutated();
        };
        WfRecipeManagementComponent.prototype.removeSelectedItems = function (selectedItems, recipes) {
            var e_5, _a, e_6, _b;
            var toRemove = [];
            var _loop_4 = function (item) {
                var searchedItem = _.find(selectedItems(), function (x) { return x === item.aliasName; });
                if (!searchedItem) {
                    toRemove.push(item);
                }
            };
            try {
                for (var _c = __values(recipes()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var item = _d.value;
                    _loop_4(item);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_5) throw e_5.error; }
            }
            recipes.valueWillMutate();
            try {
                for (var toRemove_1 = __values(toRemove), toRemove_1_1 = toRemove_1.next(); !toRemove_1_1.done; toRemove_1_1 = toRemove_1.next()) {
                    var item = toRemove_1_1.value;
                    recipes.remove(item);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (toRemove_1_1 && !toRemove_1_1.done && (_b = toRemove_1.return)) _b.call(toRemove_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
            recipes.valueHasMutated();
        };
        WfRecipeManagementComponent.prototype.applySignalBrowserDialog = function () {
            if (this.recipeType() === recipe_model_1.RecipeNamespaces.RecipeDefinition) {
                this.addSelectedItems(this.items, this.recipeDefinitions, function (item) { return { aliasName: item, description: item }; });
                this.removeSelectedItems(this.items, this.recipeDefinitions);
            }
            else {
                this.addSelectedItems(this.items, this.recipes, function (item) { return { aliasName: item, description: item, value: 0 }; });
                this.removeSelectedItems(this.items, this.recipes);
            }
            this.closeSignalBrowserDialog();
        };
        WfRecipeManagementComponent.prototype.onCopySelectedName = function () {
            var _this = this;
            if (this.selectedCloneRecipeDefinitionId() != null) {
                this.newName(_.find(this.cloneRecipeDefinitionItems(), function (item) { return item.ID === _this.selectedCloneRecipeDefinitionId(); }).Name);
            }
        };
        WfRecipeManagementComponent.prototype.applyAddEditDialog = function () {
            return __awaiter(this, void 0, void 0, function () {
                var name;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            name = this.newName();
                            if (name == null || name.replace(/ /g, "").length <= 0) {
                                return [2 /*return*/];
                            }
                            if (!(this.recipeType() === recipe_model_1.RecipeNamespaces.RecipeDefinition)) return [3 /*break*/, 5];
                            this.recipeDefinitionName(name);
                            if (!this.isAddMode()) return [3 /*break*/, 2];
                            this.recipeDefinitionsContent = [];
                            this.recipeDefinitions([]);
                            return [4 /*yield*/, this.createRecipeDefinitioAsync()];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.updateRecipeDefinitioAsync()];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 11];
                        case 5:
                            this.recipeName(name);
                            if (!this.isAddMode()) return [3 /*break*/, 9];
                            this.recipesContent = [];
                            this.recipes([]);
                            if (!this.selectedCloneRecipeDefinitionId()) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.cloneRecipeDefinitioAsync(this.selectedCloneRecipeDefinitionId())];
                        case 6:
                            _a.sent();
                            _a.label = 7;
                        case 7: return [4 /*yield*/, this.createRecipeAsync()];
                        case 8:
                            _a.sent();
                            return [3 /*break*/, 11];
                        case 9: return [4 /*yield*/, this.updateRecipeAsync()];
                        case 10:
                            _a.sent();
                            _a.label = 11;
                        case 11:
                            this.closeAddEditDialog();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.applyDeleteDialog = function () {
            return __awaiter(this, void 0, void 0, function () {
                var id, id, error_16;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            if (!(this.recipeType() === recipe_model_1.RecipeNamespaces.RecipeDefinition)) return [3 /*break*/, 2];
                            id = this.recipeDefinitionId();
                            return [4 /*yield*/, this.recipeDefinitionService.delete(id)];
                        case 1:
                            _a.sent();
                            this.recipeDefinitionId(null);
                            this.recipeDefinitionsContent = [];
                            this.recipeDefinitions([]);
                            this.recipeDefinitionName(null);
                            return [3 /*break*/, 4];
                        case 2:
                            id = this.recipeId();
                            return [4 /*yield*/, this.recipeService.delete(id)];
                        case 3:
                            _a.sent();
                            this.recipeId(null);
                            this.recipesContent = [];
                            this.recipes([]);
                            this.recipeName(null);
                            _a.label = 4;
                        case 4:
                            this.closeDeleteDialog();
                            return [3 /*break*/, 6];
                        case 5:
                            error_16 = _a.sent();
                            this.connector.handleError(WfRecipeManagementComponent)(error_16);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.closeAddEditDialog = function () {
            this.newName("");
            this.showAddEdit(false);
        };
        WfRecipeManagementComponent.prototype.showDeleteDialog = function () {
            this.showDelete(true);
        };
        WfRecipeManagementComponent.prototype.closeDeleteDialog = function () {
            this.showDelete(false);
        };
        WfRecipeManagementComponent.prototype.closeLoadDialog = function () {
            this.showLoad(false);
        };
        WfRecipeManagementComponent.prototype.closeSignalBrowserDialog = function () {
            this.showSignalBrowser(false);
        };
        WfRecipeManagementComponent.prototype.onSave = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.recipeType() === recipe_model_1.RecipeNamespaces.RecipeDefinition)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.updateRecipeDefinitioAsync()];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.updateRecipeAsync()];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.onResetDescriptionRecipeDefinition = function (data) {
            var item = _.find(this.recipeDefinitionsContent, function (item) { return item.aliasName === data.aliasName; });
            this.recipeDefinitions.replace(data, item);
        };
        WfRecipeManagementComponent.prototype.onResetDescriptionRecipe = function (data) {
            var item = _.find(this.recipesContent, function (item) { return item.aliasName === data.aliasName; });
            this.recipes.replace(data, {
                aliasName: data.aliasName,
                description: item.description,
                value: data.value
            });
        };
        WfRecipeManagementComponent.prototype.onResetValueRecipe = function (data) {
            var item = _.find(this.recipesContent, function (item) { return item.aliasName === data.aliasName; });
            this.recipes.replace(data, {
                aliasName: data.aliasName,
                description: data.description,
                value: item.value
            });
        };
        WfRecipeManagementComponent.prototype.onRefresh = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_17;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, , 7]);
                            if (!(this.recipeType() === recipe_model_1.RecipeNamespaces.RecipeDefinition)) return [3 /*break*/, 3];
                            if (!this.recipeDefinitionId()) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getRecipeDefinitioAsync(this.recipeDefinitionId())];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [3 /*break*/, 5];
                        case 3:
                            if (!this.recipeId()) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.getRecipeAsync(this.recipeId())];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            error_17 = _a.sent();
                            this.connector.handleError(WfRecipeManagementComponent)(error_17);
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.onLoadCurrentValue = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var signalValue;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.connector.readSignals([data.aliasName])];
                        case 1:
                            signalValue = _a.sent();
                            if (!signalValue && signalValue.length <= 0)
                                return [2 /*return*/];
                            if (signalValue[0].Result !== 0) {
                                Logger.warnToast(this.connector.translate("I4SCADA_Recipe_signal_read_for_0_failed_1")().format(data.aliasName, signalValue[0].Result));
                            }
                            this.recipes.replace(data, {
                                aliasName: data.aliasName,
                                description: data.description,
                                value: signalValue[0].Value
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.onLoadCurrentValues = function () {
            return __awaiter(this, void 0, void 0, function () {
                var signalNames, signalValues, i, item, value, error_18;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            signalNames = this.recipes().map(function (item) { return item.aliasName; });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.connector.readSignals(signalNames)];
                        case 2:
                            signalValues = _a.sent();
                            for (i = 0; i < this.recipes().length; i++) {
                                item = this.recipes()[i];
                                value = signalValues[i];
                                this.recipes.replace(item, {
                                    aliasName: item.aliasName,
                                    description: item.description,
                                    value: value.Result === 0 ? value.Value : item.value
                                });
                                if (value.Result !== 0) {
                                    Logger.warnToast(this.connector.translate("I4SCADA_Recipe_signal_read_for_0_failed_1")().format(item.aliasName, value.Result));
                                }
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_18 = _a.sent();
                            Logger.handleError(WfRecipeManagementComponent)(this.connector.translate(error_18)());
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //signal browser
        WfRecipeManagementComponent.prototype.populateItems = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getGroupNamesAsync()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.getGroupNamesAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var filter, groupItems, error_19;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, 3, 4]);
                            filter = {
                                ServerNames: [],
                                GroupNames: []
                            };
                            this.isLoading(true);
                            return [4 /*yield*/, SignalsService.getGroupNames(filter, 0, 500)];
                        case 1:
                            groupItems = _a.sent();
                            this.groupItems(groupItems);
                            this.groupItems.unshift({ Name: "*", ID: this.emtyGuid });
                            this.selectedGroupId(this.emtyGuid);
                            this.selectedGroupId.notifySubscribers();
                            return [3 /*break*/, 4];
                        case 2:
                            error_19 = _a.sent();
                            this.connector.handleError(WfRecipeManagementComponent)(error_19);
                            return [3 /*break*/, 4];
                        case 3:
                            this.isLoading(false);
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.addGroup = function () {
            return __awaiter(this, void 0, void 0, function () {
                var filter, signals, _loop_5, this_2, signals_1, signals_1_1, signal, error_20;
                var e_7, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, 3, 4]);
                            filter = {
                                GroupIds: (this.selectedGroupId() && this.selectedGroupId() != this.emtyGuid) ? [this.selectedGroupId()] : [],
                                AliasNames: [],
                                ServerNames: []
                            };
                            this.isLoading(true);
                            return [4 /*yield*/, SignalsService.getSignalNames(filter, 0, this.maxSignalsForGroupAdd)];
                        case 1:
                            signals = _b.sent();
                            this.items.valueWillMutate();
                            _loop_5 = function (signal) {
                                var signalItem = _.find(this_2.signalItems(), function (x) { return x.item.Name === signal.Name; });
                                if (signalItem) {
                                    signalItem.selected(true);
                                }
                                if (_.find(this_2.items(), function (x) { return x === signal.Name; })) {
                                    return "continue";
                                }
                                this_2.items.push(signal.Name);
                            };
                            this_2 = this;
                            try {
                                for (signals_1 = __values(signals), signals_1_1 = signals_1.next(); !signals_1_1.done; signals_1_1 = signals_1.next()) {
                                    signal = signals_1_1.value;
                                    _loop_5(signal);
                                }
                            }
                            catch (e_7_1) { e_7 = { error: e_7_1 }; }
                            finally {
                                try {
                                    if (signals_1_1 && !signals_1_1.done && (_a = signals_1.return)) _a.call(signals_1);
                                }
                                finally { if (e_7) throw e_7.error; }
                            }
                            this.items.valueHasMutated();
                            return [3 /*break*/, 4];
                        case 2:
                            error_20 = _b.sent();
                            this.connector.handleError(WfRecipeManagementComponent)(error_20);
                            return [3 /*break*/, 4];
                        case 3:
                            this.isLoading(false);
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.isSignalSelected = function (item) {
            var signal = _.find(this.items(), function (x) { return x === item.Name; });
            return !!signal;
        };
        WfRecipeManagementComponent.prototype.removeItem = function (signalName) {
            var item = _.find(this.items(), function (signal) { return signal === signalName; });
            if (item) {
                this.items.remove(item);
            }
        };
        WfRecipeManagementComponent.prototype.addItem = function (signalName) {
            if (_.find(this.items(), function (signal) { return signal === signalName; })) {
                return;
            }
            this.items.push(signalName);
        };
        WfRecipeManagementComponent.prototype.showExportDialog = function () {
            var content;
            var name = "export";
            if (this.recipeType() === recipe_model_1.RecipeNamespaces.RecipeDefinition) {
                name = this.recipeDefinitionName();
                content = {
                    name: name,
                    type: recipe_model_1.RecipeNamespaces.RecipeDefinition,
                    data: this.recipeDefinitionsContent
                };
            }
            else {
                name = this.recipeName();
                content = {
                    name: name,
                    type: recipe_model_1.RecipeNamespaces.Recipe,
                    data: this.recipesContent,
                };
            }
            try {
                this.recipeJSONService.download(JSON.stringify(content), name);
            }
            catch (error) {
                this.connector.handleError(WfRecipeManagementComponent)(error);
            }
        };
        WfRecipeManagementComponent.prototype.showImportDialog = function () {
            this.showImport(true);
        };
        WfRecipeManagementComponent.prototype.closeImportDialog = function () {
            this.showImport(false);
        };
        WfRecipeManagementComponent.prototype.applyImportDialog = function () {
            return __awaiter(this, void 0, void 0, function () {
                var inputElementId, configurations, configurations_1, configurations_1_1, configuration, parsedConfiguration, e_8_1, error_21;
                var e_8, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            inputElementId = "input-" + ko.unwrap(this.id);
                            if (!inputElementId) {
                                return [2 /*return*/];
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 11, , 12]);
                            return [4 /*yield*/, this.recipeJSONService.load(inputElementId)];
                        case 2:
                            configurations = _b.sent();
                            this.selectedFiles([]);
                            _b.label = 3;
                        case 3:
                            _b.trys.push([3, 8, 9, 10]);
                            configurations_1 = __values(configurations), configurations_1_1 = configurations_1.next();
                            _b.label = 4;
                        case 4:
                            if (!!configurations_1_1.done) return [3 /*break*/, 7];
                            configuration = configurations_1_1.value;
                            parsedConfiguration = JSON.parse(configuration);
                            return [4 /*yield*/, this.processImport(parsedConfiguration)];
                        case 5:
                            _b.sent();
                            _b.label = 6;
                        case 6:
                            configurations_1_1 = configurations_1.next();
                            return [3 /*break*/, 4];
                        case 7: return [3 /*break*/, 10];
                        case 8:
                            e_8_1 = _b.sent();
                            e_8 = { error: e_8_1 };
                            return [3 /*break*/, 10];
                        case 9:
                            try {
                                if (configurations_1_1 && !configurations_1_1.done && (_a = configurations_1.return)) _a.call(configurations_1);
                            }
                            finally { if (e_8) throw e_8.error; }
                            return [7 /*endfinally*/];
                        case 10:
                            this.closeImportDialog();
                            return [3 /*break*/, 12];
                        case 11:
                            error_21 = _b.sent();
                            this.connector.handleError(WfRecipeManagementComponent)(error_21);
                            return [3 /*break*/, 12];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.processImport = function (parsedConfiguration) {
            return __awaiter(this, void 0, void 0, function () {
                var hasConfiguration, hasConfiguration;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!parsedConfiguration) {
                                Logger.warnToast(this.connector.translate("I4SCADA_Configuration_is_empty")());
                                return [2 /*return*/];
                            }
                            if (!parsedConfiguration.name) {
                                Logger.warnToast(this.connector.translate("I4SCADA_No_configuration_name_is_set")());
                                return [2 /*return*/];
                            }
                            if (!parsedConfiguration.data && parsedConfiguration.data <= 0) {
                                Logger.warnToast(this.connector.translate("I4SCADA_Configuration_data_is_empty")());
                                return [2 /*return*/];
                            }
                            if (!parsedConfiguration.type) {
                                Logger.warnToast(this.connector.translate("I4SCADA_No_configuration_type_is_set")());
                                return [2 /*return*/];
                            }
                            if (!(this.recipeType() === recipe_model_1.RecipeNamespaces.RecipeDefinition)) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.recipeDefinitionService.getByName(parsedConfiguration.name)];
                        case 1:
                            hasConfiguration = _a.sent();
                            if (parsedConfiguration.type !== recipe_model_1.RecipeNamespaces.RecipeDefinition) {
                                Logger.warnToast(this.connector.translate("I4SCADA_Configuration_type_is_not_valid")());
                                return [2 /*return*/];
                            }
                            if (!!hasConfiguration) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.recipeDefinitionService.create(parsedConfiguration.name, JSON.stringify(parsedConfiguration.data))];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 3:
                            if (!this.overwriteConfigurationOnImport()) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.recipeDefinitionService.update(hasConfiguration.ID, parsedConfiguration.name, JSON.stringify(parsedConfiguration.data))];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            Logger.warnToast(this.connector.translate("I4SCADA_A_configuration_already_exsists")());
                            return [2 /*return*/];
                        case 6: return [3 /*break*/, 13];
                        case 7: return [4 /*yield*/, this.recipeService.getByName(parsedConfiguration.name)];
                        case 8:
                            hasConfiguration = _a.sent();
                            if (parsedConfiguration.type !== recipe_model_1.RecipeNamespaces.Recipe) {
                                Logger.warnToast(this.connector.translate("I4SCADA_Configuration_type_is_not_valid")());
                                return [2 /*return*/];
                            }
                            if (!!hasConfiguration) return [3 /*break*/, 10];
                            return [4 /*yield*/, this.recipeService.create(parsedConfiguration.name, JSON.stringify(parsedConfiguration.data))];
                        case 9:
                            _a.sent();
                            return [3 /*break*/, 13];
                        case 10:
                            if (!this.overwriteConfigurationOnImport()) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.recipeService.update(hasConfiguration.ID, parsedConfiguration.name, JSON.stringify(parsedConfiguration.data))];
                        case 11:
                            _a.sent();
                            return [3 /*break*/, 13];
                        case 12:
                            Logger.warnToast(this.connector.translate("I4SCADA_A_configuration_already_exsists")());
                            return [2 /*return*/];
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeManagementComponent.prototype.onFile = function () {
            document.getElementById("input-" + ko.unwrap(this.id)).click();
        };
        WfRecipeManagementComponent.prototype.onChangeFile = function (obj, event) {
            this.selectedFiles([]);
            if (event.target.files) {
                var files = _.map(event.target.files, function (file) { return file.name; });
                this.selectedFiles(files);
            }
        };
        WfRecipeManagementComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var dialogAddEdit, dialogConcatenateRecipe, dialogDeleteRecipe, dialogLoadRecipe, dialogRecipeSignal, dialogImport;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.nameValidationSubscription.dispose();
                            return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            dialogAddEdit = document.getElementById('modal-add-edit-recipe-name-' + ko.unwrap(this.id));
                            dialogConcatenateRecipe = document.getElementById('modal-concatenate-recipe-definitions-' + ko.unwrap(this.id));
                            dialogDeleteRecipe = document.getElementById('modal-delete-recipe-' + ko.unwrap(this.id));
                            dialogLoadRecipe = document.getElementById('modal-load-recipe-' + ko.unwrap(this.id));
                            dialogRecipeSignal = document.getElementById('modal-recipe-signal-browser-' + ko.unwrap(this.id));
                            dialogImport = document.getElementById('modal-recipe-import-' + ko.unwrap(this.id));
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
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfRecipeManagementComponent;
    }(ComponentBaseModel));
    return WfRecipeManagementComponent;
});
//# sourceMappingURL=wf-recipe-management.component.js.map