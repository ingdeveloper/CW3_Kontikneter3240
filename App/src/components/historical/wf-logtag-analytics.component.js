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
define(["require", "exports", "../services/standalone-parameters-replacement.service", "../component-base.model", "../../services/connectorEnums"], function (require, exports, StandaloneParametersReplacementService, ComponentBaseModel, connectorEnums_1) {
    "use strict";
    var WfLogTagAnalyticsComponent = /** @class */ (function (_super) {
        __extends(WfLogTagAnalyticsComponent, _super);
        function WfLogTagAnalyticsComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.loadInitialConfiguration();
            return _this;
        }
        WfLogTagAnalyticsComponent.prototype.initializeSettings = function () {
            var _this = this;
            _super.prototype.initializeSettings.call(this);
            this.standaloneParametersReplacementService = new StandaloneParametersReplacementService(this.settings);
            this.showOnlyOwnConfigurations = this.settings.showOnlyOwnConfigurations !== undefined ? this.settings.showOnlyOwnConfigurations : false;
            this.showDialog = ko.observable(false);
            this.selectedLogTags = ko.observableArray([]);
            this.signalDefenitions = [];
            this.viewModel = ko.observableArray();
            this.title = (ko.unwrap(this.settings.title) ? ko.unwrap(this.settings.title) : "").stringPlaceholderResolver(this.objectID);
            this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
            this.configurationButtonIconClass = ko.unwrap(this.settings.configurationButtonIconClass);
            this.panelBarCssClass = ko.unwrap(this.settings.panelBarCssClass) !== undefined ? ko.unwrap(this.settings.panelBarCssClass) : "panel panel-default";
            this.datasetItemCssClass = ko.unwrap(this.settings.datasetItemCssClass) || "panel panel-primary";
            this.datasetItemHeaderCssClass = ko.unwrap(this.settings.datasetItemHeaderCssClass) || "panel-heading";
            this.settingsButtonVisibility = ko.unwrap(this.settings.settingsButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsButtonVisibility) : true;
            this.configurationButtonVisibility = ko.unwrap(this.settings.configurationButtonVisibility) !== undefined ? ko.unwrap(this.settings.configurationButtonVisibility) : true;
            this.headerVisibility = ko.unwrap(this.settings.headerVisibility) !== undefined ? ko.unwrap(this.settings.headerVisibility) : true;
            this.initialConfiguration = (ko.unwrap(this.settings.initialConfiguration) || "").stringPlaceholderResolver(this.objectID);
            this.configurationNamespace = (ko.unwrap(this.settings.configurationNamespace) || "").stringPlaceholderResolver(this.objectID);
            this.controlType = connectorEnums_1.ConfigControlType.LogStatistics;
            this.showHeaderForDataset = ko.unwrap(this.settings.showHeaderForDataset) !== undefined ? ko.unwrap(this.settings.showHeaderForDataset) : true;
            //#region Settings of formats
            this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[00]";
            this.dateTimeFormat = ko.unwrap(this.settings.dateTimeFormat) ? ko.unwrap(this.settings.dateTimeFormat) : "DD.MM.YYYY HH:mm:ss.SSS";
            //endergion                
            // #region Settings of Maximum
            this.maxIconClass = ko.unwrap(this.settings.maxIconClass) || "wf wf-max";
            this.showMaxValue = ko.unwrap(this.settings.showMaxValue) !== undefined ? ko.unwrap(this.settings.showMaxValue) : true;
            this.showMaxDate = ko.unwrap(this.settings.showMaxDate) !== undefined ? ko.unwrap(this.settings.showMaxDate) : true;
            this.showMaxLabel = ko.unwrap(this.settings.showMaxLabel) !== undefined ? ko.unwrap(this.settings.showMaxLabel) : true;
            this.maxLabelText = ko.unwrap(this.settings.maxLabelText) ? ko.unwrap(this.settings.maxLabelText) : "Maximum";
            //#endregion
            // #region Settings of Minimum
            this.minIconClass = ko.unwrap(this.settings.minIconClass) || "wf wf-min";
            this.showMinValue = ko.unwrap(this.settings.showMinValue) !== undefined ? ko.unwrap(this.settings.showMinValue) : true;
            this.showMinDate = ko.unwrap(this.settings.showMinDate) !== undefined ? ko.unwrap(this.settings.showMinDate) : true;
            this.showMinLabel = ko.unwrap(this.settings.showMinLabel) !== undefined ? ko.unwrap(this.settings.showMinLabel) : true;
            this.minLabelText = ko.unwrap(this.settings.minLabelText) ? ko.unwrap(this.settings.minLabelText) : "Minimum";
            //#endregion
            // #region Settings of Avg
            this.avgIconClass = ko.unwrap(this.settings.avgIconClass) || "wf wf-average";
            this.showAvg = ko.unwrap(this.settings.showAvg) !== undefined ? ko.unwrap(this.settings.showAvg) : true;
            this.showAvgLabel = ko.unwrap(this.settings.showAvgLabel) !== undefined ? ko.unwrap(this.settings.showAvgLabel) : true;
            this.avgLabelText = ko.unwrap(this.settings.avgLabelText) ? ko.unwrap(this.settings.avgLabelText) : "Average";
            //#endregion
            this.pollTimer = null;
            this.isAutoUpdating = ko.observable(false);
            this.autoUpdate = ko.observable(ko.unwrap(this.settings.autoUpdate) ? ko.unwrap(this.settings.autoUpdate) : false);
            this.updateRate = Math.max(ko.unwrap(this.settings.updateRate) ? ko.unwrap(this.settings.updateRate) : 2000, 100);
            this.isRealTimeUpdating = ko.pureComputed(function () {
                return _this.autoUpdate() && !_this.isAutoUpdating();
            }, this);
            this.getLatestLogdata = (this.settings.getLatestLogdata != undefined) ? ko.unwrap(this.settings.getLatestLogdata) : true;
            this.endOffset = ko.unwrap(this.settings.endOffset) ? ko.unwrap(this.settings.endOffset).trim().toLowerCase() : "minutes"; //"seconds", "minutes", "days", "weeks", "months", "years"
            this.endOffsetIntervall = ko.unwrap(this.settings.endOffsetIntervall) ? ko.unwrap(this.settings.endOffsetIntervall) : 0;
            this.startOffset = ko.unwrap(this.settings.startOffset) ? ko.unwrap(this.settings.startOffset).trim().toLowerCase() : "days"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
            this.startOffsetIntervall = ko.unwrap(this.settings.startOffsetIntervall) ? ko.unwrap(this.settings.startOffsetIntervall) : 1;
            this.fromDate = ko.observable(moment().startOf('minute').subtract(this.startOffsetIntervall, this.startOffset));
            this.toDate = ko.observable(moment());
            this.fromDateInput = ko.observable(this.fromDate());
            this.toDateInput = ko.observable(this.toDate());
            this.selectedRange = ko.observable(CalendarTimeRanges.Custom);
            this.selectedRangeInput = ko.observable(this.selectedRange());
            this.timeRangeDateInput = ko.observable();
            this.isLoading = ko.observable(false);
            this.showUnitLabel = ko.unwrap(this.settings.showUnitLabel) != undefined ? ko.unwrap(this.settings.showUnitLabel) : true;
            //#endregion
            this.showException = ko.unwrap(this.settings.showException) !== undefined ? ko.unwrap(this.settings.showException) : false;
            this.showExceptionLabel = ko.unwrap(this.settings.showExceptionLabel) !== undefined ? ko.unwrap(this.settings.showExceptionLabel) : false;
            this.showPanelHeader = ko.unwrap(this.settings.showPanelHeader) !== undefined ? ko.unwrap(this.settings.showPanelHeader) : false;
            this.exceptionLabel = ko.unwrap(this.settings.exceptionLabel) !== undefined ? ko.unwrap(this.settings.exceptionLabel) : null;
            this.isSignalLoading = ko.observable(false);
            this.hasData = ko.pureComputed(function () {
                return _this.viewModel().length > 0;
            });
            this.logTags = this.settings.logTags && this.settings.logTags.length > 0 ? _.filter(this.settings.logTags, function (e) {
                return e.signalName && e.logTagName;
            }) : [];
            this.showMainPanel = ko.pureComputed(function () {
                return _this.settingsButtonVisibility || _this.configurationButtonVisibility || _this.title;
            });
        };
        WfLogTagAnalyticsComponent.prototype.getConfig = function () {
            var content = {
                logTags: this.logTags,
                fromDate: moment(this.fromDate()).toMSDate(),
                toDate: moment(this.toDate()).toMSDate(),
                autoUpdate: this.autoUpdate()
            };
            return content;
        };
        WfLogTagAnalyticsComponent.prototype.loadConfig = function (content) {
            this.logTags = content.logTags;
            this.fromDate(moment(content.fromDate));
            this.toDate(moment(content.toDate));
            if (content.autoUpdate !== undefined) {
                this.autoUpdate(content.autoUpdate);
            }
            if (this.autoUpdate()) {
                if (this.logTags.length == 0) {
                    this.isAutoUpdating(true);
                }
                else {
                    this.isAutoUpdating(false);
                }
            }
            this.getSignalDefinitions();
        };
        WfLogTagAnalyticsComponent.prototype.triggerRefreshChartData = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // If getLatestLogdata property is set, then the endtimestamp will be set to "now"
                    if (ko.unwrap(this.getLatestLogdata) === true) {
                        this.fromDate(moment().subtract(this.startOffsetIntervall, this.startOffset));
                        this.fromDateInput(this.fromDate());
                        this.selectedRangeInput(CalendarTimeRanges.Custom);
                        this.timeRangeDateInput(this.fromDate());
                        this.toDate(moment().add(this.endOffsetIntervall, this.endOffset));
                        this.toDateInput(this.toDate());
                    }
                    this.refreshData();
                    return [2 /*return*/];
                });
            });
        };
        WfLogTagAnalyticsComponent.prototype.toggleIsAutoUpdating = function () {
            this.isAutoUpdating(!this.isAutoUpdating());
            this.handleAutoUpdate();
        };
        WfLogTagAnalyticsComponent.prototype.refreshData = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getData()];
                        case 1:
                            _a.sent();
                            this.handleAutoUpdate();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfLogTagAnalyticsComponent.prototype.handleAutoUpdate = function () {
            var _this = this;
            if (this.autoUpdate() && !this.isAutoUpdating()) {
                this.fromDate(moment().subtract(this.startOffsetIntervall, this.startOffset));
                this.toDate(moment().add(this.endOffsetIntervall, this.endOffset));
                if (this.pollTimer) {
                    clearTimeout(this.pollTimer);
                }
                this.pollTimer = window.setTimeout(function () {
                    _this.refreshData();
                }, this.updateRate);
            }
        };
        WfLogTagAnalyticsComponent.prototype.getData = function () {
            return __awaiter(this, void 0, void 0, function () {
                var filter, logIDs, logInfo, i, signalName, definition, logs, selectedLog, dtosFromServer, viewModels, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.isLoading(true);
                            this.viewModel.removeAll();
                            filter = {};
                            filter.StartDate = moment(this.fromDate()).toMSDateTimeOffset();
                            filter.EndDate = moment(this.toDate()).toMSDateTimeOffset();
                            logIDs = [];
                            logInfo = [];
                            if (_.any(this.signalDefenitions)) {
                                for (i = 0; i < this.logTags.length; i++) {
                                    signalName = this.logTags[i].signalName;
                                    definition = _.find(this.signalDefenitions, function (definition) {
                                        return definition.AliasName === signalName;
                                    });
                                    logs = definition.Logs;
                                    selectedLog = _.filter(logs, function (item) { return item.LogTag === _this.logTags[i].logTagName; });
                                    if (selectedLog.length === 1) {
                                        logIDs.push(selectedLog[0].ID);
                                        logInfo[selectedLog[0].ID] = { signalName: signalName, logTagName: selectedLog[0].LogTag, unit: definition.Unit };
                                    }
                                }
                                filter.LogIDs = logIDs;
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, this.connector.getLogStatistics(filter)];
                        case 2:
                            dtosFromServer = _a.sent();
                            viewModels = _.map(dtosFromServer, function (dto) {
                                var info = logInfo[dto.LogID];
                                return {
                                    maxPanelIsVisible: dto && _this.showMaxValue,
                                    showMaxLabel: _this.showMaxLabel,
                                    maxLabelText: _this.maxLabelText ? _this.maxLabelText : '',
                                    showMaxValue: _this.showMaxValue,
                                    maxValue: _this.getDisplayValue(_this.showMaxValue, dto.Maximum),
                                    showMaxDate: _this.showMaxDate,
                                    maxDate: _this.getDisplayDate(_this.showMaxDate, dto.Maximum),
                                    minPanelIsVisible: dto && _this.showMinValue,
                                    showMinLabel: _this.showMinLabel,
                                    minLabelText: _this.minLabelText ? _this.minLabelText : '',
                                    showMinValue: _this.showMinValue,
                                    minValue: _this.getDisplayValue(_this.showMinValue, dto.Minimum),
                                    showMinDate: _this.showMinDate,
                                    minDate: _this.getDisplayDate(_this.showMinDate, dto.Minimum),
                                    avgPanelIsVisible: dto && _this.showAvg,
                                    showAvgLabel: _this.showAvgLabel,
                                    avgLabelText: _this.avgLabelText ? _this.avgLabelText : '',
                                    avgValue: _this.getDisplayValue(_this.showAvg, dto.Average),
                                    exceptionPanelIsVisible: !dto && _this.showException,
                                    showExceptionLabel: _this.showExceptionLabel,
                                    exceptionLabel: _this.exceptionLabel + ': ',
                                    //exception: dto.Exception,
                                    caption: info.signalName + ' - ' + info.logTagName,
                                    showPanelHeader: _this.showPanelHeader,
                                    unit: info.unit
                                };
                            });
                            this.viewModel(viewModels);
                            return [3 /*break*/, 5];
                        case 3:
                            error_1 = _a.sent();
                            this.connector.handleError(WfLogTagAnalyticsComponent)(error_1);
                            return [3 /*break*/, 5];
                        case 4:
                            this.isLoading(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        WfLogTagAnalyticsComponent.prototype.closeSettings = function () {
            this.showDialog(false);
        };
        WfLogTagAnalyticsComponent.prototype.applySettings = function () {
            this.showDialog(false);
            this.selectedRange(this.selectedRangeInput());
            this.logTags = [];
            if (this.selectedLogTags().length > 0) {
                for (var i = 0; i < this.selectedLogTags().length; i++) {
                    if (ko.unwrap(this.selectedLogTags()[i].signalName) && ko.unwrap(this.selectedLogTags()[i].logTagName)) {
                        this.logTags.push({
                            signalName: ko.unwrap(this.selectedLogTags()[i].signalName),
                            logTagName: ko.unwrap(this.selectedLogTags()[i].logTagName)
                        });
                    }
                }
            }
            this.fromDate(this.fromDateInput());
            this.toDate(this.toDateInput());
            if (this.logTags.length > 0)
                this.getSignalDefinitions();
            else
                this.viewModel([]);
        };
        WfLogTagAnalyticsComponent.prototype.handleShowSettings = function () {
            this.showDialog(true);
            this.fromDateInput(this.fromDate());
            this.toDateInput(this.toDate());
            this.timeRangeDateInput(this.fromDate());
            this.selectedRangeInput(this.selectedRange());
            var tmp = [];
            this.logTags.forEach(function (current, index, array) {
                tmp.push({
                    signalName: ko.observable(current.signalName),
                    logTagName: ko.observable(current.logTagName)
                });
            });
            this.selectedLogTags(tmp);
        };
        WfLogTagAnalyticsComponent.prototype.getSignalDefinitions = function () {
            return __awaiter(this, void 0, void 0, function () {
                var aliasNames, definitions, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            aliasNames = _.map(this.logTags, function (item) { return item.signalName; });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.connector.getSignalDefinitions(aliasNames)];
                        case 2:
                            definitions = _a.sent();
                            this.signalDefenitions = definitions;
                            this.refreshData();
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            this.connector.handleError(WfLogTagAnalyticsComponent)(error_2);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfLogTagAnalyticsComponent.prototype.getDisplayValue = function (shouldShow, logValue) {
            if (!shouldShow || !logValue || !logValue.Value)
                return "N/A";
            var value = logValue.Value.EditedValue ? logValue.Value.EditedValue : logValue.Value.Value;
            return numeral(value).format(this.format);
        };
        WfLogTagAnalyticsComponent.prototype.getDisplayDate = function (shouldShow, logValue) {
            if (!shouldShow || !logValue || !logValue.Date)
                return "N/A";
            return moment.utc(logValue.Date).local().format(this.dateTimeFormat);
        };
        WfLogTagAnalyticsComponent.prototype.loadInitialConfiguration = function () {
            return __awaiter(this, void 0, void 0, function () {
                var config, configuration, error_3;
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
                                return [2 /*return*/, this.getSignalDefinitions()];
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            this.connector.handleError(WfLogTagAnalyticsComponent)(error_3);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfLogTagAnalyticsComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var signalSettingsDialog, signalSettingsBackContainer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            signalSettingsDialog = $(document).find('#modal-signal-settings-' + ko.unwrap(this.id));
                            signalSettingsBackContainer = $(document).find('#modal-signal-settings-back-container-' + ko.unwrap(this.id));
                            signalSettingsDialog.remove();
                            signalSettingsBackContainer.remove();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfLogTagAnalyticsComponent;
    }(ComponentBaseModel));
    return WfLogTagAnalyticsComponent;
});
//# sourceMappingURL=wf-logtag-analytics.component.js.map