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
define(["require", "exports", "../../services/models/logbookFilter", "../services/standalone-parameters-replacement.service", "../component-base.model", "../../services/connectorEnums"], function (require, exports, LogbookFilter, StandaloneParametersReplacementService, ComponentBaseModel, connectorEnums_1) {
    "use strict";
    var WfLogbookComponent = /** @class */ (function (_super) {
        __extends(WfLogbookComponent, _super);
        function WfLogbookComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.subscriptions = [];
            _this.initializeComputeds();
            _this.getCurrentLoggedInUser();
            _this.setFilter();
            _this.getTopics();
            _this.setEntries();
            _this.loadInitialConfiguration();
            return _this;
        }
        WfLogbookComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.standaloneParametersReplacementService = new StandaloneParametersReplacementService(this.settings);
            this.showSettingsDialog = ko.observable(false);
            this.showSendDialog = ko.observable(false);
            this.logsEntries = ko.observableArray([]);
            this.topics = ko.observableArray([]);
            this.entrySubject = ko.observable();
            this.entryTopic = ko.observable();
            this.entryBody = ko.observable();
            this.filtersChanged = ko.observable(false);
            this.warningCssClass = "btn btn-warning";
            this.controlType = connectorEnums_1.ConfigControlType.Logbook;
            this.filter = new LogbookFilter();
            this.isNewAdding = ko.observable(false);
            this.topicsForNewEntry = ko.observableArray();
            this.newTopicName = ko.observable();
            this.selectedTopic = ko.observable((this.settings.selectedTopic || '').stringPlaceholderResolver(this.objectID));
            this.height = ko.observable(ko.unwrap(this.settings.height) !== undefined ? ko.unwrap(this.settings.height) : false);
            this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
            this.panelBarCssClass = ko.unwrap(this.settings.panelBarCssClass) || "panel panel-default";
            this.configurationButtonIconClass = ko.unwrap(this.settings.configurationButtonIconClass);
            this.headerVisibility = ko.observable(ko.unwrap(this.settings.headerVisibility) !== undefined ? ko.unwrap(this.settings.headerVisibility) : true);
            this.settingsButtonVisibility = ko.observable(ko.unwrap(this.settings.settingsButtonVisibility) !== undefined ? ko.unwrap(this.settings.settingsButtonVisibility) : true);
            this.configurationButtonVisibility = ko.observable(ko.unwrap(this.settings.configurationButtonVisibility) !== undefined ? ko.unwrap(this.settings.configurationButtonVisibility) : true);
            this.initialConfiguration = (ko.unwrap(this.settings.initialConfiguration) || "").stringPlaceholderResolver(this.objectID);
            this.configurationNamespace = (ko.unwrap(this.settings.configurationNamespace) || "").stringPlaceholderResolver(this.objectID);
            this.defaultItemClass = ko.unwrap(this.settings.defaultItemClass) || "wf-callout-box wf-callout-box-info";
            this.titleText = (ko.unwrap(this.settings.titleText) || "WEBfactory i4SCADA Logbook").stringPlaceholderResolver(this.objectID);
            this.defaultEntryTopic = (ko.unwrap(this.settings.defaultEntryTopic) || this.connector.translate("I4SCADA_Info")() || "").stringPlaceholderResolver(this.objectID);
            this.defaultEntrySubject = (ko.unwrap(this.settings.defaultEntrySubject) || "").stringPlaceholderResolver(this.objectID);
            this.updateRate = ko.unwrap(this.settings.updateRate) || 5000;
            this.maxResults = ko.observable(this.settings.maxResults || 5);
            this.startOffset = ko.unwrap(this.settings.startOffset) ? ko.unwrap(this.settings.startOffset).trim().toLowerCase() : "hour"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
            this.startOffsetIntervall = ko.unwrap(this.settings.startOffsetIntervall) ? ko.unwrap(this.settings.startOffsetIntervall) : 24;
            this.startDate = ko.observable(moment().subtract(this.startOffset, this.startOffsetIntervall));
            this.endDate = ko.observable(moment());
            this.getLatestLogdata = ko.observable(this.settings.getLatestLogdata !== undefined ? this.settings.getLatestLogdata : true);
        };
        WfLogbookComponent.prototype.initializeComputeds = function () {
            var _this = this;
            this.panelBodyHeight = ko.pureComputed(function () {
                if (!_this.height()) {
                    return null;
                }
                if (_this.headerVisibility()) {
                    if (_this.height())
                        return (_this.height() - 45);
                }
                return _this.height();
            });
            this.subscriptions.push(this.maxResults.subscribe(function () {
                _this.filtersChanged(true);
            }));
            this.subscriptions.push(this.startDate.subscribe(function () {
                _this.filtersChanged(true);
            }));
            this.subscriptions.push(this.endDate.subscribe(function () {
                _this.filtersChanged(true);
            }));
            this.subscriptions.push(this.topics.subscribe(function (newValues) {
                _this.topicsForNewEntry(_this.addDefaultTopics(newValues));
            }));
            // to translate on language change the names correctly.
            ko.computed(function () {
                var noop = _this.getDefaultTopics();
                _this.topicsForNewEntry(_this.addDefaultTopics(_this.topics.peek()));
            }).extend({ rateLimit: 500 });
            this.sendButtonEnabled = ko.pureComputed(function () {
                return _this.entryBody() && !_this.isNewAdding();
            });
            this.settingsButtonBarCssClass = ko.computed(function () {
                return _this.filtersChanged() ? _this.warningCssClass : _this.buttonBarCssClass;
            });
        };
        WfLogbookComponent.prototype.getCurrentLoggedInUser = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.loggedInUserName = this.connector.currentLoggedInUser;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.connector.getCurrentLoggedInUser()];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            this.connector.handleError(WfLogbookComponent)(error_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        WfLogbookComponent.prototype.getTopics = function () {
            return __awaiter(this, void 0, void 0, function () {
                var topics;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.connector.getLogbookTopics()];
                        case 1:
                            topics = _a.sent();
                            this.topics(topics);
                            this.selectedTopic(this.selectedTopic());
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfLogbookComponent.prototype.addLogBookEntry = function () {
            return __awaiter(this, void 0, void 0, function () {
                var entry, item;
                return __generator(this, function (_a) {
                    entry = {
                        Body: this.entryBody(),
                        Subject: this.entrySubject() || this.defaultEntrySubject,
                        Format: 0,
                        CreatedOn: moment().utc().toMSDate(),
                        ID: uuid.v4(),
                        Author: this.loggedInUserName(),
                        Topic: this.entryTopic()
                    };
                    this.closeSend();
                    try {
                        item = this.connector.addLogbookEntry(entry);
                        this.entryBody(null);
                        this.entrySubject(null);
                        this.entryTopic(null);
                        this.source.getEntries();
                        if (_.indexOf(this.topics(), this.entryTopic()) === -1)
                            this.topics.push(this.entryTopic());
                    }
                    catch (error) {
                        this.connector.handleError(WfLogbookComponent)(error);
                    }
                    return [2 /*return*/];
                });
            });
        };
        WfLogbookComponent.prototype.setEntries = function () {
            this.source = this.connector.getLogbookEntries(this.filter);
            this.logsEntries = this.source.logsEntries;
            this.source.updateRate = this.updateRate;
        };
        WfLogbookComponent.prototype.setFilter = function () {
            this.filter.from(moment(this.startDate()));
            this.getLatestLogdata() ? this.filter.to(null) : this.filter.to(moment(this.endDate()));
            this.filter.topN(this.maxResults());
            this.filter.format(0);
            this.filter.topic(this.selectedTopic());
            this.filtersChanged(false);
        };
        WfLogbookComponent.prototype.applyFilterSettings = function () {
            this.closeSettings();
            this.source.stopPolling();
            this.setFilter();
            this.source.startPolling();
            this.filtersChanged(false);
            if (!this.getLatestLogdata()) {
                this.source.stopPolling();
            }
        };
        WfLogbookComponent.prototype.topicsFiltersChanged = function (obj, event) {
            if (event.originalEvent) { //Triggered by user changing selection?
                this.filtersChanged(true);
            }
        };
        WfLogbookComponent.prototype.showSettings = function () {
            this.showSettingsDialog(true);
        };
        WfLogbookComponent.prototype.closeSettings = function () {
            this.showSettingsDialog(false);
        };
        WfLogbookComponent.prototype.showSend = function () {
            this.showSendDialog(true);
            this.setDefaultTopic();
        };
        WfLogbookComponent.prototype.closeSend = function () {
            this.showSendDialog(false);
            this.isNewAdding(false);
            this.newTopicName(null);
            this.entryBody(null);
            this.entrySubject(null);
        };
        WfLogbookComponent.prototype.getCssClassForTopic = function (topic) {
            var text = "";
            switch (topic) {
                case this.connector.translate("I4SCADA_Danger")():
                    text = "Danger";
                    break;
                case this.connector.translate("I4SCADA_Warning")():
                    text = "Warning";
                    break;
                case this.connector.translate("I4SCADA_Info")():
                    text = "Info";
                    break;
                case this.connector.translate("I4SCADA_Error")():
                    text = "Error";
                    break;
                case this.connector.translate("I4SCADA_Critical")():
                    text = "Critical";
                    break;
                case this.connector.translate("I4SCADA_Maintenance")():
                    text = "Maintenance";
                    break;
                case this.connector.translate("I4SCADA_Success")():
                    text = "Success";
                    break;
                default:
                    text = topic;
            }
            return text ? text.toLowerCase().replace(/ /g, '').replace(/[^a-zA-Z]/g, '') : '';
        };
        WfLogbookComponent.prototype.getConfig = function () {
            var content = {
                getLatestLogdata: this.getLatestLogdata(),
                maxResults: this.maxResults(),
                topic: this.selectedTopic(),
                startDate: moment(this.startDate()).toMSDate(),
                endDate: moment(this.endDate()).toMSDate(),
            };
            return content;
        };
        WfLogbookComponent.prototype.loadConfig = function (content) {
            this.startDate(moment(content.startDate));
            this.endDate(moment(content.endDate));
            this.getLatestLogdata(content.getLatestLogdata);
            this.maxResults(content.maxResults);
            this.selectedTopic(content.topic);
            this.applyFilterSettings();
        };
        WfLogbookComponent.prototype.loadInitialConfiguration = function () {
            return __awaiter(this, void 0, void 0, function () {
                var config, configuration, error_2;
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
                            else {
                                this.source.startPolling();
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            this.connector.handleError(WfLogbookComponent)(error_2);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfLogbookComponent.prototype.handleAddNewTopic = function () {
            this.isNewAdding(true);
        };
        WfLogbookComponent.prototype.breakNewTopic = function () {
            this.isNewAdding(false);
            this.setDefaultTopic();
        };
        WfLogbookComponent.prototype.addNewTopic = function () {
            var newTopic = this.newTopicName();
            this.newTopicName(null);
            this.isNewAdding(false);
            if (!newTopic)
                return;
            if (_.indexOf(this.topicsForNewEntry(), newTopic) === -1)
                this.topicsForNewEntry.push(newTopic);
            this.entryTopic(newTopic);
        };
        WfLogbookComponent.prototype.addDefaultTopics = function (topics) {
            var defaultValues = this.getDefaultTopics();
            if (this.defaultEntryTopic)
                defaultValues.push(this.defaultEntryTopic);
            Array.prototype.push.apply(defaultValues, topics);
            var uniqueValues = _.uniq(defaultValues);
            return uniqueValues;
        };
        WfLogbookComponent.prototype.setDefaultTopic = function () {
            this.defaultEntryTopic ? this.entryTopic(this.defaultEntryTopic) : this.entryTopic(this.topicsForNewEntry()[0]);
        };
        WfLogbookComponent.prototype.getDefaultTopics = function () {
            return [
                this.connector.translate("I4SCADA_Danger")(),
                this.connector.translate("I4SCADA_Warning")(),
                this.connector.translate("I4SCADA_Info")(),
                this.connector.translate("I4SCADA_Error")(),
                this.connector.translate("I4SCADA_Critical")(),
                this.connector.translate("I4SCADA_Maintenance")(),
                this.connector.translate("I4SCADA_Success")(),
            ];
        };
        WfLogbookComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, subscription, formDialog, formBackContainer, settingsDialog, settingsBackContainer;
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
                            this.source.stopPolling();
                            formDialog = $(document).find('#modal-form-' + ko.unwrap(this.id));
                            formBackContainer = $(document).find('#modal-form-back-container-' + ko.unwrap(this.id));
                            settingsDialog = $(document).find('#modal-settings-' + ko.unwrap(this.id));
                            settingsBackContainer = $(document).find('#modal-settings-back-container-' + ko.unwrap(this.id));
                            formDialog.remove();
                            formBackContainer.remove();
                            settingsDialog.remove();
                            settingsBackContainer.remove();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfLogbookComponent;
    }(ComponentBaseModel));
    return WfLogbookComponent;
});
//# sourceMappingURL=wf-logbook.component.js.map