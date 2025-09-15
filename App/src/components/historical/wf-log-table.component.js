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
define(["require", "exports", "../../services/models/logValuesFilter", "../services/secured.service", "../services/convert-csv.service", "../services/standalone-parameters-replacement.service", "../../decorators/busyIndicator", "../component-base.model", "../../services/connectorEnums"], function (require, exports, LogValuesFilter, SecuredService, ConvertCsvService, StandaloneParametersReplacementService, BusyIndicator, ComponentBaseModel, connectorEnums_1) {
    "use strict";
    var WfLogTableComponent = /** @class */ (function (_super) {
        __extends(WfLogTableComponent, _super);
        function WfLogTableComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.onEditLogTagEntry = function (index, data) { return __awaiter(_this, void 0, void 0, function () {
                var logTags, date, signalName, logTagName, isAlphanumeric, definition, logTag;
                return __generator(this, function (_a) {
                    logTags = this.logTags()[index - 1];
                    date = moment(data[0]);
                    signalName = logTags.signalName;
                    logTagName = logTags.logTagName;
                    isAlphanumeric = logTags.isAlphanumeric;
                    definition = this.signalDefinitions[ko.unwrap(signalName)];
                    if (!definition)
                        return [2 /*return*/]; //signal not exists in DB
                    logTag = _.findWhere(definition.Logs, { LogTag: logTagName });
                    if (!logTag)
                        return [2 /*return*/];
                    return [2 /*return*/];
                });
            }); };
            _this.initializePaging();
            _this.convertCsvService = new ConvertCsvService(_this.settings);
            _this.loadInitialConfiguration();
            return _this;
        }
        WfLogTableComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.standaloneParametersReplacementService = new StandaloneParametersReplacementService(this.settings);
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
            //#region export project authorization
            this.exportProjectAuthorization = (ko.unwrap(this.settings.exportProjectAuthorization) || "").stringPlaceholderResolver(this.objectID);
            this.exportSecuredService = new SecuredService(this.exportProjectAuthorization);
            this.hasExportAuthorization = this.exportSecuredService.hasAuthorization;
            //#endregion
            this.isDataLoading = ko.observable(false);
            this.showDialog = ko.observable(false);
            this.showSignalsDialog = ko.observable(false);
            this.showEditDialog = ko.observable(false);
            this.busyContext = new BusyIndicator(this);
            this.languageId = this.connector.currentLanguageId || 9;
            this.showDateTimeTooltip = this.settings.showDateTimeTooltip || false;
            this.dateTimeFormat = this.settings.dateTimeFormat !== undefined ? this.settings.dateTimeFormat : "DD.MM.YYYY HH:mm:ss";
            this.dateTimeTooltipFormat = this.settings.dateTimeTooltipFormat !== undefined ? this.settings.dateTimeTooltipFormat : this.dateTimeFormat;
            this.showOnlyOwnConfigurations = this.settings.showOnlyOwnConfigurations !== undefined ? this.settings.showOnlyOwnConfigurations : false;
            this.tableHeight = ko.observable(ko.unwrap(this.settings.tableHeight) !== undefined ? ko.unwrap(this.settings.tableHeight) : 300);
            this.headerVisibility = ko.observable(ko.unwrap(this.settings.headerVisibility) !== undefined ? ko.unwrap(this.settings.headerVisibility) : true);
            this.footerVisibility = ko.observable(ko.unwrap(this.settings.footerVisibility) !== undefined ? ko.unwrap(this.settings.footerVisibility) : true);
            this.statisticsVisibility = ko.observable(ko.unwrap(this.settings.statisticsVisibility) !== undefined ? ko.unwrap(this.settings.statisticsVisibility) : true);
            this.signalsButtonVisibility = ko.observable(ko.unwrap(this.settings.signalsButtonVisibility) !== undefined ? ko.unwrap(this.settings.signalsButtonVisibility) : true);
            this.settingsButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsButtonVisibility) : true);
            this.configurationButtonVisibility = ko.observable(ko.unwrap(this.settings.configurationButtonVisibility) !== undefined ? ko.unwrap(this.settings.configurationButtonVisibility) : true);
            this.exportButtonVisibility = ko.observable(ko.unwrap(this.settings.exportButtonVisibility) !== undefined ? ko.unwrap(this.settings.exportButtonVisibility) : true);
            this.initialConfiguration = (ko.unwrap(this.settings.initialConfiguration) || "").stringPlaceholderResolver(this.objectID);
            this.configurationNamespace = (ko.unwrap(this.settings.configurationNamespace) || "").stringPlaceholderResolver(this.objectID);
            this.controlType = connectorEnums_1.ConfigControlType.LogTagTable;
            this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
            this.panelBarCssClass = ko.unwrap(this.settings.panelBarCssClass) || "panel panel-default";
            this.cssClass = ko.unwrap(this.settings.cssClass) || "";
            this.configurationButtonIconClass = ko.unwrap(this.settings.configurationButtonIconClass);
            this.format = this.settings.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[00]";
            this.maxResults = ko.observable(ko.unwrap(this.settings.maxResults) ? ko.unwrap(this.settings.maxResults) : 100);
            this.maxSignalCount = ko.observable(ko.unwrap(this.settings.maxSignalCount) ? ko.unwrap(this.settings.maxSignalCount) : 50);
            this.pagingControlEnabled = ko.unwrap(this.settings.pagingControlEnabled) !== undefined ? ko.unwrap(this.settings.pagingControlEnabled) : true;
            this.itemsPerPage = ko.observable(20);
            this.pollTimer = null;
            this.isAutoUpdating = ko.observable(false);
            this.autoUpdate = ko.observable(ko.unwrap(this.settings.autoUpdate) ? ko.unwrap(this.settings.autoUpdate) : false);
            this.updateRate = Math.max(ko.unwrap(this.settings.updateRate) ? ko.unwrap(this.settings.updateRate) : 2000, 100);
            this.startOffset = ko.unwrap(this.settings.startOffset) ? ko.unwrap(this.settings.startOffset).trim().toLowerCase() : "minutes"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
            this.startOffsetIntervall = ko.unwrap(this.settings.startOffsetIntervall) ? ko.unwrap(this.settings.startOffsetIntervall) : 1;
            this.startDate = ko.observable(moment().subtract(this.startOffsetIntervall, this.startOffset).toDate());
            this.endDate = ko.observable(moment().toDate());
            this.startDateInput = ko.observable(moment(this.startDate()));
            this.endDateInput = ko.observable(moment(this.endDate()));
            this.maxResultsInput = ko.observable(this.maxResults());
            this.selectedRange = ko.observable(CalendarTimeRanges.Custom);
            this.selectedRangeInput = ko.observable(this.selectedRange());
            this.timeRangeDateInput = ko.observable();
            this.getLatestLogdata = ko.unwrap(this.settings.getLatestLogdata) !== undefined ? ko.unwrap(this.settings.getLatestLogdata) : true;
            this.sortOrder = ko.observable(LogValuesSortOrder.DateDescending);
            this.logTags = ko.observableArray([]);
            this.signalDefinitions = [];
            this.values = ko.observableArray();
            this.isSignalLoading = ko.observable(false);
            this.selectedLogTags = ko.observableArray();
            this.title = (ko.unwrap(this.settings.title) ? ko.unwrap(this.settings.title) : "").stringPlaceholderResolver(this.objectID);
            this.emptyValueSymbol = ko.unwrap(this.settings.emptyColumnSymbol) ? ko.unwrap(this.settings.emptyColumnSymbol) : "-";
            this.columnTooltipIconVisibility = ko.unwrap(this.settings.columnTooltipIconVisibility) !== undefined ? ko.unwrap(this.settings.columnTooltipIconVisibility) : true;
            this.columnTitleTemplate = ko.unwrap(this.settings.columnTitleTemplate) !== undefined ? ko.unwrap(this.settings.columnTitleTemplate) : this.connector.translate('I4SCADA_Value')() + " [%Unit%]";
            this.isAlphanumeric = ko.unwrap(this.settings.isAlphanumeric) !== undefined ? ko.unwrap(this.settings.isAlphanumeric) : false;
        };
        WfLogTableComponent.prototype.initializePaging = function () {
            var _this = this;
            // Pagination
            this._pagingDisabled = ko.computed(function () {
                if (_this.pagingControlEnabled) {
                    return false;
                }
                _this.itemsPerPage(_this.maxResults());
                return true;
            });
            this.currentPage = ko.observable(1);
            this.totalPages = ko.computed(function () {
                var total = _this.values().length / _this.itemsPerPage();
                return Math.ceil(total);
            });
            this.pagedItems = ko.computed(function () {
                var pg = _this.currentPage(), start = _this.itemsPerPage() * (pg - 1), end = start + _this.itemsPerPage();
                return _this.values().slice(start, end);
            });
            this.firstPage = function () {
                if (_this.firstPageEnabled()) {
                    _this.currentPage(1);
                }
            };
            this.firstPageEnabled = ko.computed(function () {
                return _this.currentPage() > 1;
            });
            this.nextPage = function () {
                if (_this.nextPageEnabled()) {
                    _this.currentPage(_this.currentPage() + 1);
                }
            };
            this.nextPageEnabled = ko.computed(function () {
                return _this.values().length > _this.itemsPerPage() * _this.currentPage();
            });
            this.previousPage = function () {
                if (_this.previousPageEnabled()) {
                    _this.currentPage(_this.currentPage() - 1);
                }
            };
            this.previousPageEnabled = ko.computed(function () {
                return _this.currentPage() > 1;
            });
            this.lastPage = function () {
                if (_this.lastPageEnabled()) {
                    _this.currentPage(_this.totalPages());
                }
            };
            this.lastPageEnabled = ko.computed(function () {
                return _this.values().length > (_this.itemsPerPage() * _this.currentPage());
            });
            this.hasSelectedItems = ko.pureComputed(function () {
                if (_this.logTags() && _this.logTags().length > 0)
                    return true;
                return false;
            });
        };
        WfLogTableComponent.prototype.updateSignals = function () {
            var _this = this;
            var aliases = _.map(ko.unwrap(this.logTags), function (item) { return item.signalName; });
            if (this.connector.disableSignalBrowser && !_.any(aliases))
                return;
            this.busyContext.runLongAction("Getting Signal Definitions", function () { return __awaiter(_this, void 0, void 0, function () {
                var definitions, definitions_1, definitions_1_1, definition, error_1;
                var e_1, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.connector.getSignalDefinitions(aliases)];
                        case 1:
                            definitions = _b.sent();
                            this.signalDefinitions = [];
                            try {
                                for (definitions_1 = __values(definitions), definitions_1_1 = definitions_1.next(); !definitions_1_1.done; definitions_1_1 = definitions_1.next()) {
                                    definition = definitions_1_1.value;
                                    this.signalDefinitions[definition.AliasName] = definition;
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (definitions_1_1 && !definitions_1_1.done && (_a = definitions_1.return)) _a.call(definitions_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            return [4 /*yield*/, this.handleUpdateLogs()];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _b.sent();
                            this.connector.handleError(WfLogTableComponent)(error_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        };
        WfLogTableComponent.prototype.updateLogs = function () {
            return __awaiter(this, void 0, void 0, function () {
                var logIds, filter;
                var _this = this;
                return __generator(this, function (_a) {
                    logIds = [];
                    this.isDataLoading(true);
                    _.each(this.logTags(), function (line) {
                        var definition = _this.signalDefinitions[ko.unwrap(line.signalName)];
                        if (!definition)
                            return; //signal not exists in DB
                        var logTag = _.findWhere(definition.Logs, { LogTag: line.logTagName });
                        if (!logTag)
                            return;
                        logIds.push(logTag.ID);
                        line.columnTitle(_this.getColumnTitle(line.signalName, line.logTagName));
                    });
                    // If getLatestLogdata property is set, then the endtimestamp will be set to "now"
                    if (ko.unwrap(this.getLatestLogdata) == true) {
                        this.endDate(moment().toDate());
                    }
                    filter = new LogValuesFilter(logIds, moment(ko.unwrap(this.startDate)), moment(ko.unwrap(this.endDate)), ko.unwrap(this.maxResults), ko.unwrap(this.sortOrder));
                    // gets the log values for all log ids from all logs from all signals
                    this.busyContext.runLongAction("Getting Log Values", function () { return __awaiter(_this, void 0, void 0, function () {
                        var result, logValues, values, logTags_1, logValues_1, logValues_1_1, row, line, error_2;
                        var e_2, _a;
                        var _this = this;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, this.connector.getLogValues(filter)];
                                case 1:
                                    result = _b.sent();
                                    logValues = result;
                                    values = [];
                                    logTags_1 = this.logTags();
                                    try {
                                        for (logValues_1 = __values(logValues), logValues_1_1 = logValues_1.next(); !logValues_1_1.done; logValues_1_1 = logValues_1.next()) {
                                            row = logValues_1_1.value;
                                            line = [];
                                            line.push(row.EntriesDate);
                                            _.each(row.Values, function (logValue, index) {
                                                if (typeof (logValue) !== "undefined" && logValue !== null) {
                                                    var isAlphanumeric = ko.unwrap(logTags_1[index].isAlphanumeric);
                                                    var value = _this.getDisplayLogValue(logValue, isAlphanumeric);
                                                    line.push(value);
                                                }
                                                else
                                                    line.push(_this.emptyValueSymbol);
                                            });
                                            values.push(line);
                                        }
                                    }
                                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                    finally {
                                        try {
                                            if (logValues_1_1 && !logValues_1_1.done && (_a = logValues_1.return)) _a.call(logValues_1);
                                        }
                                        finally { if (e_2) throw e_2.error; }
                                    }
                                    this.values(values);
                                    this.isDataLoading(false);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_2 = _b.sent();
                                    this.connector.handleError(WfLogTableComponent)(error_2);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
                });
            });
        };
        WfLogTableComponent.prototype.getDisplayLogValue = function (logValue, isAlphanumeric) {
            var value1 = logValue.EditedValue != null ? logValue.EditedValue : logValue.Value;
            var value2 = logValue.EditedValue2 != null ? logValue.EditedValue2 : logValue.Value2;
            var value = isAlphanumeric && value2 != null ? value2 : value1;
            var isEdited = isAlphanumeric ? logValue.EditedValue2 != null : logValue.EditedValue != null;
            var roundedValue = isAlphanumeric
                ? ko.observable(value)
                : ko.observable(value).extend({ numeralNumber: this.format });
            return { value: roundedValue(), value1: value1, value2: value2, isEdited: isEdited };
        };
        WfLogTableComponent.prototype.applyFilterSettings = function () {
            this.closeSettings();
            this.applySettings(this.startDateInput(), this.endDateInput(), this.maxResultsInput());
        };
        WfLogTableComponent.prototype.applySettings = function (startDate, endDate, maxresult) {
            this.startDate(startDate);
            this.endDate(endDate);
            this.maxResults(maxresult);
            this.selectedRange(this.selectedRangeInput());
            this.updateSignals();
        };
        WfLogTableComponent.prototype.showSettings = function () {
            this.showDialog(true);
            this.startDateInput(moment(this.startDate()));
            this.endDateInput(moment(this.endDate()));
            this.maxResultsInput(this.maxResults());
            this.timeRangeDateInput(this.startDate());
            this.selectedRangeInput(this.selectedRange());
        };
        WfLogTableComponent.prototype.closeSettings = function () {
            this.showDialog(false);
        };
        WfLogTableComponent.prototype.getConfig = function () {
            var content = {
                logTags: _.map(this.logTags(), function (item) {
                    return { signalName: item.signalName, logTagName: item.logTagName, isAlphanumeric: ko.unwrap(item.isAlphanumeric) };
                }),
                startDate: moment(this.startDate()).toMSDate(),
                endDate: moment(this.endDate()).toMSDate(),
                maxResults: this.maxResults(),
            };
            return content;
        };
        WfLogTableComponent.prototype.loadConfig = function (content) {
            this.applySignalsSettingsInner(content.logTags, true);
            this.applySettings(moment(content.startDate), moment(content.endDate), content.maxResults);
        };
        WfLogTableComponent.prototype.getLineWithPropertiesOrDefault = function (line) {
            var result = {};
            result.columnTitle = ko.observable("");
            result.signalName = line.signalName ? ko.unwrap(line.signalName) : "";
            result.logTagName = line.logTagName ? ko.unwrap(line.logTagName) : "";
            result.isAlphanumeric = line.isAlphanumeric != undefined ? ko.unwrap(line.isAlphanumeric) : this.isAlphanumeric;
            return result;
        };
        WfLogTableComponent.prototype.showSignalsSettings = function () {
            this.showSignalsDialog(true);
            var tmp = [];
            this.logTags().forEach(function (current, index, array) {
                tmp.push({
                    signalName: current.signalName,
                    logTagName: current.logTagName,
                    isAlphanumeric: ko.observable(current.isAlphanumeric),
                });
            });
            this.selectedLogTags(tmp);
        };
        WfLogTableComponent.prototype.closeSignalSettings = function () {
            this.showSignalsDialog(false);
        };
        WfLogTableComponent.prototype.applySignalsSettings = function () {
            this.closeSignalSettings();
            this.applySignalsSettingsInner(this.selectedLogTags());
        };
        WfLogTableComponent.prototype.applySignalsSettingsInner = function (logTags, checkDefinition) {
            if (checkDefinition === void 0) { checkDefinition = false; }
            return __awaiter(this, void 0, void 0, function () {
                var tempLogTags, signalNames, definitions, j, logTag, definition, logs, i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tempLogTags = [];
                            if (!checkDefinition) return [3 /*break*/, 2];
                            signalNames = _.pluck(logTags, "signalName");
                            if (this.connector.disableSignalBrowser && !_.any(signalNames))
                                return [2 /*return*/];
                            return [4 /*yield*/, this.connector.getSignalDefinitions(signalNames)];
                        case 1:
                            definitions = _a.sent();
                            for (j = 0; j < logTags.length; j++) {
                                logTag = logTags[j];
                                definition = _.findWhere(definitions, { AliasName: logTag.signalName });
                                if (!definition || !definition.Active)
                                    continue;
                                logs = _.filter(definition.Logs, function (log) { return log && log.Active; });
                                if (!logs || logs.length === 0 || _.pluck(logs, "LogTag").indexOf(logTag.logTagName) === -1)
                                    continue;
                                tempLogTags.push(this.getLineWithPropertiesOrDefault(logTag));
                            }
                            if (tempLogTags.length === 0)
                                this.values.removeAll(); //have to nothing show
                            this.logTags(tempLogTags);
                            this.updateSignals();
                            return [3 /*break*/, 3];
                        case 2:
                            for (i = 0; i < logTags.length; i++)
                                if (ko.unwrap(logTags[i].signalName) && ko.unwrap(logTags[i].logTagName))
                                    tempLogTags.push(this.getLineWithPropertiesOrDefault(logTags[i]));
                            if (tempLogTags.length === 0)
                                this.values.removeAll(); //have to nothing show
                            this.logTags(tempLogTags);
                            this.updateSignals();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfLogTableComponent.prototype.handleSortTable = function (index, asc) {
            var _this = this;
            this.values(this.values().sort(function (a, b) {
                var a, b;
                if (index !== 0) {
                    var valueA = a[index].value;
                    var valueB = b[index].value;
                    var numericA = valueA === _this.emptyValueSymbol ? Number.MAX_VALUE : parseFloat(valueA.replace(",", "."));
                    var numericB = valueB === _this.emptyValueSymbol ? Number.MAX_VALUE : parseFloat(valueB.replace(",", "."));
                    a = isNaN(numericA) ? valueA : numericA;
                    b = isNaN(numericB) ? valueB : numericB;
                }
                else {
                    a = new Date(a[index]);
                    b = new Date(b[index]);
                }
                return asc ? (a > b) - (a < b) : (a < b) - (a > b);
            }));
        };
        WfLogTableComponent.prototype.loadInitialConfiguration = function () {
            return __awaiter(this, void 0, void 0, function () {
                var config, configuration, error_3;
                var _this = this;
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
                            else if (this.settings.logTags) {
                                this.settings.logTags.forEach(function (logTag, array, index) {
                                    logTag.signalName = (ko.unwrap(logTag.signalName) || "").stringPlaceholderResolver(_this.objectID);
                                    logTag.logTagName = (ko.unwrap(logTag.logTagName) || "").stringPlaceholderResolver(_this.objectID);
                                });
                                return [2 /*return*/, this.applySignalsSettingsInner(this.settings.logTags, true)];
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            this.connector.handleError(WfLogTableComponent)(error_3);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfLogTableComponent.prototype.handleExport = function () {
            var csvFile = this.convertCsvService.convertLogTableData(this.values(), this.logTags());
            if (csvFile == null)
                return;
            this.convertCsvService.download();
        };
        WfLogTableComponent.prototype.getColumnTitle = function (signalName, logTag) {
            var self = this;
            var columnTitle = self.columnTitleTemplate;
            var definition = self.signalDefinitions[signalName];
            if (isNullOrUndefined(definition))
                return columnTitle;
            var regex = /\%(.*?)\%/g;
            var founds = columnTitle.match(regex);
            if (founds === null || founds.length === 0)
                return columnTitle;
            for (var i = 0; i < founds.length; i++) {
                var propertyName = founds[i].substr(founds[i].indexOf("%") + 1, founds[i].length - 2); //always %property name%
                //It can be "Name" or "Logs.Name" or "Group.Name"
                var parts = propertyName.split(".");
                var object = definition[parts[0]];
                if (parts.length > 1) {
                    if (parts[0] === "Logs") { //Must to find current log tag 
                        object = _.filter(object, function (log) { return log.LogTag === logTag; });
                        object = object.length > 0 ? object[0] : null;
                    }
                    for (var j = 1; j < parts.length; j++) {
                        object = object[parts[j]];
                    }
                }
                if (object == null)
                    object = "";
                columnTitle = columnTitle.replace(founds[i], object);
            }
            return columnTitle;
        };
        WfLogTableComponent.prototype.closeEditDialog = function () {
            this.showEditDialog(false);
        };
        WfLogTableComponent.prototype.updateLogValueAsync = function (logId, entryDate, value, value2) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.connector.updateLogValue(logId, entryDate, value, value2)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfLogTableComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var signalSettingsDialog, signalSettingsBackContainer, settingsDialog, settingsBackContainer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            //clear dialogs
                            if (this.pollTimer) {
                                clearTimeout(this.pollTimer);
                                this.pollTimer = null;
                            }
                            signalSettingsDialog = $(document).find('#modal-signal-settings-' + ko.unwrap(this.id));
                            signalSettingsBackContainer = $(document).find('#modal-signal-settings-back-container-' + ko.unwrap(this.id));
                            settingsDialog = $(document).find('#modal-settings-' + ko.unwrap(this.id));
                            settingsBackContainer = $(document).find('#modal-settings-back-container-' + ko.unwrap(this.id));
                            signalSettingsDialog.remove();
                            signalSettingsBackContainer.remove();
                            settingsDialog.remove();
                            settingsBackContainer.remove();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfLogTableComponent.prototype.toggleIsAutoUpdating = function () {
            this.isAutoUpdating(!this.isAutoUpdating());
            this.handleUpdateLogs();
        };
        WfLogTableComponent.prototype.handleUpdateLogs = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.updateLogs()];
                        case 1:
                            _a.sent();
                            this.handleAutoUpdate();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfLogTableComponent.prototype.handleAutoUpdate = function () {
            var _this = this;
            if (this.autoUpdate() && !this.isAutoUpdating()) {
                if (this.pollTimer) {
                    clearTimeout(this.pollTimer);
                }
                this.pollTimer = window.setTimeout(function () {
                    _this.handleUpdateLogs();
                }, this.updateRate);
            }
        };
        return WfLogTableComponent;
    }(ComponentBaseModel));
    return WfLogTableComponent;
});
//# sourceMappingURL=wf-log-table.component.js.map