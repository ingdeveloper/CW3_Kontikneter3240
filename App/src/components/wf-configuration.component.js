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
define(["require", "exports", "./component-base.model", "./services/standalone-parameters-replacement.service"], function (require, exports, ComponentBaseModel, StandaloneParametersReplacementService) {
    "use strict";
    var WfConfigurationComponent = /** @class */ (function (_super) {
        __extends(WfConfigurationComponent, _super);
        function WfConfigurationComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.initializeComputeds();
            _this.getConfigurations();
            return _this;
        }
        WfConfigurationComponent.prototype.initializeSettings = function () {
            var _this = this;
            _super.prototype.initializeSettings.call(this);
            //#region public options
            this.showOnlyOwnConfigurations = this.settings.showOnlyOwnConfigurations !== undefined ? this.settings.showOnlyOwnConfigurations : false;
            this.checkUser = this.settings.checkUser !== undefined ? this.settings.checkUser : true;
            this.controlType = this.settings.controlType ? this.settings.controlType : -1;
            this.namespace = ko.observable(this.settings.namespace ? this.settings.namespace : "");
            this.namespace.subscribe(function () {
                _this.getConfigurations();
            }, this);
            this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
            this.selectedRowCssClass = ko.unwrap(this.settings.selectedRowCssClass) || "danger";
            this.operationButtonCssClass = ko.unwrap(this.settings.operationButtonCssClass) || "btn btn-primary";
            this.buttonBarIconClass = ko.unwrap(this.settings.buttonBarIconClass) || "wf wf-cog";
            this.tableMaxHeight = ko.unwrap(this.settings.tableMaxHeight) || 300;
            //#region private options
            this.isLoading = ko.observable(false);
            this.configurations = ko.observableArray([]);
            this.showConfig = ko.observable(false);
            this.showError = ko.observable(false);
            this.isOnlyMeConfig = ko.observable(this.showOnlyOwnConfigurations);
            this.selectedConfig = ko.observable();
            this.selectedConfigName = ko.observable("");
            this.TextError = ko.observable("");
            this.showYesNoButtonOnError = ko.observable(false);
            this.callbakWhenYesClick = null;
            this.callbakWhenNoClick = null;
            this.isSaveTab = ko.observable(false);
            this.isLoadTab = ko.observable(false);
            this.isDeleteTab = ko.observable(false);
            this.canLoadConfigurations = ko.observable(true);
            this.standaloneParametersReplacementService = new StandaloneParametersReplacementService(this.settings);
            this.isButtonDisabled = ko.computed(function () {
                return _this.isLoading() || (_this.settings.isDataLoading && _this.settings.isDataLoading());
            });
        };
        WfConfigurationComponent.prototype.initializeComputeds = function () {
            var _this = this;
            this.isShowTable = ko.computed(function () {
                return _this.isLoadTab() || _this.isDeleteTab();
            });
            this.configurationItems = ko.computed(function () {
                if (_this.isOnlyMeConfig())
                    return _this.configurations().filter(function (data) {
                        return data.Owner === _this.connector.currentLoggedInUser();
                    });
                return _this.configurations();
            });
            this.isSaveButtonEnabled = ko.computed(function () {
                return _this.selectedConfigName() && _this.selectedConfigName().replace(/ /g, '');
            });
        };
        WfConfigurationComponent.prototype.showConfigPopup = function () {
            //  $('#wf-config-dialog-' + ko.unwrap(this.id) + ' .nav-tabs a[role=tab]:first').tab('show');
            this.tabClick(0);
            this.showConfigPopupInner(true);
        };
        WfConfigurationComponent.prototype.showConfigPopupInner = function (value) {
            if (value === void 0) { value = true; }
            this.showConfig(value);
        };
        WfConfigurationComponent.prototype.closeConfigPopup = function () {
            this.showConfig(false);
            this.showError(false);
            this.selectedConfig(null);
            this.selectedConfigName(null);
        };
        WfConfigurationComponent.prototype.showErrorDialog = function (errorText, showYesNoButton, callbakWhenYesClick, callbakWhenNoClick) {
            this.showConfig(false);
            this.showError(true);
            this.TextError(errorText);
            this.showYesNoButtonOnError(showYesNoButton === undefined ? false : showYesNoButton);
            this.callbakWhenYesClick = callbakWhenYesClick;
            this.callbakWhenNoClick = callbakWhenNoClick;
        };
        WfConfigurationComponent.prototype.closeErrorDialog = function () {
            this.showError(false);
            this.TextError("");
            if (this.callbakWhenNoClick)
                this.callbakWhenNoClick();
        };
        WfConfigurationComponent.prototype.errorYes = function () {
            this.closeErrorDialog();
            if (this.callbakWhenYesClick)
                this.callbakWhenYesClick();
        };
        WfConfigurationComponent.prototype.saveNewConfig = function () {
            return __awaiter(this, void 0, void 0, function () {
                var existingsConfig, config, result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            existingsConfig = _.findWhere(this.configurations(), { Name: this.selectedConfigName() });
                            if (existingsConfig) {
                                this.closeConfigPopup();
                                this.selectConfig(existingsConfig);
                                this.updateConfig();
                                return [2 /*return*/];
                            }
                            config = {};
                            config.ID = uuid.v4();
                            config.Name = this.selectedConfigName();
                            config.Namespace = this.namespace();
                            config.CreatedOn = moment.utc().toMSDate();
                            config.Version = 0;
                            config.ControlType = this.controlType;
                            config.Owner = this.connector.currentLoggedInUser();
                            config.Content = ko.toJSON(this.settings.getConfiguration ? this.settings.getConfiguration() : "");
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.connector.insertControlConfiguration(config)];
                        case 2:
                            result = _a.sent();
                            this.closeConfigPopup();
                            this.getConfigurations();
                            this.selectedConfigName(null);
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            this.connector.handleError(this)(error_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfConfigurationComponent.prototype.updateConfig = function () {
            var _this = this;
            if (this.checkUser) {
                if (this.selectedConfig().Owner && this.selectedConfig().Owner !== this.connector.currentLoggedInUser()) {
                    this.showErrorDialog(this.connector.translate('I4SCADA_No_Permission_Overwrite_Other_Users_Configuration')(), null, null, this.showConfigPopupInner);
                    return;
                }
            }
            this.showErrorDialog(this.connector.translate('I4SCADA_Overwrite_Configuration_Confirmation')(), true, function () { return __awaiter(_this, void 0, void 0, function () {
                var config, result, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            config = {};
                            config.ID = this.selectedConfig().ID;
                            config.Name = this.selectedConfigName();
                            config.Namespace = this.selectedConfig().Namespace;
                            config.CreatedOn = moment.utc().toMSDate();
                            config.Version = this.selectedConfig().Version;
                            config.ControlType = this.controlType;
                            config.Owner = this.connector.currentLoggedInUser() || this.selectedConfig().Owner;
                            config.Content = ko.toJSON(this.settings.getConfiguration ? this.settings.getConfiguration() : "");
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.connector.updateControlConfiguration(config)];
                        case 2:
                            result = _a.sent();
                            this.closeConfigPopup();
                            this.getConfigurations();
                            this.selectedConfig(null);
                            this.selectedConfigName(null);
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            this.connector.handleError(this)(error_2);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); }, this.showConfigPopupInner);
        };
        WfConfigurationComponent.prototype.loadConfig = function (data, event) {
            event.stopPropagation();
            if (!this.canLoadConfigurations()) {
                return;
            }
            this.canLoadConfigurations(false);
            if (ko.unwrap(this.settings.loadConfiguration)) {
                var configuration = this.standaloneParametersReplacementService.replaceConfigurationParameters(data.Content);
                this.settings.loadConfiguration(JSON.parse(configuration), data);
            }
            this.canLoadConfigurations(true);
            this.closeConfigPopup();
        };
        WfConfigurationComponent.prototype.selectConfig = function (data) {
            if (!this.isSaveTab())
                return;
            this.selectedConfig(data);
            this.selectedConfigName(data.Name);
        };
        WfConfigurationComponent.prototype.removeConfig = function (data, event) {
            var _this = this;
            event.stopPropagation();
            //this.selectConfig(data);
            if (this.checkUser) {
                if (data.Owner && data.Owner !== this.connector.currentLoggedInUser()) {
                    this.showErrorDialog(this.connector.translate('I4SCADA_No_Permission_Delete_Other_Users_Configuration')(), null, null, this.showConfigPopupInner);
                    return;
                }
            }
            this.showErrorDialog(this.connector.translate('I4SCADA_Delete_Configuration_Confirmation')(), true, function () { return __awaiter(_this, void 0, void 0, function () {
                var result, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.connector.deleteControlConfiguration(data.ID)];
                        case 1:
                            result = _a.sent();
                            this.getConfigurations();
                            this.showConfigPopupInner();
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            this.connector.handleError(this)(error_3);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); }, this.showConfigPopupInner);
        };
        WfConfigurationComponent.prototype.getConfigurations = function () {
            return __awaiter(this, void 0, void 0, function () {
                var configs, tmp, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.isLoading(true);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.connector.getControlConfigurationsByNamespace(this.namespace(), this.controlType)];
                        case 2:
                            configs = _a.sent();
                            tmp = [];
                            configs.forEach(function (current, index, array) {
                                var result = {};
                                result.ID = current.ID;
                                result.Name = current.Name;
                                result.Namespace = current.Namespace;
                                result.CreatedOn = moment(current.CreatedOn).local().toISOString();
                                result.UserId = current.UserId;
                                result.Content = current.Content;
                                result.Version = current.Version;
                                result.ControlType = current.ControlType;
                                result.Owner = current.Owner;
                                tmp.push(result);
                            });
                            this.configurations(tmp);
                            this.isLoading(false);
                            return [3 /*break*/, 4];
                        case 3:
                            error_4 = _a.sent();
                            this.isLoading(false);
                            this.connector.handleError(this)(error_4);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfConfigurationComponent.prototype.tabClick = function (tabID) {
            //0 - saveTab
            //1 - loadTab
            //2 - deleteTab
            this.isSaveTab(tabID === 0);
            this.isLoadTab(tabID === 1);
            this.isDeleteTab(tabID === 2);
            this.selectedConfig(null);
            this.selectedConfigName(null);
        };
        WfConfigurationComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var configDialog, configBackContainer, errorDialog, errorBackContainer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            configDialog = $(document).find('#wf-config-dialog-' + ko.unwrap(this.id));
                            configBackContainer = $(document).find('#wf-config-dialog-back-container-' + ko.unwrap(this.id));
                            errorDialog = $(document).find('#wf-config-error-dialog-' + ko.unwrap(this.id));
                            errorBackContainer = $(document).find('#wf-config-error-dialog-back-container-' + ko.unwrap(this.id));
                            configDialog.remove();
                            configBackContainer.remove();
                            errorDialog.remove();
                            errorBackContainer.remove();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfConfigurationComponent;
    }(ComponentBaseModel));
    return WfConfigurationComponent;
});
//# sourceMappingURL=wf-configuration.component.js.map