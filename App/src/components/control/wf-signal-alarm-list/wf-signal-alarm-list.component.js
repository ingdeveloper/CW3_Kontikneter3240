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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
define(["require", "exports", "../../component-base.model", "../../services/secured.service", "./services/signal-alarm-list.service", "../../../services/connectorEnums", "./services/signal-alarm-export.service", "../../services/standalone-parameters-replacement.service", "./services/signal-alarm-column-name.service"], function (require, exports, ComponentBaseModel, SecuredService, signal_alarm_list_service_1, connectorEnums_1, signal_alarm_export_service_1, StandaloneParametersReplacementService, signal_alarm_column_name_service_1) {
    "use strict";
    var WfSignalAlarmListComponent = /** @class */ (function (_super) {
        __extends(WfSignalAlarmListComponent, _super);
        function WfSignalAlarmListComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.subscriptions = [];
            _this.pattern = ko.observable("");
            _this.unit = ko.observable("");
            _this.onRefresh = function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.signalAlarmListService.pattern = this.pattern();
                    this.signalAlarmListService.unit = this.unit();
                    this.signalAlarmListService.getDataAsync();
                    return [2 /*return*/];
                });
            }); };
            _this.getData = function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadInitialConfiguration()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.onRefresh()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); };
            _this.onSignalsSelected = function (aliasNames) {
                _this.signalAlarmListService.onSignalsSelected(aliasNames);
            };
            _this.onSettingsApplied = function (columnsOrder, maxSignalPageCount) {
                _this.columns(columnsOrder);
                _this.signalAlarmColumnNameService.onSettingsApplied(columnsOrder);
                _this.signalAlarmListService.onSettingsApplied(columnsOrder, maxSignalPageCount);
            };
            _this.initializeConfiguration();
            _this.signalAlarmColumnNameService = new signal_alarm_column_name_service_1.SignalAlarmColumnNameService(_this.settings);
            _this.columns = ko.observableArray(_this.signalAlarmColumnNameService.getColumnNames());
            _this.signalAlarmListService = new signal_alarm_list_service_1.SignalAlarmListService(_this.signalAlarmColumnNameService);
            _this.signalAlarmListService.aliasNames(_.map(ko.unwrap(_this.settings.aliasNames) || [], function (item) { return (item || "").stringPlaceholderResolver(_this.objectID); }));
            _this.signalAlarmListService.setSignalInformationColumns(_this.columns());
            _this.signalAlarmListService.maxSignalCount(ko.unwrap(_this.settings.maxSignalPageCount) || 50);
            _this.dateTimeFormat = ko.unwrap(_this.settings.exportDateTimeFormat) || ko.unwrap(_this.settings.dateTimeFormat) || "DD.MM.YYYY HH:mm:ss";
            _this.signalAlarmExportService = new signal_alarm_export_service_1.SignalAlarmExportService(_this.signalAlarmListService, __assign(__assign({}, _this.settings), { exportDateTimeFormat: _this.dateTimeFormat }));
            _this.initializeColors();
            _this.pattern((ko.unwrap(_this.settings.pattern) || "").stringPlaceholderResolver(_this.objectID));
            _this.unit((ko.unwrap(_this.settings.unit) || "").stringPlaceholderResolver(_this.objectID));
            _this.subscribePattern();
            _this.subscribeUnit();
            _this.getData();
            return _this;
        }
        WfSignalAlarmListComponent.prototype.subscribePattern = function () {
            this.delayedPattern = ko.computed(this.pattern).extend({ throttle: 500 });
            this.patternSubscription = this.delayedPattern.subscribe(this.onRefresh);
        };
        WfSignalAlarmListComponent.prototype.subscribeUnit = function () {
            this.delayedUnit = ko.computed(this.unit).extend({ throttle: 500 });
            this.unitSubscription = this.delayedUnit.subscribe(this.onRefresh);
        };
        WfSignalAlarmListComponent.prototype.unSubscribePattern = function () {
            this.patternSubscription.dispose();
            this.delayedPattern.dispose();
        };
        WfSignalAlarmListComponent.prototype.unSubscribeUnit = function () {
            this.unitSubscription.dispose();
            this.delayedUnit.dispose();
        };
        WfSignalAlarmListComponent.prototype.initializeSettings = function () {
            var _this = this;
            _super.prototype.initializeSettings.call(this);
            this.standaloneParametersReplacementService = new StandaloneParametersReplacementService(this.settings);
            //#region signal selection project authorization
            this.signalSelectionProjectAuthorization = (ko.unwrap(this.settings.signalSelectionProjectAuthorization) || "").stringPlaceholderResolver(this.objectID);
            this.signalSecuredService = new SecuredService(this.signalSelectionProjectAuthorization);
            this.hasSignalSelectionAuthorization = this.signalSecuredService.hasAuthorization;
            //#endregion
            //#region configuration project authorization
            this.configurationProjectAuthorization = (ko.unwrap(this.settings.configurationProjectAuthorization) || "").stringPlaceholderResolver(this.objectID);
            this.configurationSecuredService = new SecuredService(this.configurationProjectAuthorization);
            this.hasConfigurationAuthorization = this.configurationSecuredService.hasAuthorization;
            //#endregion
            //#region export project authorization
            this.exportProjectAuthorization = (ko.unwrap(this.settings.exportProjectAuthorization) || "").stringPlaceholderResolver(this.objectID);
            this.exportSecuredService = new SecuredService(this.exportProjectAuthorization);
            this.hasExportAuthorization = this.exportSecuredService.hasAuthorization;
            //#endregion
            this.initialConfiguration = (ko.unwrap(this.settings.initialConfiguration) || "").stringPlaceholderResolver(this.objectID);
            this.configurationNamespace = (ko.unwrap(this.settings.configurationNamespace) || "").stringPlaceholderResolver(this.objectID);
            this.controlType = connectorEnums_1.ConfigControlType.SignalALarmList;
            this.configurationButtonIconClass = ko.unwrap(this.settings.configurationButtonIconClass);
            this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
            this.panelBarCssClass = ko.unwrap(this.settings.panelBarCssClass) || "panel panel-default";
            this.cssClass = ko.unwrap(this.settings.cssClass) || "";
            this.showOnlyOwnConfigurations = this.settings.showOnlyOwnConfigurations !== undefined ? this.settings.showOnlyOwnConfigurations : false;
            this.configurationButtonVisibility = ko.unwrap(this.settings.configurationButtonVisibility) !== undefined ? ko.unwrap(this.settings.configurationButtonVisibility) : true;
            this.headerVisibility = ko.unwrap(this.settings.headerVisibility) !== undefined ? ko.unwrap(this.settings.headerVisibility) : true;
            this.exportButtonVisibility = ko.unwrap(this.settings.exportButtonVisibility) !== undefined ? ko.unwrap(this.settings.exportButtonVisibility) : true;
            this.signalsButtonVisibility = ko.unwrap(this.settings.signalsButtonVisibility) !== undefined ? ko.unwrap(this.settings.signalsButtonVisibility) : true;
            this.settingsButtonVisibility = ko.unwrap(this.settings.settingsButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsButtonVisibility) : true;
            this.titleText = (ko.unwrap(this.settings.titleText) ? ko.unwrap(this.settings.titleText) : "WEBfactory SignalAlarmList").stringPlaceholderResolver(this.objectID);
            this.maxSignalCount = ko.unwrap(this.settings.maxSignalCount) !== undefined ? ko.unwrap(this.settings.maxSignalCount) : 100;
            this.maxSignalsForGroupAdd = ko.unwrap(this.settings.maxSignalsForGroupAdd) !== undefined ? ko.unwrap(this.settings.maxSignalsForGroupAdd) : 500;
            this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[000]";
            this.signalsFilter = _.map(ko.unwrap(this.settings.signalsFilter) || [], function (item) { return (item || "").stringPlaceholderResolver(_this.objectID); });
            this.groupsFilter = _.map(ko.unwrap(this.settings.groupsFilter) || [], function (item) { return (item || "").stringPlaceholderResolver(_this.objectID); });
            this.signalNamePattern = (ko.unwrap(this.settings.signalNamePattern) ? ko.unwrap(this.settings.signalNamePattern) : "").stringPlaceholderResolver(this.objectID);
            this.patternVisibility = ko.unwrap(this.settings.patternVisibility) !== undefined ? ko.unwrap(this.settings.patternVisibility) : true;
            this.unitVisibility = ko.unwrap(this.settings.unitVisibility) !== undefined ? ko.unwrap(this.settings.unitVisibility) : false;
        };
        WfSignalAlarmListComponent.prototype.initializeColors = function () {
            this.acknowledgedAlarmBackground = ko.unwrap(this.settings.acknowledgedAlarmBackground) ? ko.unwrap(this.settings.acknowledgedAlarmBackground) : null; // "#E08F00";
            this.acknowledgedAlarmForeground = ko.unwrap(this.settings.acknowledgedAlarmForeground) ? ko.unwrap(this.settings.acknowledgedAlarmForeground) : null; //"#FFFFFF";
            this.offAlarmBackground = ko.unwrap(this.settings.offAlarmBackground) ? ko.unwrap(this.settings.offAlarmBackground) : null; //"#0c9900";
            this.offAlarmForeground = ko.unwrap(this.settings.offAlarmForeground) ? ko.unwrap(this.settings.offAlarmForeground) : null; //"#FFFFFF";
            this.onAlarmBackground = ko.unwrap(this.settings.onAlarmBackground) ? ko.unwrap(this.settings.onAlarmBackground) : null; //"#990100";
            this.onAlarmForeground = ko.unwrap(this.settings.onAlarmForeground) ? ko.unwrap(this.settings.onAlarmForeground) : null; //"#FFFFFF";
            this.inactiveAlarmBackground = ko.unwrap(this.settings.inactiveAlarmBackground) ? ko.unwrap(this.settings.inactiveAlarmBackground) : "";
            this.inactiveAlarmForeground = ko.unwrap(this.settings.inactiveAlarmForeground) ? ko.unwrap(this.settings.inactiveAlarmForeground) : "";
            this.rowItemCssClass = ko.unwrap(this.settings.rowItemCssClass) || "";
            this.signalAlarmListService.colors = {
                inactiveAlarmForeground: this.inactiveAlarmForeground,
                inactiveAlarmBackground: this.inactiveAlarmBackground,
                onAlarmForeground: this.onAlarmForeground,
                onAlarmBackground: this.onAlarmBackground,
                offAlarmForeground: this.offAlarmForeground,
                offAlarmBackground: this.offAlarmBackground,
                acknowledgedAlarmForeground: this.acknowledgedAlarmForeground,
                acknowledgedAlarmBackground: this.acknowledgedAlarmBackground,
                rowItemCssClass: this.rowItemCssClass
            };
        };
        WfSignalAlarmListComponent.prototype.initializeConfiguration = function () {
            this.initialConfiguration = (ko.unwrap(this.settings.initialConfiguration) || "").stringPlaceholderResolver(this.objectID);
            this.configurationNamespace = (ko.unwrap(this.settings.configurationNamespace) || "").stringPlaceholderResolver(this.objectID);
            this.controlType = connectorEnums_1.ConfigControlType.SignalALarmList;
        };
        WfSignalAlarmListComponent.prototype.handleExport = function () {
            this.signalAlarmExportService.handleExport(this.columns());
        };
        WfSignalAlarmListComponent.prototype.loadInitialConfiguration = function () {
            return __awaiter(this, void 0, void 0, function () {
                var config, configuration, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.connector.getControlConfigurationsByName(this.initialConfiguration, this.configurationNamespace, this.controlType)];
                        case 1:
                            config = _a.sent();
                            if (config) {
                                configuration = this.standaloneParametersReplacementService.replaceConfigurationParameters(config.Content);
                                this.loadConfig(JSON.parse(configuration));
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            this.connector.handleError(WfSignalAlarmListComponent)(error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // configuration
        WfSignalAlarmListComponent.prototype.getConfig = function () {
            var content = {
                aliasNames: this.signalAlarmListService.aliasNames(),
                columns: this.signalAlarmColumnNameService.columns,
                maxSignalPageCount: this.signalAlarmListService.maxSignalCount(),
                pattern: this.pattern(),
                unit: this.unit(),
            };
            return content;
        };
        WfSignalAlarmListComponent.prototype.applyConfigurationLoad = function (content) {
            this.loadConfig(content);
            this.onRefresh();
        };
        WfSignalAlarmListComponent.prototype.loadConfig = function (content) {
            this.signalAlarmColumnNameService.loadConfig(content.columns);
            this.columns(this.signalAlarmColumnNameService.getColumnNames());
            this.signalAlarmListService.aliasNames(content.aliasNames);
            this.signalAlarmListService.maxSignalCount(content.maxSignalPageCount);
            this.signalAlarmListService.setSignalInformationColumns(this.columns());
            this.signalAlarmListService.pattern = content.pattern;
            this.unSubscribePattern();
            this.unSubscribeUnit();
            this.pattern(content.pattern);
            this.unit(content.unit);
            this.subscribePattern();
            this.subscribeUnit();
        };
        WfSignalAlarmListComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, subscription;
                var e_1, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _d.sent();
                            try {
                                for (_a = __values(this.subscriptions), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    subscription = _b.value;
                                    subscription.dispose();
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            this.unSubscribePattern();
                            this.subscribeUnit();
                            this.signalAlarmListService.dispose();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfSignalAlarmListComponent;
    }(ComponentBaseModel));
    return WfSignalAlarmListComponent;
});
//# sourceMappingURL=wf-signal-alarm-list.component.js.map