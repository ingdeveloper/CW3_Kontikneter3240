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
define(["require", "exports", "../services/secured.service", "../../services/signalsService", "../../services/connectorEnums", "../component-base.model", "../services/standalone-parameters-replacement.service"], function (require, exports, SecuredService, SignalsService, connectorEnums_1, ComponentBaseModel, StandaloneParametersReplacementService) {
    "use strict";
    var WfSignalListComponent = /** @class */ (function (_super) {
        __extends(WfSignalListComponent, _super);
        function WfSignalListComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.groupItems = ko.observableArray([]);
            _this.selectedGroupId = ko.observable(null);
            _this.signalItems = ko.observableArray([]);
            _this.pattern = ko.observable("");
            _this.delayedPattern = ko.computed(_this.pattern).extend({ throttle: 500 });
            _this.hasMoreSignals = ko.observable(false);
            _this.isLoading = ko.observable(false);
            _this.getSignalNamesAsync = function () { return __awaiter(_this, void 0, void 0, function () {
                var pattern, filter, signalItems, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            pattern = _.any(this.signalsFilter) ? "" : "*" + this.pattern() + "*";
                            filter = {
                                ServerNames: [],
                                AliasNames: [pattern].concat(this.signalsFilter),
                                GroupIds: this.selectedGroupId() ? [this.selectedGroupId()] : []
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
                            this.connector.error(WfSignalListComponent, error_1);
                            return [3 /*break*/, 5];
                        case 4:
                            this.isLoading(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            }); };
            _this.onSignalClicked = function (item) {
                _this.addItem(item.item.Name);
                _this.setSelceted();
            };
            _this.initializeComputeds();
            _this.populateItems();
            return _this;
        }
        WfSignalListComponent.prototype.populateItems = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getGroupNamesAsync()];
                        case 1:
                            _a.sent();
                            //await this.getSignalNamesAsync();
                            return [4 /*yield*/, this.loadInitialConfigurationAsync()];
                        case 2:
                            //await this.getSignalNamesAsync();
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfSignalListComponent.prototype.initializeSettings = function () {
            var _this = this;
            _super.prototype.initializeSettings.call(this);
            this.standaloneParametersReplacementService = new StandaloneParametersReplacementService(this.settings);
            this.showDialog = ko.observable(false);
            this.controlType = connectorEnums_1.ConfigControlType.SignalList;
            this.items = ko.observableArray();
            this.filtersChanged = ko.observable(false);
            this.isAlphanumeric = ko.observable(false);
            this.signals = ko.observableArray();
            //#region configuration project authorization
            this.configurationProjectAuthorization = (ko.unwrap(this.settings.configurationProjectAuthorization) || "").stringPlaceholderResolver(this.objectID);
            this.configurationSecuredService = new SecuredService(this.configurationProjectAuthorization);
            this.hasConfigurationAuthorization = this.configurationSecuredService.hasAuthorization;
            //#endregion
            //#region signal selection project authorization
            this.signalSelectionProjectAuthorization = (ko.unwrap(this.settings.signalSelectionProjectAuthorization) || "").stringPlaceholderResolver(this.objectID);
            this.signalSecuredService = new SecuredService(this.signalSelectionProjectAuthorization);
            this.hasSignalSelectionAuthorization = this.signalSecuredService.hasAuthorization;
            //#endregion
            this.showOnlyOwnConfigurations = this.settings.showOnlyOwnConfigurations !== undefined ? this.settings.showOnlyOwnConfigurations : false;
            this.configurationButtonVisibility = ko.unwrap(this.settings.configurationButtonVisibility) !== undefined ? ko.unwrap(this.settings.configurationButtonVisibility) : true;
            this.signalsButtonVisibility = ko.unwrap(this.settings.signalsButtonVisibility) !== undefined ? ko.unwrap(this.settings.signalsButtonVisibility) : true;
            this.initialConfiguration = (ko.unwrap(this.settings.initialConfiguration) || "").stringPlaceholderResolver(this.objectID);
            this.configurationNamespace = (ko.unwrap(this.settings.configurationNamespace) || "").stringPlaceholderResolver(this.objectID);
            this.configurationButtonIconClass = ko.unwrap(this.settings.configurationButtonIconClass);
            this.signalNamePatterns = this.resolveObjectIds(this.settings.signalNamePatterns || []);
            this.tooltipText = (ko.unwrap(this.connector.translate(this.settings.tooltipText)()) || "").stringPlaceholderResolver(this.objectID);
            this.signalsFilter = _.map(ko.unwrap(this.settings.signalsFilter) || [], function (item) { return (item || "").stringPlaceholderResolver(_this.objectID); });
            this.groupsFilter = _.map(ko.unwrap(this.settings.groupsFilter) || [], function (item) { return (item || "").stringPlaceholderResolver(_this.objectID); });
            this.title = (ko.unwrap(this.settings.title) || "").stringPlaceholderResolver(this.objectID);
            this.format = ko.unwrap(this.settings.format) || '0,0.[00]';
            this.valueDisplayClass = ko.unwrap(this.settings.valueDisplayClass) || "label-info";
            this.addButtonCssClass = ko.unwrap(this.settings.addButtonCssClass) || "btn btn-success";
            this.listButtonCssClass = ko.unwrap(this.settings.listButtonCssClass) || "btn btn-default";
            this.listValidationCssClass = ko.unwrap(this.settings.listValidationCssClass) || "btn btn-info";
            this.listTemplate = ko.unwrap(this.settings.listTemplate) || "wf-value-display"; //Available options are: wf-value-display, wf-value, wf-signal-information, wf-input 
            this.maxSignalCount = ko.unwrap(this.settings.maxSignalCount) !== undefined ? ko.unwrap(this.signalsFilter.length || this.settings.maxSignalCount) : 50;
            this.maxSignalsForGroupAdd = ko.unwrap(this.settings.maxSignalsForGroupAdd) !== undefined ? ko.unwrap(this.settings.maxSignalsForGroupAdd) : 500;
        };
        WfSignalListComponent.prototype.initializeComputeds = function () {
            var _this = this;
            this.hasData = ko.computed(function () {
                return ko.unwrap(_this.signals) && ko.unwrap(_this.signals).length > 0;
            });
            this.showControlBar = ko.computed(function () {
                return _this.title || _this.configurationButtonVisibility || _this.signalsButtonVisibility;
            }, this);
            this.signalFilterText = ko.unwrap(this.settings.signalFilterText) || "AliasName";
            this.signalInformationColumns = this.getSignalInformationColumns();
            this.delayedPattern.subscribe(this.getSignalNamesAsync);
            this.selectedGroupId.subscribe(this.getSignalNamesAsync);
        };
        WfSignalListComponent.prototype.setSelceted = function () {
            var e_1, _a;
            try {
                for (var _b = __values(this.signalItems()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var item = _c.value;
                    item.selected(this.isSignalSelected(item.item));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        WfSignalListComponent.prototype.isSignalSelected = function (item) {
            var signal = _.find(this.items(), function (x) { return x.signalName === item.Name; });
            return !!signal;
        };
        WfSignalListComponent.prototype.getSignalInformationColumns = function () {
            var defaultColumns = ["AliasName", "Name", "Unit"];
            var columnsFroimSettings = ko.unwrap(this.settings.signalInformationColumns);
            if (!columnsFroimSettings)
                return defaultColumns;
            if (columnsFroimSettings.length === 0)
                return defaultColumns;
            return columnsFroimSettings;
        };
        WfSignalListComponent.prototype.showSettings = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result, signals, signals_1, signals_1_1, signal;
                var e_2, _a;
                return __generator(this, function (_b) {
                    this.showDialog(true);
                    result = [];
                    signals = ko.unwrap(this.signals);
                    if (!this.filtersChanged()) {
                        if (signals) {
                            try {
                                for (signals_1 = __values(signals), signals_1_1 = signals_1.next(); !signals_1_1.done; signals_1_1 = signals_1.next()) {
                                    signal = signals_1_1.value;
                                    result.push({
                                        signalName: signal.signalName,
                                        isAlphanumeric: signal.isAlphanumeric !== undefined ? signal.isAlphanumeric : false,
                                    });
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (signals_1_1 && !signals_1_1.done && (_a = signals_1.return)) _a.call(signals_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                        }
                        this.items(result);
                    }
                    return [2 /*return*/];
                });
            });
        };
        WfSignalListComponent.prototype.closeSettings = function () {
            this.showDialog(false);
        };
        WfSignalListComponent.prototype.applyFilterSettings = function () {
            var _this = this;
            this.showDialog(false);
            this.filtersChanged(false);
            var temp = _.map(this.items(), function (item) {
                var signal = _.findWhere(ko.unwrap(_this.settings.signals), { signalName: item });
                return {
                    signalName: item.signalName,
                    signalLabel: signal ? signal.signalLabel : '',
                    staticUnitText: signal ? signal.staticUnitText : '',
                    isAlphanumeric: item.isAlphanumeric,
                };
            });
            this.signals(temp);
        };
        WfSignalListComponent.prototype.clearFilterSettings = function () {
            this.items([]);
        };
        WfSignalListComponent.prototype.addItem = function (signalName) {
            if (_.find(this.items(), function (signal) { return signal.signalName === signalName; })) {
                return;
            }
            this.items.push({
                signalName: signalName,
                isAlphanumeric: this.isAlphanumeric()
            });
            this.isAlphanumeric(false);
            this.filtersChanged(true);
        };
        WfSignalListComponent.prototype.addGroup = function () {
            return __awaiter(this, void 0, void 0, function () {
                var filter, signals, _loop_1, this_1, signals_2, signals_2_1, signal, error_2;
                var e_3, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, 3, 4]);
                            filter = {
                                GroupIds: [this.selectedGroupId],
                                AliasNames: [],
                                ServerNames: []
                            };
                            this.isLoading(true);
                            return [4 /*yield*/, SignalsService.getSignalNames(filter, 0, this.maxSignalsForGroupAdd)];
                        case 1:
                            signals = _b.sent();
                            this.items.valueWillMutate();
                            _loop_1 = function (signal) {
                                if (_.find(this_1.items(), function (x) { return x.signalName === signal.Name; })) {
                                    return "continue";
                                }
                                this_1.items.push({
                                    signalName: signal.Name,
                                    isAlphanumeric: this_1.isAlphanumeric()
                                });
                            };
                            this_1 = this;
                            try {
                                for (signals_2 = __values(signals), signals_2_1 = signals_2.next(); !signals_2_1.done; signals_2_1 = signals_2.next()) {
                                    signal = signals_2_1.value;
                                    _loop_1(signal);
                                }
                            }
                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                            finally {
                                try {
                                    if (signals_2_1 && !signals_2_1.done && (_a = signals_2.return)) _a.call(signals_2);
                                }
                                finally { if (e_3) throw e_3.error; }
                            }
                            this.items.valueHasMutated();
                            this.isAlphanumeric(false);
                            this.filtersChanged(true);
                            return [3 /*break*/, 4];
                        case 2:
                            error_2 = _b.sent();
                            this.connector.handleError(WfSignalListComponent)(error_2);
                            return [3 /*break*/, 4];
                        case 3:
                            this.isLoading(false);
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfSignalListComponent.prototype.removeItem = function (removedItem) {
            this.items.remove(removedItem);
            this.filtersChanged(true);
            this.setSelceted();
        };
        WfSignalListComponent.prototype.getGroupNamesAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var filter, groupItems, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, 3, 4]);
                            filter = {
                                ServerNames: [],
                                GroupNames: [].concat(this.groupsFilter)
                            };
                            this.isLoading(true);
                            return [4 /*yield*/, SignalsService.getGroupNames(filter, 0, 500)];
                        case 1:
                            groupItems = _a.sent();
                            this.groupItems(groupItems);
                            if (!_.any(this.groupsFilter)) {
                                this.groupItems.unshift({ Name: "*", ID: null });
                                this.selectedGroupId.notifySubscribers();
                            }
                            else {
                                if (_.any(groupItems)) {
                                    this.selectedGroupId(_.first(groupItems).ID);
                                }
                            }
                            return [3 /*break*/, 4];
                        case 2:
                            error_3 = _a.sent();
                            this.connector.handleError(WfSignalListComponent)(error_3);
                            return [3 /*break*/, 4];
                        case 3:
                            this.isLoading(false);
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfSignalListComponent.prototype.resolvePlaceHolder = function (signalNames) {
            for (var i = 0; i < signalNames.length; i++) {
                signalNames[i].signalName = (ko.unwrap(signalNames[i].signalName) || "").stringPlaceholderResolver(this.objectID);
                signalNames[i].signalLabel = (ko.unwrap(signalNames[i].signalLabel) || "").stringPlaceholderResolver(this.objectID);
                signalNames[i].staticUnitText = (ko.unwrap(signalNames[i].staticUnitText) || "").stringPlaceholderResolver(this.objectID);
            }
            return signalNames;
        };
        WfSignalListComponent.prototype.getConfig = function () {
            var content = {
                signals: this.signals
            };
            return content;
        };
        WfSignalListComponent.prototype.loadConfig = function (content) {
            this.signals(content.signals);
        };
        WfSignalListComponent.prototype.loadInitialConfigurationAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var configuration, config, signals, filter, dtos, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, this.connector.getControlConfigurationsByName(this.initialConfiguration, this.configurationNamespace, this.controlType)];
                        case 1:
                            configuration = _a.sent();
                            if (configuration) {
                                config = this.standaloneParametersReplacementService.replaceConfigurationParameters(configuration.Content);
                                this.loadConfig(JSON.parse(config));
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.getSettingsSignalsThatActullyExists()];
                        case 2:
                            signals = _a.sent();
                            if (!(this.signalNamePatterns && this.signalNamePatterns.length > 0)) return [3 /*break*/, 4];
                            filter = {
                                ServerNames: [],
                                AliasNames: this.signalNamePatterns,
                                GroupIds: []
                            };
                            return [4 /*yield*/, SignalsService.getSignalNames(filter, 0, this.maxSignalsForGroupAdd)];
                        case 3:
                            dtos = _a.sent();
                            signals = signals.concat(_.map(dtos, function (dto) {
                                return { signalName: dto.Name };
                            }));
                            this.signals(signals);
                            return [2 /*return*/];
                        case 4:
                            this.signals(signals);
                            return [3 /*break*/, 6];
                        case 5:
                            error_4 = _a.sent();
                            this.connector.handleError(WfSignalListComponent)(error_4);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        WfSignalListComponent.prototype.getSettingsSignalsThatActullyExists = function () {
            return __awaiter(this, void 0, void 0, function () {
                var signals, resolvedSignals, result, promisses;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            signals = ko.unwrap(this.settings.signals) || [];
                            resolvedSignals = this.resolvePlaceHolder(ko.unwrap(signals));
                            result = [];
                            promisses = resolvedSignals.map(function (signal) { return _this.addSignal(signal, result); });
                            return [4 /*yield*/, Promise.all(promisses)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        WfSignalListComponent.prototype.addSignal = function (signal, result) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.connector.isSignalDefined(signal.signalName)];
                        case 1:
                            if (_a.sent()) {
                                result.push(signal);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfSignalListComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var settingsDialog, settingsBackContainer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            settingsDialog = $(document).find('#modal-settings-' + ko.unwrap(this.id));
                            settingsBackContainer = $(document).find('#modal-settings-back-container-' + ko.unwrap(this.id));
                            settingsDialog.remove();
                            settingsBackContainer.remove();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfSignalListComponent.prototype.resolveObjectIds = function (signalNamePatterns) {
            var e_4, _a;
            var result = [];
            try {
                for (var _b = __values(_.filter(signalNamePatterns, function (name) { return name !== null; })), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var signalName = _c.value;
                    result.push(signalName.stringPlaceholderResolver(this.objectID));
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return result;
        };
        WfSignalListComponent.prototype.getSymbolicText = function (propertyName) {
            return "I4SCADA_" + propertyName.replace(".", "");
        };
        return WfSignalListComponent;
    }(ComponentBaseModel));
    return WfSignalListComponent;
});
//# sourceMappingURL=wf-signal-list.component.js.map