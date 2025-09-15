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
define(["require", "exports", "../component-base.model", "../services/recipe.service", "../services/secured.service", "../../services/silverlightToolsService", "../../services/logger"], function (require, exports, ComponentBaseModel, RecipeService, SecuredService, SilverlightToolsService, Logger) {
    "use strict";
    var WfRecipeComponent = /** @class */ (function (_super) {
        __extends(WfRecipeComponent, _super);
        function WfRecipeComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.recipeService = new RecipeService();
            _this.recipes = ko.observableArray([]);
            _this.selectedId = ko.observable(null);
            _this.isLoading = ko.observable(false);
            _this.writableRecipeConfiguration = null;
            _this.onWritesuccessCalback = function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.logUserActivity(this.writableRecipeConfiguration.ID, this.writableRecipeConfiguration.Name)];
                        case 1:
                            _a.sent();
                            Logger.successToast(this.connector.translate("I4SCADA_Recipe_written")());
                            return [2 /*return*/];
                    }
                });
            }); };
            _this.initializeComputeds();
            _this.initializeWriteSecure();
            _this.populateItems();
            return _this;
        }
        WfRecipeComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.isOnlyOwnConfig = ko.observable(ko.unwrap(this.settings.showOnlyOwnConfigurations) !== undefined ? ko.unwrap(this.settings.showOnlyOwnConfigurations) : false);
            this.recipeName = ko.observable(ko.unwrap(this.settings.recipeName) !== undefined ? ko.unwrap(this.settings.recipeName) : null);
            this.saveButtonVisibility = ko.observable(ko.unwrap(this.settings.saveButtonVisibility) !== undefined ? ko.unwrap(this.settings.saveButtonVisibility) : true);
            this.writeButtonVisibility = ko.observable(ko.unwrap(this.settings.writeButtonVisibility) !== undefined ? ko.unwrap(this.settings.writeButtonVisibility) : true);
            this.receipeButtonVisibility = ko.observable(ko.unwrap(this.settings.receipeButtonVisibility) !== undefined ? ko.unwrap(this.settings.receipeButtonVisibility) : true);
            this.refreshButtonVisibility = ko.observable(ko.unwrap(this.settings.refreshButtonVisibility) !== undefined ? ko.unwrap(this.settings.refreshButtonVisibility) : true);
            this.initializeAdditionalSecurity();
        };
        WfRecipeComponent.prototype.onRefreshAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.populateItems()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeComponent.prototype.initializeWriteSecure = function () {
            this.writeSecure = ko.unwrap(this.settings.writeSecure) !== undefined ? ko.unwrap(this.settings.writeSecure) : false;
            this.writeSecureValues = ko.observable();
            this.signalNames = ko.observable();
            this.showWriteSecure = ko.observable(false);
        };
        WfRecipeComponent.prototype.initializeAdditionalSecurity = function () {
            this.projectAuthorizationWrite = (ko.unwrap(this.settings.projectAuthorizationWrite) || "").stringPlaceholderResolver(this.objectID);
            this.projectAuthorizationSave = (ko.unwrap(this.settings.projectAuthorizationSave) || "").stringPlaceholderResolver(this.objectID);
            this.projectAuthorizationSelection = (ko.unwrap(this.settings.projectAuthorizationSelection) || "").stringPlaceholderResolver(this.objectID);
            this.securedServiceWrite = new SecuredService(this.projectAuthorizationWrite);
            this.hasAuthorizationWrite = this.securedServiceWrite.hasAuthorization;
            this.securedServiceSave = new SecuredService(this.projectAuthorizationSave);
            this.hasAuthorizationSave = this.securedServiceSave.hasAuthorization;
            this.securedServiceSelection = new SecuredService(this.projectAuthorizationSelection);
            this.hasAuthorizationSelection = this.securedServiceSelection.hasAuthorization;
        };
        WfRecipeComponent.prototype.writeInputValueSecure = function (values, signalNames) {
            this.writeSecureValues(values);
            this.signalNames(signalNames);
            this.showWriteSecure(true);
        };
        WfRecipeComponent.prototype.populateItems = function () {
            return __awaiter(this, void 0, void 0, function () {
                var items, item, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, 3, 4]);
                            this.isLoading(true);
                            return [4 /*yield*/, this.recipeService.list()];
                        case 1:
                            items = _a.sent();
                            this.recipes(items);
                            this.selectedId(null);
                            if (this.recipeName) {
                                item = _.find(this.recipes(), function (x) { return x.Name === _this.recipeName(); });
                                if (!item) {
                                    this.isLoading(false);
                                    return [2 /*return*/];
                                }
                                this.selectedId(item.ID);
                            }
                            return [3 /*break*/, 4];
                        case 2:
                            error_1 = _a.sent();
                            this.connector.handleError(WfRecipeComponent)(error_1);
                            return [3 /*break*/, 4];
                        case 3:
                            this.isLoading(false);
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeComponent.prototype.initializeComputeds = function () {
            var _this = this;
            this.recipesItems = ko.computed(function () {
                if (_this.isOnlyOwnConfig())
                    return _this.recipes().filter(function (data) {
                        return data.Owner === _this.connector.currentLoggedInUser();
                    });
                return _this.recipes();
            });
        };
        WfRecipeComponent.prototype.getRecipeConfigurationAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var recipeConfiguration, id;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            recipeConfiguration = null;
                            id = this.selectedId();
                            if (!id) {
                                Logger.warnToast(this.connector.translate("I4SCADA_No_recipe_selected")());
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.recipeService.getById(id)];
                        case 1:
                            recipeConfiguration = _a.sent();
                            if (!recipeConfiguration) {
                                Logger.warnToast(this.connector.translate("I4SCADA_Selected_recipe_not_defined")());
                                return [2 /*return*/];
                            }
                            return [2 /*return*/, recipeConfiguration];
                    }
                });
            });
        };
        WfRecipeComponent.prototype.onWriterRcipeAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var recipeConfiguration, _a, recipes, values, recipes_1, recipes_1_1, item, signalNames, signalsValues, recipes_2, recipes_2_1, item, result, error_2;
                var e_1, _b, e_2, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            this.isLoading(true);
                            this.writableRecipeConfiguration = null;
                            _a = this;
                            return [4 /*yield*/, this.getRecipeConfigurationAsync()];
                        case 1:
                            recipeConfiguration = _a.writableRecipeConfiguration = _d.sent();
                            recipes = null;
                            try {
                                recipes = JSON.parse(recipeConfiguration.Content);
                            }
                            catch (error) {
                                Logger.handleError(WfRecipeComponent)(this.connector.translate("I4SCADA_Could_not_parse_configuration")());
                            }
                            if (!recipes && recipes.length <= 0) {
                                Logger.warnToast(this.connector.translate("I4SCADA_Selected_recipe_not_defined")());
                                this.isLoading(false);
                                return [2 /*return*/];
                            }
                            values = {};
                            try {
                                for (recipes_1 = __values(recipes), recipes_1_1 = recipes_1.next(); !recipes_1_1.done; recipes_1_1 = recipes_1.next()) {
                                    item = recipes_1_1.value;
                                    values[item.aliasName] = item.value;
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (recipes_1_1 && !recipes_1_1.done && (_b = recipes_1.return)) _b.call(recipes_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            if (!this.writeSecure) return [3 /*break*/, 2];
                            signalNames = [];
                            signalsValues = [];
                            try {
                                for (recipes_2 = __values(recipes), recipes_2_1 = recipes_2.next(); !recipes_2_1.done; recipes_2_1 = recipes_2.next()) {
                                    item = recipes_2_1.value;
                                    signalNames.push(item.aliasName);
                                    signalsValues.push(item.value);
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (recipes_2_1 && !recipes_2_1.done && (_c = recipes_2.return)) _c.call(recipes_2);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            Logger.infoToast(this.connector.translate("I4SCADA_Writing_recipe_0")().format(recipeConfiguration.Name));
                            this.writeInputValueSecure(signalNames, signalsValues);
                            return [3 /*break*/, 5];
                        case 2:
                            _d.trys.push([2, 4, , 5]);
                            Logger.infoToast(this.connector.translate("I4SCADA_Writing_recipe_0")().format(recipeConfiguration.Name));
                            return [4 /*yield*/, this.connector.writeSignals(values)];
                        case 3:
                            result = _d.sent();
                            if (!result.successful) {
                                this.connector.error("Signal write", result.errorMessage);
                            }
                            else {
                                this.onWritesuccessCalback();
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            error_2 = _d.sent();
                            this.connector.handleError(WfRecipeComponent)(error_2);
                            return [3 /*break*/, 5];
                        case 5:
                            this.isLoading(false);
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeComponent.prototype.logUserActivity = function (id, name) {
            return __awaiter(this, void 0, void 0, function () {
                var logResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, SilverlightToolsService.logUserActivity({
                                ActionText: "I4SCADA_RecipeWritten",
                                AffectedEntityID: id,
                                AffectedEntityName: name,
                                AffectedEntityType: 1
                            })];
                        case 1:
                            logResult = _a.sent();
                            if (logResult != true) {
                                this.connector.warn("Signal write", "Could not log user activity");
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfRecipeComponent.prototype.onSetRcipeAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var recipeConfiguration, recipes, signalNames, signalValues, newRecipe, i, item, value, error_3, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.isLoading(true);
                            return [4 /*yield*/, this.getRecipeConfigurationAsync()];
                        case 1:
                            recipeConfiguration = _a.sent();
                            recipes = null;
                            try {
                                recipes = JSON.parse(recipeConfiguration.Content);
                            }
                            catch (error) {
                                Logger.handleError(WfRecipeComponent)(this.connector.translate("I4SCADA_Could_not_parse_configuration")());
                            }
                            if (!recipes && recipes.length <= 0) {
                                Logger.warnToast(this.connector.translate("I4SCADA_Selected_recipe_not_defined")());
                                this.isLoading(false);
                                return [2 /*return*/];
                            }
                            signalNames = recipes.map(function (item) { return item.aliasName; });
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 8, , 9]);
                            return [4 /*yield*/, this.connector.readSignals(signalNames)];
                        case 3:
                            signalValues = _a.sent();
                            newRecipe = [];
                            for (i = 0; i < recipes.length; i++) {
                                item = recipes[i];
                                value = signalValues[i];
                                newRecipe.push({
                                    aliasName: item.aliasName,
                                    description: item.description,
                                    value: value.Result === 0 ? value.Value : item.value
                                });
                                if (value.Result !== 0) {
                                    Logger.warnToast(this.connector.translate("I4SCADA_Recipe_signal_read_for_0_failed_1}")().format(item.aliasName, value.Result));
                                }
                            }
                            _a.label = 4;
                        case 4:
                            _a.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, this.recipeService.update(recipeConfiguration.ID, recipeConfiguration.Name, JSON.stringify(newRecipe))];
                        case 5:
                            _a.sent();
                            Logger.successToast(this.connector.translate("I4SCADA_Recipe_updated")());
                            return [3 /*break*/, 7];
                        case 6:
                            error_3 = _a.sent();
                            Logger.handleError(WfRecipeComponent)(this.connector.translate("I4SCADA_Could_not_update_configuration")());
                            return [3 /*break*/, 7];
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            error_4 = _a.sent();
                            Logger.handleError(WfRecipeComponent)(this.connector.translate(error_4)());
                            return [3 /*break*/, 9];
                        case 9:
                            this.isLoading(false);
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfRecipeComponent;
    }(ComponentBaseModel));
    return WfRecipeComponent;
});
//# sourceMappingURL=wf-recipe.component.js.map